import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('otp/send')
  @ApiOperation({ summary: 'Send OTP' })
  @ApiResponse({ status: 200 })
  async sendOtp(@Body() dto: { email: string }): Promise<void> {
    await this.authService.sendOtp(dto.email);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ status: 200 })
  async verifyOtp(@Body() dto: { email: string; otp: string }): Promise<{ access_token: string }> {
    const verified = await this.authService.verifyOtp(dto.email, dto.otp);
    if (!verified) {
      throw new Error('Invalid OTP');
    }
    return this.authService.login(dto.email);
  }

  @Post('attendee/verify')
  @ApiOperation({ summary: 'Verify attendee OTP' })
  @ApiResponse({ status: 200 })
  async verifyAttendeeOtp(@Body() dto: { eventId: string; email: string; otp: string }): Promise<{ access_token: string }> {
    const verified = await this.authService.verifyAttendeeOtp(dto.eventId, dto.email, dto.otp);
    if (!verified) {
      throw new Error('Invalid OTP');
    }
    return this.authService.login(dto.email);
  }
}