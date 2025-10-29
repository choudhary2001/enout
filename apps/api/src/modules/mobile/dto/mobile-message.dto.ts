import { ApiProperty } from '@nestjs/swagger';

export class MobileMessageDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  eventId!: string;

  @ApiProperty()
  attendeeId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  body!: string;

  @ApiProperty({ type: 'object' })
  attachments!: Record<string, any>;

  @ApiProperty()
  unread!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class MobileMessagesResponseDto {
  @ApiProperty({ type: [MobileMessageDto] })
  data!: MobileMessageDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  @ApiProperty()
  totalPages!: number;
}
