import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../common/utils/redis.service';
import { MailerService } from '../../common/utils/mailer.service';
import { RateLimiterService } from '../../common/utils/rate-limiter.util';
import { JwtService } from '../../common/utils/jwt.service';
import { generateOtp } from '../../common/utils/otp.util';
import { RequestEmailOtpDto, VerifyEmailDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly OTP_TTL = 300; // 5 minutes
  private readonly THROTTLE_TTL = 60; // 1 minute

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
    private readonly rateLimiterService: RateLimiterService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Request an email OTP for authentication
   */
  async requestEmailOtp(dto: RequestEmailOtpDto, ip: string) {
    const { email, eventId } = dto;
    
    // Check if event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Check for rate limiting
    const throttleKey = `otp:throttle:${ip}:${email}`;
    const isRateLimited = await this.rateLimiterService.isRateLimited(throttleKey, this.THROTTLE_TTL);
    
    if (isRateLimited) {
      const remainingTime = await this.rateLimiterService.getRemainingTime(throttleKey);
      throw new BadRequestException(`Too many requests. Please try again in ${remainingTime} seconds.`);
    }

    // Check if invite exists
    const invite = await this.prisma.invite.findUnique({
      where: {
        eventId_email: {
          eventId,
          email,
        },
      },
    });

    if (!invite) {
      // Still rate limit even if invite doesn't exist
      await this.rateLimiterService.isRateLimited(throttleKey, this.THROTTLE_TTL);
      return { inviteStatus: 'not_found' };
    }

    // Generate OTP
    const otp = generateOtp(5);
    const otpKey = `otp:${eventId}:${email}`;
    
    // Store OTP in Redis with TTL
    await this.redisService.set(otpKey, otp, this.OTP_TTL);
    
    // Send OTP via email
    await this.mailerService.sendOtpEmail(email, otp, eventId);
    console.log(`OTP ${otp} for ${email} (event ${eventId})`);
    
    return { ok: true };
  }

  /**
   * Verify email with OTP and issue JWT token
   */
  async verifyEmail(dto: VerifyEmailDto) {
    const { email, code, eventId } = dto;
    
    // Check if event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Check if invite exists
    const invite = await this.prisma.invite.findUnique({
      where: {
        eventId_email: {
          eventId,
          email,
        },
      },
    });

    if (!invite) {
      return { inviteStatus: 'not_found' };
    }

    // Verify OTP
    const otpKey = `otp:${eventId}:${email}`;
    const storedOtp = await this.redisService.get(otpKey);
    
    if (!storedOtp || storedOtp !== code) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Delete OTP after successful verification
    await this.redisService.del(otpKey);

    // Upsert attendee record
    const attendee = await this.prisma.attendee.upsert({
      where: {
        eventId_email: {
          eventId,
          email,
        },
      },
      update: {}, // No update needed if already exists
      create: {
        eventId,
        email,
        firstName: invite.firstName || '',
        lastName: invite.lastName || '',
        phone: invite.phone,
      },
    });

    // Issue JWT token
    const token = this.jwtService.sign({
      sub: attendee.id,
      email: attendee.email,
      eventId,
    });

    return {
      token,
      inviteStatus: invite.status,
      attendee,
    };
  }
}
