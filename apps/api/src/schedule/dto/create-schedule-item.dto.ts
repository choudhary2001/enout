import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsBoolean, ValidateIf } from 'class-validator';

export class CreateScheduleItemDto {
  @ApiProperty({ example: '2025-07-15T09:00:00+05:30' })
  @IsDateString()
  start!: string;

  @ApiProperty({ example: '2025-07-15T10:00:00+05:30' })
  @IsDateString()
  end!: string;

  @ApiProperty({ example: 'Welcome Breakfast' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Main Hall', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'Please arrive 15 minutes early', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '#4CAF50', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: false, required: false, default: false })
  @IsOptional()
  @IsBoolean()
  allDay?: boolean = false;
}

