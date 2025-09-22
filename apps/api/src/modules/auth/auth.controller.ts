import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { 
  RequestEmailOtpDto, 
  VerifyEmailDto, 
  RequestEmailOtpResponseDto,
  VerifyEmailResponseDto
} from './dto/auth.dto';
import { ApiErrorResponse } from '../../common/dto/api-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-email-otp')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request an email OTP for authentication' })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP sent successfully or invite not found',
    type: RequestEmailOtpResponseDto,
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request or rate limited',
    type: ApiErrorResponse,
  })
  async requestEmailOtp(
    @Body() dto: RequestEmailOtpDto,
    @Req() req: Request,
  ): Promise<RequestEmailOtpResponseDto> {
    const ip = req.ip || '127.0.0.1';
    return this.authService.requestEmailOtp(dto, ip);
  }

  @Post('verify-email')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify email with OTP and issue JWT token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Email verified successfully or invite not found',
    type: VerifyEmailResponseDto,
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request or invalid OTP',
    type: ApiErrorResponse,
  })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<VerifyEmailResponseDto> {
    return this.authService.verifyEmail(dto);
  }
}
