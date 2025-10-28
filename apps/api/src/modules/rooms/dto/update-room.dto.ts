import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateRoomDto {
    @ApiProperty({ description: 'Room number', example: '101', required: false })
    @IsString()
    @IsOptional()
    roomNo?: string;

    @ApiProperty({ description: 'Room category', example: 'Deluxe', required: false })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiProperty({ description: 'Maximum number of guests', example: 2, minimum: 1, maximum: 3, required: false })
    @IsInt()
    @Min(1)
    @Max(3)
    @IsOptional()
    maxGuests?: number;
}

