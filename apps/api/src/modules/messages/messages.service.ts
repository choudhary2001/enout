import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessages(eventId: string) {
    return this.prisma.mobileMessage.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMessage(eventId: string, id: string) {
    const message = await this.prisma.mobileMessage.findFirst({
      where: { id, eventId },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }

    return message;
  }

  async createMessage(eventId: string, data: any) {
    return this.prisma.mobileMessage.create({
      data: {
        eventId,
        title: data.title,
        body: data.body,
        attachments: data.attachments,
        attendeeId: data.attendeeId,
        status: data.status || 'sent',
      },
    });
  }

  async updateMessage(eventId: string, id: string, data: any) {
    try {
      return await this.prisma.mobileMessage.update({
        where: { id },
        data: {
          ...data,
          eventId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Message with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async deleteMessage(eventId: string, id: string) {
    try {
      await this.prisma.mobileMessage.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Message with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async createBroadcast(eventId: string, data: any) {
    return this.prisma.broadcast.create({
      data: {
        eventId,
        title: data.subject,
        subject: data.subject,
        bodyHtml: data.bodyHtml,
        status: data.status,
        scheduledAt: data.scheduledAt,
        createdBy: data.createdBy,
      },
    });
  }
}
