import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, Min, Max } from 'class-validator';

export class AssignRoomDto {
    @ApiProperty({ description: 'Room ID' })
    @IsString()
    roomId: string;

    @ApiProperty({ description: 'Slot number (1, 2, or 3)' })
    @IsInt()
    @Min(1)
    @Max(3)
    slot: number;

    @ApiProperty({ description: 'Attendee ID (or null to unassign)' })
    @IsString()
    attendeeId: string | null;
}

