import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, Min, Max } from 'class-validator';

export class CreateRoomDto {
    @ApiProperty({ description: 'Room number', example: '101' })
    @IsString()
    roomNo: string;

    @ApiProperty({ description: 'Room category', example: 'Deluxe' })
    @IsString()
    category: string;

    @ApiProperty({ description: 'Maximum number of guests', example: 2, minimum: 1, maximum: 3 })
    @IsInt()
    @Min(1)
    @Max(3)
    maxGuests: number;
}

