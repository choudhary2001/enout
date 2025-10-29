import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListScheduleDto {
  @ApiProperty({ 
    required: false, 
    example: '2025-07-15T00:00:00+05:30',
    description: 'Filter items starting from this date'
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({ 
    required: false, 
    example: '2025-07-18T23:59:59+05:30',
    description: 'Filter items ending before this date'
  })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiProperty({ 
    required: false, 
    example: 'breakfast',
    description: 'Search in title, location, and notes'
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, default: 50, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  pageSize?: number = 50;
}

