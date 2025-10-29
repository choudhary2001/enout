import { ApiProperty } from '@nestjs/swagger';

export class AttendeeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ required: false })
  phone?: string | null;

  @ApiProperty({ required: false })
  city?: string | null;

  @ApiProperty({ required: false })
  mealPref?: string | null;

  @ApiProperty({ required: false })
  drinkPref?: string | null;

  @ApiProperty({ required: false })
  acceptedAt?: Date | null;

  @ApiProperty()
  tasksJson!: Record<string, any>;

  @ApiProperty({ required: false })
  idDocUrl?: string | null;

  @ApiProperty()
  phoneVerified!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class AttendeesResponseDto {
  @ApiProperty({ type: [AttendeeDto] })
  data!: AttendeeDto[];

  @ApiProperty()
  count!: number;
}
