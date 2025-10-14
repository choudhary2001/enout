import { ApiProperty } from '@nestjs/swagger';

export class ScheduleItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  eventId!: string;

  @ApiProperty()
  start!: Date;

  @ApiProperty()
  end!: Date;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  location?: string | null;

  @ApiProperty({ required: false })
  notes?: string | null;

  @ApiProperty({ required: false })
  color?: string | null;

  @ApiProperty()
  allDay!: boolean;
}

export class ScheduleResponseDto {
  @ApiProperty({ type: [ScheduleItemDto] })
  data!: ScheduleItemDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  totalPages!: number;
}

