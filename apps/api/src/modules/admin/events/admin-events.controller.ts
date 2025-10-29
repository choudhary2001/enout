import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminEventsService } from './admin-events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventFiltersDto } from './dto/event-filters.dto';
import { AdminJwtAuthGuard } from '../auth/guards/admin.guard';
import { fileStorageConfig } from '../../../config/file-storage.config';

@Controller('api/admin/events')
@UseGuards(AdminJwtAuthGuard)
export class AdminEventsController {
  constructor(private readonly eventsService: AdminEventsService) { }

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

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image', fileStorageConfig))
  async uploadEventImage(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    return this.eventsService.uploadEventImage(id, file);
  }
}
