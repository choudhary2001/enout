import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyAttendeeOtpDto {
  @ApiProperty({
    description: 'Event ID',
    example: 'event-123',
  })
  @IsString()
  eventId: string;

  @ApiProperty({
    description: 'Attendee email address',
    example: 'attendee@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'OTP code to verify',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  otp: string;
}
