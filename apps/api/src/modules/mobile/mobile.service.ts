import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateAttendeeProfileDto, AttendeeProfileResponseDto } from './dto/attendee-profile.dto';
import { MobileMessageDto, MobileMessagesResponseDto } from './dto/mobile-message.dto';

@Injectable()
export class MobileService {
  private readonly logger = new Logger(MobileService.name);

  constructor(private readonly prisma: PrismaService) {}

  private mapAttendeeToDto(attendee: any): AttendeeProfileResponseDto {
    return {
      id: attendee.id,
      eventId: attendee.eventId,
      email: attendee.email,
      firstName: attendee.firstName,
      lastName: attendee.lastName,
      phone: attendee.phone,
      workEmail: attendee.workEmail,
      location: attendee.location,
      gender: attendee.gender,
      dietaryRequirements: attendee.dietaryRequirements,
      acceptedAt: attendee.acceptedAt,
      tasksJson: attendee.tasksJson,
      idDocUrl: attendee.idDocUrl,
      phoneVerified: attendee.phoneVerified,
      createdAt: attendee.createdAt,
      updatedAt: attendee.updatedAt,
    };
  }

  private mapMessageToDto(message: any): MobileMessageDto {
    return {
      id: message.id,
      eventId: message.eventId,
      attendeeId: message.attendeeId,
      title: message.title,
      body: message.body,
      attachments: message.attachments,
      unread: message.unread,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  async getAttendeeProfile(eventId: string, attendeeId: string): Promise<AttendeeProfileResponseDto> {
    this.logger.debug(`Fetching attendee profile: ${attendeeId} for event: ${eventId}`);
    
    const attendee = await this.prisma.attendee.findFirst({
      where: { id: attendeeId, eventId },
    });

    if (!attendee) {
      this.logger.warn(`Attendee not found: ${attendeeId} for event: ${eventId}`);
      throw new NotFoundException(`Attendee not found`);
    }

    return this.mapAttendeeToDto(attendee);
  }

  async updateAttendeeProfile(
    eventId: string,
    attendeeId: string,
    dto: UpdateAttendeeProfileDto,
  ): Promise<AttendeeProfileResponseDto> {
    this.logger.debug(`Updating attendee profile: ${attendeeId} for event: ${eventId}`, dto);

    const attendee = await this.prisma.attendee.findFirst({
      where: { id: attendeeId, eventId },
    });

    if (!attendee) {
      this.logger.warn(`Attendee not found: ${attendeeId} for event: ${eventId}`);
      throw new NotFoundException(`Attendee not found`);
    }

    const updated = await this.prisma.attendee.update({
      where: { id: attendeeId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        workEmail: dto.workEmail,
        location: dto.location,
        gender: dto.gender,
        dietaryRequirements: dto.dietaryRequirements,
      },
    });

    return this.mapAttendeeToDto(updated);
  }

  async getMobileMessages(eventId: string, attendeeId?: string): Promise<MobileMessagesResponseDto> {
    this.logger.debug(`Fetching mobile messages for event: ${eventId}, attendee: ${attendeeId}`);

    const [messages, total] = await Promise.all([
      this.prisma.mobileMessage.findMany({
        where: { eventId, ...(attendeeId ? { attendeeId } : {}) },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.mobileMessage.count({
        where: { eventId, ...(attendeeId ? { attendeeId } : {}) },
      }),
    ]);

    this.logger.debug(`Found ${messages.length} messages`);

    return {
      data: messages.map(this.mapMessageToDto),
      total,
      page: 1,
      pageSize: messages.length,
      totalPages: 1,
    };
  }

  async getMobileMessage(eventId: string, messageId: string): Promise<MobileMessageDto> {
    this.logger.debug(`Fetching mobile message: ${messageId} for event: ${eventId}`);

    const message = await this.prisma.mobileMessage.findFirst({
      where: { id: messageId, eventId },
    });

    if (!message) {
      this.logger.warn(`Message not found: ${messageId} for event: ${eventId}`);
      throw new NotFoundException(`Message not found`);
    }

    return this.mapMessageToDto(message);
  }

  async acknowledgeMessage(messageId: string): Promise<{ ok: boolean }> {
    this.logger.debug(`Acknowledging message: ${messageId}`);

    const message = await this.prisma.mobileMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      this.logger.warn(`Message not found: ${messageId}`);
      throw new NotFoundException(`Message not found`);
    }

    await this.prisma.mobileMessage.update({
      where: { id: messageId },
      data: { unread: false },
    });

    return { ok: true };
  }
}