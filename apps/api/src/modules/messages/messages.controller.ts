import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { MessageDto, MessagesResponseDto } from './dto/message.dto';

@ApiTags('Messages')
@Controller('api/events/:eventId/messages')
// @UseGuards(JwtAuthGuard) // Disabled for development
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all messages for an event' })
  @ApiResponse({ status: 200, type: MessagesResponseDto })
  async getMessages(
    @Param('eventId') eventId: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 100,
  ): Promise<MessagesResponseDto> {
    const messages = await this.messagesService.getMessages(eventId);
    const total = messages.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: messages.slice(start, end).map(msg => ({
        id: msg.id,
        eventId: msg.eventId,
        title: msg.title,
        body: msg.body,
        attachments: msg.attachments || [],
        status: msg.status,
        deliveryStatus: 'delivered',
        unread: false,
        createdAt: msg.createdAt,
        // Broadcast-specific fields
        audience: (msg as any).audience || 'all',
        scheduledAt: (msg as any).scheduledAt || undefined,
        sentAt: (msg as any).sentAt || undefined,
      })),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, type: MessageDto })
  async createMessage(
    @Param('eventId') eventId: string,
    @Body() createMessageDto: any,
  ): Promise<MessageDto> {
    try {
      const message = await this.messagesService.createMessage(eventId, createMessageDto);
      return this.transformToDto(message);
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a message by ID' })
  @ApiResponse({ status: 200, type: MessageDto })
  async getMessage(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ): Promise<MessageDto> {
    const message = await this.messagesService.getMessage(eventId, id);
    return this.transformToDto(message);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a message' })
  @ApiResponse({ status: 200, type: MessageDto })
  async updateMessage(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() updateMessageDto: any,
  ): Promise<MessageDto> {
    const message = await this.messagesService.updateMessage(eventId, id, updateMessageDto);
    return this.transformToDto(message);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({ status: 200 })
  async deleteMessage(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.messagesService.deleteMessage(eventId, id);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send a message to all attendees' })
  @ApiResponse({ status: 200, type: MessageDto })
  async sendMessage(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ): Promise<MessageDto> {
    const message = await this.messagesService.sendMessage(eventId, id);
    return this.transformToDto(message);
  }

  @Post(':id/upload-attachments')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, callback) => {
      // Allow all common file types for broadcasting
      const allowed = [
        // Images
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico',
        // Documents
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods',
        // Archives
        'zip', 'rar', '7z', 'tar', 'gz',
        // Audio/Video
        'mp3', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg',
        // Other
        'csv', 'json', 'xml'
      ];
      const ext = file.originalname.split('.').pop()?.toLowerCase() || '';
      if (allowed.includes(ext)) {
        callback(null, true);
      } else {
        console.log('File type not allowed:', ext);
        callback(new BadRequestException(`File type .${ext} is not allowed`), false);
      }
    }
  }))
  @ApiOperation({ summary: 'Upload attachment to a message' })
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  async uploadAttachment(
    @Param('eventId') eventId: string,
    @Param('id') messageId: string,
    @UploadedFile() file: any
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.messagesService.uploadAttachment(eventId, messageId, file);
  }

  private transformToDto(message: any): MessageDto {
    return {
      id: message.id,
      eventId: message.eventId,
      title: message.title,
      body: message.body || message.bodyHtml,
      attachments: message.attachments || [],
      status: message.status,
      deliveryStatus: 'delivered',
      unread: false,
      createdAt: message.createdAt,
    };
  }
}