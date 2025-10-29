import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailerService } from '../../common/utils/mailer.service';
import { GuestsQueryDto, InviteImportDto, GuestDto } from './dto/invite.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InvitesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) { }

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
    // Ensure page and pageSize are numbers
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const pageSizeNum = typeof pageSize === 'string' ? parseInt(pageSize, 10) : pageSize;

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

    // Get ALL invites for the event (we need to compute derived status for all)
    const allInvites = await this.prisma.invite.findMany({
      where: whereConditions,
    });

    // Map all invites to guest data with derived status
    const allGuests: GuestDto[] = allInvites.map(invite => {
      const attendee = event.attendees.find(a => a.email === invite.email);

      // Determine derived status
      let derivedStatus = 'invited'; // Default to 'invited' since they're in the system

      if (invite.status === 'accepted') {
        derivedStatus = 'accepted';
      } else if (invite.status === 'sent' && invite.lastSentAt) {
        derivedStatus = 'invited';
      } else if (invite.status === 'pending' || !invite.status) {
        // If status is pending or null, they're still considered invited
        derivedStatus = 'invited';
      }

      if (attendee) {
        if (attendee.acceptedAt) {
          const tasks = attendee.tasksJson as any;
          if (tasks && tasks.basic && tasks.phone && tasks.id) {
            derivedStatus = 'registered';
          } else {
            derivedStatus = 'accepted';
          }
        } else if (attendee.phoneVerified) {
          derivedStatus = 'email_verified';
        } else {
          // If attendee exists but not verified, they're still invited
          derivedStatus = 'invited';
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
        // ADD: Registration form fields from attendee
        workEmail: attendee?.workEmail || null,
        location: attendee?.location || null,
        gender: attendee?.gender || null,
        dietaryRequirements: attendee?.dietaryRequirements || null,
        idDocUrl: attendee?.idDocUrl || null,
        phoneVerified: attendee?.phoneVerified || false,
      };
    });

    // Filter by status if specified
    let filteredGuests = allGuests;
    if (status) {
      const statuses = status.split(',');
      filteredGuests = allGuests.filter(g => statuses.includes(g.derivedStatus));
    }

    // Sort the filtered guests
    const sortedGuests = this.sortGuests(filteredGuests, sort);

    // Calculate pagination on the filtered and sorted results
    const total = filteredGuests.length;
    const skip = (pageNum - 1) * pageSizeNum;
    const paginatedGuests = sortedGuests.slice(skip, skip + pageSizeNum);

    return {
      data: paginatedGuests,
      page: pageNum,
      pageSize: pageSizeNum,
      total,
      totalPages: Math.ceil(total / pageSizeNum),
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
   * Create a single invite for an event
   */
  async createInvite(eventId: string, dto: CreateInviteDto): Promise<GuestDto> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Check if email already exists for this event
    const existingInvite = await this.prisma.invite.findUnique({
      where: {
        eventId_email: {
          eventId,
          email: dto.email,
        },
      },
    });

    if (existingInvite) {
      throw new ConflictException(`Email ${dto.email} already exists for this event`);
    }

    // Create the invite
    const invite = await this.prisma.invite.create({
      data: {
        eventId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        countryCode: dto.countryCode,
        phone: dto.phone,
        status: 'pending',
      },
      include: {
        event: {
          select: {
            attendees: {
              where: {
                email: dto.email,
              },
            },
          },
        },
      },
    });

    // Convert to GuestDto format
    return this.mapInviteToGuestDto(invite);
  }

  /**
   * Update an invite
   */
  async updateInvite(eventId: string, inviteId: string, dto: UpdateInviteDto): Promise<GuestDto> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Verify invite exists
    const existingInvite = await this.prisma.invite.findUnique({
      where: { id: inviteId },
    });

    if (!existingInvite) {
      throw new NotFoundException(`Invite with ID ${inviteId} not found`);
    }

    // If email is being updated, check for conflicts
    if (dto.email && dto.email !== existingInvite.email) {
      const emailConflict = await this.prisma.invite.findUnique({
        where: {
          eventId_email: {
            eventId,
            email: dto.email,
          },
        },
      });

      if (emailConflict) {
        throw new ConflictException(`Email ${dto.email} already exists for this event`);
      }
    }

    // Update the invite
    const updatedInvite = await this.prisma.invite.update({
      where: { id: inviteId },
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        countryCode: dto.countryCode,
        phone: dto.phone,
      },
      include: {
        event: {
          select: {
            attendees: {
              where: {
                email: dto.email || existingInvite.email,
              },
            },
          },
        },
      },
    });

    // Convert to GuestDto format
    return this.mapInviteToGuestDto(updatedInvite);
  }

  /**
   * Delete an invite
   */
  async deleteInvite(eventId: string, inviteId: string): Promise<void> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Verify invite exists
    const invite = await this.prisma.invite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new NotFoundException(`Invite with ID ${inviteId} not found`);
    }

    // Delete the invite (related attendee will be handled by cascade if needed)
    await this.prisma.invite.delete({
      where: { id: inviteId },
    });
  }

  /**
   * Map invite to GuestDto format
   */
  private mapInviteToGuestDto(invite: any): GuestDto {
    const attendee = invite.event?.attendees?.[0];

    // Determine derived status - PRIMARY source is invite table status
    let derivedStatus = 'invited'; // Default to 'invited' since they're in the system

    // Primary logic: Use invite table status
    switch (invite.status) {
      case 'accepted':
        derivedStatus = 'accepted';
        break;
      case 'sent':
        if (invite.lastSentAt) {
          derivedStatus = 'invited';
        }
        break;
      case 'pending':
      case null:
      default:
        // If status is pending or null, they're still considered invited
        derivedStatus = 'invited';
        break;
    }

    // Secondary check: If attendee exists and has verified email (OTP), show as email_verified
    if (attendee?.phoneVerified && invite.status === 'sent') {
      derivedStatus = 'email_verified';
    }

    // Final state: If attendee is fully registered (has ID and accepted), show as registered
    if (attendee?.id && attendee?.acceptedAt && invite.status === 'accepted') {
      derivedStatus = 'registered';
    }

    // If attendee exists but not verified yet, they're still invited
    if (attendee && !attendee.phoneVerified && !attendee.acceptedAt) {
      derivedStatus = 'invited';
    }

    return {
      id: invite.id,
      email: invite.email,
      firstName: invite.firstName,
      lastName: invite.lastName,
      phone: invite.phone,
      countryCode: invite.countryCode,
      derivedStatus,
      createdAt: invite.createdAt,
      lastSentAt: invite.lastSentAt,
      acceptedAt: attendee?.acceptedAt,
      // NEW: Add registration form fields from attendee
      workEmail: attendee?.workEmail || null,
      location: attendee?.location || null,
      gender: attendee?.gender || null,
      dietaryRequirements: attendee?.dietaryRequirements || null,
      idDocUrl: attendee?.idDocUrl || null,
      phoneVerified: attendee?.phoneVerified || false,
    };
  }

  /**
   * Sort guests in memory
   */
  private sortGuests(guests: GuestDto[], sort: string): GuestDto[] {
    const sorted = [...guests];

    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'name_asc':
        sorted.sort((a, b) => {
          const nameA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
          const nameB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        break;
      case 'name_desc':
        sorted.sort((a, b) => {
          const nameA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
          const nameB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
          return nameB.localeCompare(nameA);
        });
        break;
      case 'status':
        sorted.sort((a, b) => a.derivedStatus.localeCompare(b.derivedStatus));
        break;
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return sorted;
  }

  /**
   * Get sort order for database query (legacy - no longer used but kept for reference)
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
