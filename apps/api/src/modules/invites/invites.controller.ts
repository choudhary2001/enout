import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvitesService } from './invites.service';
import { GuestsQueryDto, GuestsResponseDto, InviteImportDto } from './dto/invite.dto';
import { ApiErrorResponse } from '../../common/dto/api-response.dto';

@ApiTags('invites')
@Controller('events/:eventId/invites')
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
}
