import { Controller, Get, Patch, Post, Body, Param, HttpCode, Logger, UseGuards, UploadedFile, UseInterceptors, Query, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MobileService } from './mobile.service';
import { UpdateAttendeeProfileDto, AttendeeProfileResponseDto } from './dto/attendee-profile.dto';
import { MobileMessageDto, MobileMessagesResponseDto } from './dto/mobile-message.dto';
import { ApiErrorResponse } from '../../common/dto/api-response.dto';
import { MobileJwtAuthGuard } from '../auth/guards/mobile-jwt-auth.guard';
import { MobileUser } from '../auth/decorators/mobile-user.decorator';
import { Attendee } from '@prisma/client';

@ApiTags('mobile')
@Controller('api')
export class MobileController {
  private readonly logger = new Logger(MobileController.name);
  private readonly TEST_ATTENDEE_ID = 'cmgeqhtvn0001gsqbownyjgmr';

  constructor(private readonly mobileService: MobileService) { }

  @Get('/events/:eventId')
  @ApiOperation({ summary: 'Get event details for mobile' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Event details',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ApiErrorResponse,
  })
  async getEventDetails(@Param('eventId') eventId: string) {
    this.logger.debug(`Getting event details for: ${eventId}`);
    return this.mobileService.getEventDetails(eventId);
  }


  @Get('/events/:eventId/profile')
  @UseGuards(MobileJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current attendee profile' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Attendee profile',
    type: AttendeeProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Attendee not found',
    type: ApiErrorResponse,
  })
  async getAttendeeProfile(
    @Param('eventId') eventId: string,
    @MobileUser() attendee: Attendee,
  ): Promise<AttendeeProfileResponseDto> {
    console.log('=== getAttendeeProfile Controller ===');
    console.log('EventId:', eventId);
    console.log('Attendee:', attendee ? { id: attendee.id, email: attendee.email } : 'none');
    this.logger.debug(`Getting profile for attendee: ${attendee?.id} in event ${eventId}`);

    if (!attendee) {
      throw new UnauthorizedException('No attendee found in request');
    }

    return this.mobileService.getAttendeeProfile(eventId, attendee.id);
  }

  @Patch('/events/:eventId/profile')
  @UseGuards(MobileJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current attendee profile' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: AttendeeProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Attendee not found',
    type: ApiErrorResponse,
  })
  async updateAttendeeProfile(
    @Param('eventId') eventId: string,
    @MobileUser() attendee: Attendee,
    @Body() dto: UpdateAttendeeProfileDto,
  ): Promise<AttendeeProfileResponseDto> {
    this.logger.debug(`Updating profile for attendee: ${attendee.id} in event ${eventId}`, dto);

    // Now update the profile using the authenticated attendee's ID
    return this.mobileService.updateAttendeeProfile(eventId, attendee.id, dto);
  }

  @Post('/events/:eventId/upload-documents')
  @HttpCode(200)
  @UseGuards(MobileJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload ID document for attendee' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Document uploaded successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Attendee not found',
    type: ApiErrorResponse,
  })
  // Remove FileInterceptor since we're handling JSON payloads now
  // @UseInterceptors(FileInterceptor('document', {
  //   limits: {
  //     fileSize: 10 * 1024 * 1024, // 10MB limit
  //   },
  //   fileFilter: (req, file, callback) => {
  //     // Accept all files for now, can add type validation later
  //     callback(null, true);
  //   }
  // }))
  async uploadDocument(
    @Param('eventId') eventId: string,
    @Body() body: any,
    @MobileUser() attendee: Attendee,
  ): Promise<{ ok: boolean; message: string; idDocUrl?: string }> {
    this.logger.debug(`Upload request - hasBody: ${!!body}`);
    this.logger.debug('Body keys:', Object.keys(body || {}));

    // Handle JSON payload with base64 file data
    if (!body.document) {
      this.logger.error('No document found in request body');
      throw new BadRequestException('No document uploaded. Please ensure you are sending a document in the request body.');
    }

    const document = body.document;
    this.logger.debug('Document object:', {
      documentType: typeof document,
      keys: Object.keys(document || {}),
      hasData: !!document?.data,
      name: document?.name,
      mimeType: document?.type,
      size: document?.size
    });

    if (!document.data) {
      this.logger.error('No file data found in document');
      throw new BadRequestException('No file data provided. Please ensure the document contains base64 data.');
    }

    // Create a file-like object for the service
    const fileObject = {
      data: document.data,
      name: document.name || 'document.pdf',
      type: document.type || 'application/pdf',
      size: document.size || document.data.length
    };

    this.logger.debug(`Processing upload for attendee: ${attendee.id}`);
    this.logger.debug('File object created:', {
      hasData: !!fileObject.data,
      name: fileObject.name,
      type: fileObject.type,
      size: fileObject.size
    });

    return await this.mobileService.uploadDocument(eventId, attendee.email, fileObject);
  }

  @Get('/events/:eventId/mobile-messages')
  @UseGuards(MobileJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List mobile messages' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'List of messages',
    type: MobileMessagesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  async getMobileMessages(
    @Param('eventId') eventId: string,
    @MobileUser() attendee: Attendee,
  ): Promise<MobileMessagesResponseDto> {
    console.log('=== getMobileMessages Controller DEBUG ===');
    console.log('Getting messages for attendee:', attendee.id, 'in event:', eventId);

    return this.mobileService.getMobileMessages(eventId, attendee.id);
  }

  @Get('/events/:eventId/mobile-messages/:id')
  @UseGuards(MobileJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific mobile message' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Message details',
    type: MobileMessageDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
    type: ApiErrorResponse,
  })
  async getMobileMessage(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @MobileUser() attendee: Attendee,
  ): Promise<MobileMessageDto> {
    this.logger.debug(`Getting message ${id} in event ${eventId} for attendee ${attendee.id}`);
    return this.mobileService.getMobileMessage(eventId, id);
  }

  @Post('/events/:eventId/mobile-messages/:id/acknowledge')
  @HttpCode(200)
  @UseGuards(MobileJwtAuthGuard)
  @ApiBearerAuth()
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
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
    type: ApiErrorResponse,
  })
  async acknowledgeMessage(
    @Param('id') id: string,
    @MobileUser() attendee: Attendee,
  ): Promise<{ ok: boolean }> {
    this.logger.debug(`Acknowledging message ${id} for attendee ${attendee.id}`);
    return this.mobileService.acknowledgeMessage(id);
  }
}