import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { CreateScheduleItemDto } from './dto/create-schedule-item.dto';
import { UpdateScheduleItemDto } from './dto/update-schedule-item.dto';
import { ListScheduleDto } from './dto/list-schedule.dto';
import { ScheduleItemDto, ScheduleResponseDto } from './dto/schedule-item.dto';
import { ApiErrorResponse } from '../common/dto/api-response.dto';

@ApiTags('schedule')
@Controller('api/events/:eventId/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @ApiOperation({ summary: 'Get schedule items for an event' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'List of schedule items',
    type: ScheduleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ApiErrorResponse,
  })
  async getScheduleItems(
    @Param('eventId') eventId: string,
    @Query() query: ListScheduleDto,
  ) {
    return this.scheduleService.getScheduleItems(eventId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new schedule item' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({
    status: 201,
    description: 'Schedule item created successfully',
    type: ScheduleItemDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or date range',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ApiErrorResponse,
  })
  async createScheduleItem(
    @Param('eventId') eventId: string,
    @Body() dto: CreateScheduleItemDto,
  ) {
    return this.scheduleService.createScheduleItem(eventId, dto);
  }

  @Patch(':itemId')
  @ApiOperation({ summary: 'Update a schedule item' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'itemId', description: 'Schedule item ID' })
  @ApiResponse({
    status: 200,
    description: 'Schedule item updated successfully',
    type: ScheduleItemDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or date range',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Event or schedule item not found',
    type: ApiErrorResponse,
  })
  async updateScheduleItem(
    @Param('eventId') eventId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateScheduleItemDto,
  ) {
    return this.scheduleService.updateScheduleItem(eventId, itemId, dto);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Delete a schedule item' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'itemId', description: 'Schedule item ID' })
  @ApiResponse({
    status: 204,
    description: 'Schedule item deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Event or schedule item not found',
    type: ApiErrorResponse,
  })
  async deleteScheduleItem(
    @Param('eventId') eventId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.scheduleService.deleteScheduleItem(eventId, itemId);
  }
}

