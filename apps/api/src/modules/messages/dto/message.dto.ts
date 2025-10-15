import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ description: 'Message ID' })
  id: string;

  @ApiProperty({ description: 'Event ID' })
  eventId: string;

  @ApiPropertyOptional({ description: 'Attendee ID' })
  attendeeId?: string;

  @ApiProperty({ description: 'Message title' })
  title: string;

  @ApiProperty({ description: 'Message body' })
  body: string;

  @ApiPropertyOptional({ description: 'Message attachments' })
  attachments?: any;

  @ApiProperty({ description: 'Message status' })
  status: string;

  @ApiProperty({ description: 'Unread status' })
  unread: boolean;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;
}

export class MessagesResponseDto {
  @ApiProperty({ type: [MessageDto] })
  data: MessageDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}