import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { InvalidOtpException, OtpAttemptsExceededException } from '../../common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(email: string): Promise<void> {
    // For development, just log the OTP
    const otp = '123456';
    console.log(`OTP for ${email}: ${otp}`);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    // For development, accept any OTP
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    return true;
  }

  async verifyAttendeeOtp(eventId: string, email: string, otp: string): Promise<boolean> {
    // For development, accept any OTP
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    return true;
  }

  async login(email: string) {
    const payload = { email, sub: email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}