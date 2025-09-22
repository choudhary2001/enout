import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AttendeesService } from './attendees.service';
import { AttendeeDto, AttendeesResponseDto } from './dto/attendee.dto';
import { ApiErrorResponse } from '../../common/dto/api-response.dto';

@ApiTags('attendees')
@Controller('events/:eventId/attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all attendees for an event' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'List of attendees',
    type: AttendeesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ApiErrorResponse,
  })
  async getAttendees(@Param('eventId') eventId: string) {
    return this.attendeesService.getAttendees(eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific attendee by ID' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'id', description: 'Attendee ID' })
  @ApiResponse({
    status: 200,
    description: 'Attendee details',
    type: AttendeeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Attendee not found',
    type: ApiErrorResponse,
  })
  async getAttendee(@Param('id') id: string) {
    return this.attendeesService.getAttendee(id);
  }
}
