import { Controller, Get, Patch, Post, Body, Param, HttpCode, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MobileService } from './mobile.service';
import { UpdateAttendeeProfileDto, AttendeeProfileResponseDto } from './dto/attendee-profile.dto';
import { MobileMessageDto, MobileMessagesResponseDto } from './dto/mobile-message.dto';
import { ApiErrorResponse } from '../../common/dto/api-response.dto';

@ApiTags('mobile')
@Controller()
export class MobileController {
  private readonly logger = new Logger(MobileController.name);
  private readonly TEST_ATTENDEE_ID = 'cmgeqhtvn0001gsqbownyjgmr';

  constructor(private readonly mobileService: MobileService) {}

  @Get('/events/:eventId/profile')
  @ApiOperation({ summary: 'Get current attendee profile' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Attendee profile',
    type: AttendeeProfileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Attendee not found',
    type: ApiErrorResponse,
  })
  async getAttendeeProfile(@Param('eventId') eventId: string): Promise<AttendeeProfileResponseDto> {
    this.logger.debug(`Getting profile for attendee ${this.TEST_ATTENDEE_ID} in event ${eventId}`);
    return this.mobileService.getAttendeeProfile(eventId, this.TEST_ATTENDEE_ID);
  }

  @Patch('/events/:eventId/profile')
  @ApiOperation({ summary: 'Update current attendee profile' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: AttendeeProfileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Attendee not found',
    type: ApiErrorResponse,
  })
  async updateAttendeeProfile(
    @Param('eventId') eventId: string,
    @Body() dto: UpdateAttendeeProfileDto,
  ): Promise<AttendeeProfileResponseDto> {
    this.logger.debug(`Updating profile for attendee ${this.TEST_ATTENDEE_ID} in event ${eventId}`, dto);
    return this.mobileService.updateAttendeeProfile(eventId, this.TEST_ATTENDEE_ID, dto);
  }

  @Get('/events/:eventId/mobile-messages')
  @ApiOperation({ summary: 'List mobile messages' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'List of messages',
    type: MobileMessagesResponseDto,
  })
  async getMobileMessages(@Param('eventId') eventId: string): Promise<MobileMessagesResponseDto> {
    this.logger.debug(`Getting messages for attendee ${this.TEST_ATTENDEE_ID} in event ${eventId}`);
    return this.mobileService.getMobileMessages(eventId, this.TEST_ATTENDEE_ID);
  }

  @Get('/events/:eventId/mobile-messages/:id')
  @ApiOperation({ summary: 'Get a specific mobile message' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Message details',
    type: MobileMessageDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
    type: ApiErrorResponse,
  })
  async getMobileMessage(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ): Promise<MobileMessageDto> {
    this.logger.debug(`Getting message ${id} in event ${eventId}`);
    return this.mobileService.getMobileMessage(eventId, id);
  }

  @Post('/events/:eventId/mobile-messages/:id/acknowledge')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mark a message as read' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Message marked as read',
    schema: {
      type: 'object',
      properties: {
        ok: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
    type: ApiErrorResponse,
  })
  async acknowledgeMessage(
    @Param('id') id: string,
  ): Promise<{ ok: boolean }> {
    this.logger.debug(`Acknowledging message ${id}`);
    return this.mobileService.acknowledgeMessage(id);
  }
}