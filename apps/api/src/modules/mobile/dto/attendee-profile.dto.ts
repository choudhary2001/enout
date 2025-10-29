import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateAttendeeProfileDto {
  @ApiProperty({ required: false, example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false, example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false, example: 'john.doe@company.com' })
  @IsEmail()
  @IsOptional()
  workEmail?: string;

  @ApiProperty({ required: false, example: 'New York' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false, example: 'male' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ required: false, example: 'Vegetarian' })
  @IsString()
  @IsOptional()
  dietaryRequirements?: string;
}

export class AttendeeProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  eventId!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  workEmail?: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  gender?: string;

  @ApiProperty({ required: false })
  dietaryRequirements?: string;

  @ApiProperty({ required: false })
  acceptedAt?: Date;

  @ApiProperty()
  tasksJson!: Record<string, any>;

  @ApiProperty({ required: false })
  idDocUrl?: string;

  @ApiProperty()
  phoneVerified!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
