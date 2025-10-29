import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AssignRoomDto } from './dto/assign-room.dto';

@ApiTags('rooms')
@Controller('api/events/:eventId/rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all rooms for an event' })
    @ApiParam({ name: 'eventId', description: 'Event ID' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @ApiQuery({ name: 'category', required: false, type: String })
    @ApiQuery({ name: 'q', required: false, type: String, description: 'Search query' })
    @ApiResponse({ status: 200, description: 'List of rooms' })
    async getRooms(
        @Param('eventId') eventId: string,
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize: number = 100,
        @Query('category') category?: string,
        @Query('q') search?: string,
    ) {
        return this.roomsService.getRooms(eventId, { page, pageSize, category, search });
    }

    @Post()
    @ApiOperation({ summary: 'Create a new room' })
    @ApiParam({ name: 'eventId', description: 'Event ID' })
    @ApiResponse({ status: 201, description: 'Room created successfully' })
    async createRoom(
        @Param('eventId') eventId: string,
        @Body() createRoomDto: CreateRoomDto,
    ) {
        return this.roomsService.createRoom(eventId, createRoomDto);
    }

    // IMPORTANT: This must come before @Patch(':roomId') and @Delete(':roomId')
    @Post('assign')
    @ApiOperation({ summary: 'Assign an attendee to a room slot' })
    @ApiParam({ name: 'eventId', description: 'Event ID' })
    @ApiResponse({ status: 200, description: 'Assignment created or updated' })
    async assignRoom(
        @Param('eventId') eventId: string,
        @Body() assignRoomDto: AssignRoomDto,
    ) {
        return this.roomsService.assignRoom(eventId, assignRoomDto);
    }

    @Patch(':roomId')
    @ApiOperation({ summary: 'Update a room' })
    @ApiParam({ name: 'eventId', description: 'Event ID' })
    @ApiParam({ name: 'roomId', description: 'Room ID' })
    @ApiResponse({ status: 200, description: 'Room updated successfully' })
    async updateRoom(
        @Param('eventId') eventId: string,
        @Param('roomId') roomId: string,
        @Body() updateRoomDto: UpdateRoomDto,
    ) {
        return this.roomsService.updateRoom(eventId, roomId, updateRoomDto);
    }

    @Delete(':roomId')
    @ApiOperation({ summary: 'Delete a room' })
    @ApiParam({ name: 'eventId', description: 'Event ID' })
    @ApiParam({ name: 'roomId', description: 'Room ID' })
    @ApiResponse({ status: 200, description: 'Room deleted successfully' })
    async deleteRoom(
        @Param('eventId') eventId: string,
        @Param('roomId') roomId: string,
    ) {
        return this.roomsService.deleteRoom(eventId, roomId);
    }

    @Delete(':roomId/unassign')
    @ApiOperation({ summary: 'Unassign a slot from a room' })
    @ApiParam({ name: 'eventId', description: 'Event ID' })
    @ApiParam({ name: 'roomId', description: 'Room ID' })
    @ApiResponse({ status: 200, description: 'Assignment removed' })
    async unassignRoom(
        @Param('eventId') eventId: string,
        @Param('roomId') roomId: string,
        @Body() body: { slot: number },
    ) {
        return this.roomsService.unassignRoom(eventId, roomId, body.slot);
    }
}

