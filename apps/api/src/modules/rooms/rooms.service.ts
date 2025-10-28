import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AssignRoomDto } from './dto/assign-room.dto';

@Injectable()
export class RoomsService {
    constructor(private readonly prisma: PrismaService) { }

    async getRooms(
        eventId: string,
        filters: { page: number | string; pageSize: number | string; category?: string; search?: string },
    ) {
        // Convert page and pageSize to numbers if they're strings
        const pageNum = typeof filters.page === 'string' ? parseInt(filters.page, 10) : filters.page;
        const pageSizeNum = typeof filters.pageSize === 'string' ? parseInt(filters.pageSize, 10) : filters.pageSize;
        // Verify event exists
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }

        // Build where clause
        const where: any = { eventId };
        if (filters.category) {
            where.category = filters.category;
        }
        if (filters.search) {
            where.OR = [
                { roomNo: { contains: filters.search, mode: 'insensitive' } },
                { category: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        // Get rooms with assignments
        const [rooms, total] = await Promise.all([
            this.prisma.room.findMany({
                where,
                include: {
                    assignments: {
                        include: {
                            attendee: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (pageNum - 1) * pageSizeNum,
                take: pageSizeNum,
            }),
            this.prisma.room.count({ where }),
        ]);

        // Map to response format
        const mappedRooms = rooms.map(room => {
            // Create assignments array with slots
            const assignments: any[] = [];
            for (let slot = 1; slot <= room.maxGuests; slot++) {
                const assignment = room.assignments.find(a => a.slot === slot);
                assignments.push({
                    slot,
                    attendeeId: assignment?.attendeeId || null,
                    attendee: assignment?.attendee || null,
                });
            }

            // Determine status
            const assignedCount = room.assignments.length;
            let status = 'empty';
            if (assignedCount === room.maxGuests) {
                status = 'full';
            } else if (assignedCount > 0) {
                status = 'partial';
            }

            return {
                id: room.id,
                eventId: room.eventId,
                roomNo: room.roomNo,
                category: room.category,
                maxGuests: room.maxGuests,
                createdAt: room.createdAt,
                updatedAt: room.updatedAt,
                assignments,
                status,
            };
        });

        return {
            rooms: mappedRooms,
            totalCount: total,
            page: pageNum,
            pageSize: pageSizeNum,
            totalPages: Math.ceil(total / pageSizeNum),
        };
    }

    async createRoom(eventId: string, createRoomDto: CreateRoomDto) {
        // Verify event exists
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }

        // Check for duplicate room number
        const existing = await this.prisma.room.findFirst({
            where: {
                eventId,
                roomNo: createRoomDto.roomNo,
            },
        });

        if (existing) {
            throw new ConflictException(`Room ${createRoomDto.roomNo} already exists for this event`);
        }

        // Create room
        const room = await this.prisma.room.create({
            data: {
                eventId,
                roomNo: createRoomDto.roomNo,
                category: createRoomDto.category,
                maxGuests: createRoomDto.maxGuests,
            },
            include: {
                assignments: true,
            },
        });

        // Create empty assignments for all slots
        const assignments: any[] = [];
        for (let slot = 1; slot <= room.maxGuests; slot++) {
            assignments.push({
                slot,
                attendeeId: null,
                attendee: null,
            });
        }

        return {
            id: room.id,
            eventId: room.eventId,
            roomNo: room.roomNo,
            category: room.category,
            maxGuests: room.maxGuests,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
            assignments,
            status: 'empty',
        };
    }

    async updateRoom(eventId: string, roomId: string, updateRoomDto: UpdateRoomDto) {
        // Verify room exists
        const room = await this.prisma.room.findFirst({
            where: { id: roomId, eventId },
        });

        if (!room) {
            throw new NotFoundException(`Room with ID ${roomId} not found`);
        }

        // Check for duplicate room number if updating
        if (updateRoomDto.roomNo && updateRoomDto.roomNo !== room.roomNo) {
            const existing = await this.prisma.room.findUnique({
                where: {
                    eventId_roomNo: {
                        eventId,
                        roomNo: updateRoomDto.roomNo,
                    },
                },
            });

            if (existing) {
                throw new ConflictException(`Room ${updateRoomDto.roomNo} already exists for this event`);
            }
        }

        // Update room
        const updated = await this.prisma.room.update({
            where: { id: roomId },
            data: updateRoomDto,
            include: {
                assignments: {
                    include: {
                        attendee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        // Create assignments array
        const assignments: any[] = [];
        for (let slot = 1; slot <= updated.maxGuests; slot++) {
            const assignment = updated.assignments.find(a => a.slot === slot);
            assignments.push({
                slot,
                attendeeId: assignment?.attendeeId || null,
                attendee: assignment?.attendee || null,
            });
        }

        const assignedCount = updated.assignments.length;
        let status = 'empty';
        if (assignedCount === updated.maxGuests) {
            status = 'full';
        } else if (assignedCount > 0) {
            status = 'partial';
        }

        return {
            id: updated.id,
            eventId: updated.eventId,
            roomNo: updated.roomNo,
            category: updated.category,
            maxGuests: updated.maxGuests,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
            assignments,
            status,
        };
    }

    async deleteRoom(eventId: string, roomId: string) {
        // Verify room exists
        const room = await this.prisma.room.findFirst({
            where: { id: roomId, eventId },
        });

        if (!room) {
            throw new NotFoundException(`Room with ID ${roomId} not found`);
        }

        // Delete room (assignments will be cascade deleted)
        await this.prisma.room.delete({
            where: { id: roomId },
        });

        return { success: true };
    }

    async assignRoom(eventId: string, assignRoomDto: AssignRoomDto) {
        const { roomId, slot, attendeeId } = assignRoomDto;

        // Verify room exists
        const room = await this.prisma.room.findFirst({
            where: { id: roomId, eventId },
        });

        if (!room) {
            throw new NotFoundException(`Room with ID ${roomId} not found`);
        }

        // If unassigning (attendeeId is null)
        if (!attendeeId) {
            const assignment = await this.prisma.roomAssignment.findFirst({
                where: { roomId, slot },
            });

            if (assignment) {
                await this.prisma.roomAssignment.delete({
                    where: { id: assignment.id },
                });
            }

            return { success: true, message: 'Assignment removed' };
        }

        // Verify attendee exists
        const attendee = await this.prisma.attendee.findFirst({
            where: { id: attendeeId, eventId },
        });

        if (!attendee) {
            throw new NotFoundException(`Attendee with ID ${attendeeId} not found`);
        }

        // Check if attendee is already assigned
        const existingAssignment = await this.prisma.roomAssignment.findFirst({
            where: { eventId, attendeeId },
            include: { room: true },
        });

        // Check if this slot is already assigned
        const slotAssignment = await this.prisma.roomAssignment.findFirst({
            where: { roomId, slot },
        });

        // If same assignment already exists, return success
        if (slotAssignment && slotAssignment.attendeeId === attendeeId) {
            return { success: true, message: 'Already assigned' };
        }

        // Remove existing assignment for this attendee (if different slot/room)
        if (existingAssignment) {
            await this.prisma.roomAssignment.delete({
                where: { id: existingAssignment.id },
            });
        }

        // Remove assignment from this slot if it exists (different attendee)
        if (slotAssignment && slotAssignment.attendeeId !== attendeeId) {
            await this.prisma.roomAssignment.delete({
                where: { id: slotAssignment.id },
            });
        }

        // Create new assignment
        await this.prisma.roomAssignment.create({
            data: {
                eventId,
                roomId,
                attendeeId,
                slot,
            },
        });

        return { success: true, message: 'Assignment created' };
    }

    async unassignRoom(eventId: string, roomId: string, slot: number) {
        // Verify room exists
        const room = await this.prisma.room.findFirst({
            where: { id: roomId, eventId },
        });

        if (!room) {
            throw new NotFoundException(`Room with ID ${roomId} not found`);
        }

        // Find and delete assignment
        const assignment = await this.prisma.roomAssignment.findFirst({
            where: { roomId, slot },
        });

        if (assignment) {
            await this.prisma.roomAssignment.delete({
                where: { id: assignment.id },
            });
        }

        return { success: true };
    }
}

