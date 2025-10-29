import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvitesService } from './invites.service';
import { GuestsQueryDto, GuestsResponseDto, InviteImportDto } from './dto/invite.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { ApiErrorResponse } from '../../common/dto/api-response.dto';

@ApiTags('invites')
@Controller('api/events/:eventId/invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all invites for an event' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'List of invites',
    type: GuestsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ApiErrorResponse,
  })
  async getGuests(
    @Param('eventId') eventId: string,
    @Query() query: GuestsQueryDto,
  ) {
    return this.invitesService.getGuests(eventId, query);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import multiple invites for an event' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 201,
    description: 'Invites imported successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ApiErrorResponse,
  })
  async importInvites(
    @Param('eventId') eventId: string,
    @Body() dto: InviteImportDto,
  ) {
    return this.invitesService.importInvites(eventId, dto);
  }

  @Post(':inviteId/send')
  @ApiOperation({ summary: 'Send invitation email to a guest' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'inviteId', description: 'Invite ID' })
  @ApiResponse({
    status: 200,
    description: 'Invitation sent successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Event or invite not found',
    type: ApiErrorResponse,
  })
  async sendInvite(
    @Param('eventId') eventId: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.invitesService.sendInvite(eventId, inviteId);
  }

  @Post(':inviteId/resend')
  @ApiOperation({ summary: 'Resend invitation email to a guest' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'inviteId', description: 'Invite ID' })
  @ApiResponse({
    status: 200,
    description: 'Invitation resent successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Event or invite not found',
    type: ApiErrorResponse,
  })
  async resendInvite(
    @Param('eventId') eventId: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.invitesService.resendInvite(eventId, inviteId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a single invite for an event' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 201,
    description: 'Invite created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or email already exists',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ApiErrorResponse,
  })
  async createInvite(
    @Param('eventId') eventId: string,
    @Body() dto: CreateInviteDto,
  ) {
    return this.invitesService.createInvite(eventId, dto);
  }

  @Patch(':inviteId')
  @ApiOperation({ summary: 'Update an invite' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'inviteId', description: 'Invite ID' })
  @ApiResponse({
    status: 200,
    description: 'Invite updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or email already exists',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Event or invite not found',
    type: ApiErrorResponse,
  })
  async updateInvite(
    @Param('eventId') eventId: string,
    @Param('inviteId') inviteId: string,
    @Body() dto: UpdateInviteDto,
  ) {
    return this.invitesService.updateInvite(eventId, inviteId, dto);
  }

  @Delete(':inviteId')
  @ApiOperation({ summary: 'Delete an invite' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'inviteId', description: 'Invite ID' })
  @ApiResponse({
    status: 204,
    description: 'Invite deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Event or invite not found',
    type: ApiErrorResponse,
  })
  async deleteInvite(
    @Param('eventId') eventId: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.invitesService.deleteInvite(eventId, inviteId);
  }
}
