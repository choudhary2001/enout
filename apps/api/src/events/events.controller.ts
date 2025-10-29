import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of events',
  })
  async findAll() {
    return await this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Event details',
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Event not found',
  })
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }
}
