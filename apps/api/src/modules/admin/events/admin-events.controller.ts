import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  // UseGuards, // Commented out for development
} from '@nestjs/common';
import { AdminEventsService } from './admin-events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventFiltersDto } from './dto/event-filters.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Commented out for development
// import { AdminGuard } from '../../auth/guards/admin.guard'; // Commented out for development

@Controller('api/admin/events')
// TODO: Re-enable guards when JWT strategy is configured
// @UseGuards(JwtAuthGuard, AdminGuard)
export class AdminEventsController {
  constructor(private readonly eventsService: AdminEventsService) {}

  @Get()
  async findAll(@Query() filters: EventFiltersDto) {
    return this.eventsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
