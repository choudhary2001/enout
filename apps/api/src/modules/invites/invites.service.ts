import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailerService } from '../../common/utils/mailer.service';
import { GuestsQueryDto, InviteImportDto, GuestDto } from './dto/invite.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InvitesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * Get paginated list of guests (combined invites and attendees) for an event
   */
  async getGuests(eventId: string, query: GuestsQueryDto): Promise<{
    data: GuestDto[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { attendees: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const { page = 1, pageSize = 20, query: searchQuery, status, sort = 'newest' } = query;
    const skip = (page - 1) * pageSize;

    // Build where conditions for the search
    const whereConditions: Prisma.InviteWhereInput = { eventId };
    
    if (searchQuery) {
      whereConditions.OR = [
        { email: { contains: searchQuery, mode: 'insensitive' } },
        { firstName: { contains: searchQuery, mode: 'insensitive' } },
        { lastName: { contains: searchQuery, mode: 'insensitive' } },
        { phone: { contains: searchQuery } },
      ];
    }

    // Get all invites for the event
    const invites = await this.prisma.invite.findMany({
      where: whereConditions,
      include: {
        event: {
          select: {
            attendees: {
              where: {
                email: {
                  in: await this.prisma.invite.findMany({
                    where: whereConditions,
                    select: { email: true },
                  }).then(invites => invites.map(invite => invite.email)),
                },
              },
            },
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: this.getSortOrder(sort),
    });

    // Count total for pagination
    const total = await this.prisma.invite.count({
      where: whereConditions,
    });

    // Map invites to combined guest data with derived status
    const guests = invites.map(invite => {
      const attendee = event.attendees.find(a => a.email === invite.email);
      
      // Determine derived status
      let derivedStatus = 'invited';
      
      if (attendee) {
        if (attendee.acceptedAt) {
          const tasks = attendee.tasksJson as any;
          if (tasks && tasks.basic && tasks.phone && tasks.id) {
            derivedStatus = 'registered';
          } else {
            derivedStatus = 'accepted';
          }
        } else {
          derivedStatus = 'email_verified';
        }
      }
      
      // Filter by status if specified
      if (status) {
        const statuses = status.split(',');
        if (!statuses.includes(derivedStatus)) {
          return null;
        }
      }

      return {
        id: invite.id,
        email: invite.email,
        firstName: invite.firstName || attendee?.firstName,
        lastName: invite.lastName || attendee?.lastName,
        phone: invite.phone || attendee?.phone,
        countryCode: invite.countryCode,
        derivedStatus,
        createdAt: invite.createdAt,
        lastSentAt: invite.lastSentAt,
        acceptedAt: attendee?.acceptedAt,
      };
    }).filter(Boolean) as GuestDto[];

    return {
      data: guests,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Import multiple invites for an event
   */
  async importInvites(eventId: string, dto: InviteImportDto): Promise<{ count: number }> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Process each invite row
    const results = await Promise.all(
      dto.rows.map(async (row) => {
        // Normalize email to lowercase
        const email = row.email.toLowerCase();

        // Upsert invite
        return this.prisma.invite.upsert({
          where: {
            eventId_email: {
              eventId,
              email,
            },
          },
          update: {
            firstName: row.firstName,
            lastName: row.lastName,
            countryCode: row.countryCode,
            phone: row.phone,
          },
          create: {
            eventId,
            email,
            firstName: row.firstName,
            lastName: row.lastName,
            countryCode: row.countryCode,
            phone: row.phone,
            status: 'pending',
          },
        });
      }),
    );

    return { count: results.length };
  }

  /**
   * Send invitation email to a guest
   */
  async sendInvite(eventId: string, inviteId: string): Promise<{ sent: boolean }> {
    // Find invite with event details
    const invite = await this.prisma.invite.findFirst({
      where: { id: inviteId, eventId },
      include: { event: true },
    });

    if (!invite) {
      throw new NotFoundException(`Invite with ID ${inviteId} not found for event ${eventId}`);
    }

    // Update invite status and lastSentAt
    await this.prisma.invite.update({
      where: { id: inviteId },
      data: {
        status: 'sent',
        lastSentAt: new Date(),
      },
    });

    // Send email (stub implementation)
    await this.mailerService.sendEmail(
      invite.email,
      `Invitation to ${invite.event.name}`,
      `You have been invited to ${invite.event.name}. Please check your email for more details.`,
      `<h1>You're invited!</h1><p>You have been invited to ${invite.event.name}.</p>`,
    );

    return { sent: true };
  }

  /**
   * Resend invitation email to a guest
   */
  async resendInvite(eventId: string, inviteId: string): Promise<{ sent: boolean }> {
    // This is the same as sendInvite for now
    return this.sendInvite(eventId, inviteId);
  }

  /**
   * Get sort order for database query
   */
  private getSortOrder(sort: string): Record<string, 'asc' | 'desc'> {
    switch (sort) {
      case 'newest':
        return { createdAt: 'desc' };
      case 'oldest':
        return { createdAt: 'asc' };
      case 'name':
        return { firstName: 'asc' };
      case 'status':
        return { status: 'asc' };
      default:
        return { createdAt: 'desc' };
    }
  }
}
