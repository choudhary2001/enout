import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AttendeeDto } from './dto/attendee.dto';

@Injectable()
export class AttendeesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all attendees for an event
   */
  async getAttendees(eventId: string): Promise<{ data: AttendeeDto[], count: number }> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Get all attendees for the event
    const attendees = await this.prisma.attendee.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: attendees as AttendeeDto[],
      count: attendees.length,
    };
  }

  /**
   * Get a specific attendee by ID
   */
  async getAttendee(id: string): Promise<AttendeeDto> {
    const attendee = await this.prisma.attendee.findUnique({
      where: { id },
    });

    if (!attendee) {
      throw new NotFoundException(`Attendee with ID ${id} not found`);
    }

    return attendee as AttendeeDto;
  }
}
