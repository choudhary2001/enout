import { UnauthorizedException } from '@nestjs/common';

export class InvalidOtpException extends UnauthorizedException {
  constructor() {
    super('Invalid OTP code');
  }
}

export class OtpAttemptsExceededException extends UnauthorizedException {
  constructor() {
    super('Maximum OTP attempts exceeded');
  }
}