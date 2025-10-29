import { UnauthorizedException } from '@nestjs/common';

export class OtpException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidOtpException extends OtpException {
  constructor() {
    super('Invalid OTP code');
  }
}

export class OtpExpiredException extends OtpException {
  constructor() {
    super('OTP code has expired');
  }
}