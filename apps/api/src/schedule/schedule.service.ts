import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleItemDto } from './dto/create-schedule-item.dto';
import { UpdateScheduleItemDto } from './dto/update-schedule-item.dto';
import { ListScheduleDto } from './dto/list-schedule.dto';
import { ScheduleItemDto, ScheduleResponseDto } from './dto/schedule-item.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get paginated list of schedule items for an event
   */
  async getScheduleItems(
    eventId: string,
    query: ListScheduleDto,
  ): Promise<ScheduleResponseDto> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const { page = 1, pageSize = 50, from, to, q } = query;
    const skip = (page - 1) * pageSize;

    // Build where conditions
    const whereConditions: Prisma.ItineraryItemWhereInput = { eventId };

    // Date range filters
    if (from) {
      whereConditions.start = {
        gte: new Date(from),
      };
    }

    if (to) {
      whereConditions.end = {
        lte: new Date(to),
      };
    }

    // Search filter
    if (q) {
      whereConditions.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
        { notes: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Get schedule items
    const items = await this.prisma.itineraryItem.findMany({
      where: whereConditions,
      skip,
      take: pageSize,
      orderBy: {
        start: 'asc',
      },
    });

    // Count total for pagination
    const total = await this.prisma.itineraryItem.count({
      where: whereConditions,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: items.map(this.mapToScheduleItemDto),
      page,
      pageSize,
      total,
      totalPages,
    };
  }

  /**
   * Create a new schedule item
   */
  async createScheduleItem(
    eventId: string,
    dto: CreateScheduleItemDto,
  ): Promise<ScheduleItemDto> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Validate date range
    const startDate = new Date(dto.start);
    const endDate = new Date(dto.end);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Create the schedule item
    const item = await this.prisma.itineraryItem.create({
      data: {
        eventId,
        start: startDate,
        end: endDate,
        title: dto.title,
        location: dto.location,
        notes: dto.notes,
        color: dto.color,
        allDay: dto.allDay || false,
      },
    });

    return this.mapToScheduleItemDto(item);
  }

  /**
   * Update a schedule item
   */
  async updateScheduleItem(
    eventId: string,
    itemId: string,
    dto: UpdateScheduleItemDto,
  ): Promise<ScheduleItemDto> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Verify item exists
    const existingItem = await this.prisma.itineraryItem.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      throw new NotFoundException(`Schedule item with ID ${itemId} not found`);
    }

    // Validate date range if dates are being updated
    if (dto.start || dto.end) {
      const startDate = dto.start ? new Date(dto.start) : existingItem.start;
      const endDate = dto.end ? new Date(dto.end) : existingItem.end;

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    // Update the item
    const updatedItem = await this.prisma.itineraryItem.update({
      where: { id: itemId },
      data: {
        start: dto.start ? new Date(dto.start) : undefined,
        end: dto.end ? new Date(dto.end) : undefined,
        title: dto.title,
        location: dto.location,
        notes: dto.notes,
        color: dto.color,
        allDay: dto.allDay,
      },
    });

    return this.mapToScheduleItemDto(updatedItem);
  }

  /**
   * Delete a schedule item
   */
  async deleteScheduleItem(eventId: string, itemId: string): Promise<void> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Verify item exists
    const item = await this.prisma.itineraryItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Schedule item with ID ${itemId} not found`);
    }

    // Delete the item
    await this.prisma.itineraryItem.delete({
      where: { id: itemId },
    });
  }

  /**
   * Map Prisma model to DTO
   */
  private mapToScheduleItemDto(item: any): ScheduleItemDto {
    return {
      id: item.id,
      eventId: item.eventId,
      start: item.start,
      end: item.end,
      title: item.title,
      location: item.location,
      notes: item.notes,
      color: item.color,
      allDay: item.allDay,
    };
  }
}
