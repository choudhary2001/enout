import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Welcome to the Event!' })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({ example: '<p>We are excited to have you join us...</p>' })
  @IsString()
  @IsNotEmpty()
  bodyHtml!: string;

  @ApiProperty({ required: false, example: '2025-07-20T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
