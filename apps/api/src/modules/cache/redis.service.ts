import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisConfig } from './config/redis.config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly config: RedisConfig;
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<RedisConfig>('redis')!;

    this.client = new Redis({
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    // Log Redis events
    this.client.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });

    this.client.on('connect', () => {
      this.logger.log('Connected to Redis');
    });
  }

  async onModuleInit() {
    try {
      // Test connection
      await this.client.ping();
      this.logger.log('Redis connection verified');
    } catch (err) {
      const error = err as Error;
      this.logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis connection closed');
  }

  private getOtpKey(email: string): string {
    return `otp:${email}`;
  }

  private getOtpAttemptsKey(email: string): string {
    return `otp:attempts:${email}`;
  }

  /**
   * Store OTP for a given email
   * @param email - User's email
   * @param otp - Generated OTP
   * @returns Promise<void>
   */
  async storeOtp(email: string, otp: string): Promise<void> {
    const otpKey = this.getOtpKey(email);
    const attemptsKey = this.getOtpAttemptsKey(email);

    try {
      // Use multi to ensure atomic operation
      await this.client
        .multi()
        .set(otpKey, otp, 'EX', this.config.otpTtl)
        .set(attemptsKey, '0', 'EX', this.config.otpTtl)
        .exec();

      this.logger.debug(`Stored OTP for ${email}`);
    } catch (err) {
      const error = err as Error;
      this.logger.error(`Failed to store OTP for ${email}:`, error);
      throw new Error('Failed to store OTP');
    }
  }

  /**
   * Verify OTP for a given email
   * @param email - User's email
   * @param otp - OTP to verify
   * @returns Promise<boolean>
   */
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpKey = this.getOtpKey(email);
    const attemptsKey = this.getOtpAttemptsKey(email);

    try {
      // Get stored OTP and attempts
      const [storedOtp, attempts] = await Promise.all([
        this.client.get(otpKey),
        this.client.get(attemptsKey),
      ]);

      // Check if OTP exists
      if (!storedOtp) {
        this.logger.debug(`No OTP found for ${email}`);
        return false;
      }

      // Check attempts
      const currentAttempts = parseInt(attempts || '0', 10);
      if (currentAttempts >= this.config.maxAttempts) {
        this.logger.warn(`Max OTP attempts exceeded for ${email}`);
        await this.invalidateOtp(email);
        throw new Error('Maximum OTP verification attempts exceeded');
      }

      // Increment attempts
      await this.client.incr(attemptsKey);

      // Verify OTP
      const isValid = storedOtp === otp;
      if (isValid) {
        await this.invalidateOtp(email);
        this.logger.debug(`OTP verified successfully for ${email}`);
      } else {
        this.logger.debug(`Invalid OTP attempt for ${email}`);
      }

      return isValid;
    } catch (err) {
      const error = err as Error;
      if (error.message === 'Maximum OTP verification attempts exceeded') {
        throw error;
      }
      this.logger.error(`Failed to verify OTP for ${email}:`, error);
      throw new Error('Failed to verify OTP');
    }
  }

  /**
   * Invalidate OTP for a given email
   * @param email - User's email
   * @returns Promise<void>
   */
  async invalidateOtp(email: string): Promise<void> {
    const otpKey = this.getOtpKey(email);
    const attemptsKey = this.getOtpAttemptsKey(email);

    try {
      await this.client.del(otpKey, attemptsKey);
      this.logger.debug(`Invalidated OTP for ${email}`);
    } catch (err) {
      const error = err as Error;
      this.logger.error(`Failed to invalidate OTP for ${email}:`, error);
      throw new Error('Failed to invalidate OTP');
    }
  }
}