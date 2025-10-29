import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestEmailOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email!: string;

  @ApiProperty({ example: 'clq1234567890abcdefghijkl' })
  @IsString()
  @IsNotEmpty()
  eventId!: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email!: string;

  @ApiProperty({ example: '12345', description: '5-digit OTP code' })
  @IsString()
  @Length(5, 5)
  code!: string;

  @ApiProperty({ example: 'clq1234567890abcdefghijkl' })
  @IsString()
  @IsNotEmpty()
  eventId!: string;
}

export class RequestEmailOtpResponseDto {
  @ApiProperty({ example: true })
  ok?: boolean;

  @ApiProperty({ example: 'not_found', required: false })
  inviteStatus?: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token?: string;

  @ApiProperty({ example: 'pending', enum: ['not_found', 'pending', 'accepted'] })
  inviteStatus!: string;

  @ApiProperty({ required: false })
  attendee?: Record<string, any>;
}
