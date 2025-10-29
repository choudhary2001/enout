import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from '../redis.service';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              redis: {
                host: 'localhost',
                port: 6379,
                otpTtl: 300,
                maxAttempts: 3,
              },
            }),
          ],
        }),
      ],
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('OTP Operations', () => {
    const testEmail = 'test@example.com';
    const testOtp = '123456';

    it('should store and verify OTP', async () => {
      // Store OTP
      await service.storeOtp(testEmail, testOtp);

      // Verify OTP
      const isValid = await service.verifyOtp(testEmail, testOtp);
      expect(isValid).toBe(true);
    });

    it('should fail with wrong OTP', async () => {
      // Store OTP
      await service.storeOtp(testEmail, testOtp);

      // Verify wrong OTP
      const isValid = await service.verifyOtp(testEmail, '000000');
      expect(isValid).toBe(false);
    });

    it('should invalidate OTP after max attempts', async () => {
      // Store OTP
      await service.storeOtp(testEmail, testOtp);

      // Make max attempts
      for (let i = 0; i < 3; i++) {
        await service.verifyOtp(testEmail, '000000').catch(() => {});
      }

      // Next attempt should throw
      await expect(service.verifyOtp(testEmail, testOtp))
        .rejects
        .toThrow('Maximum OTP verification attempts exceeded');
    });

    it('should invalidate OTP manually', async () => {
      // Store OTP
      await service.storeOtp(testEmail, testOtp);

      // Invalidate OTP
      await service.invalidateOtp(testEmail);

      // Verify OTP is invalid
      const isValid = await service.verifyOtp(testEmail, testOtp);
      expect(isValid).toBe(false);
    });
  });
});