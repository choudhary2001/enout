import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) { }

  async getMessages(eventId: string) {
    // Get broadcasts (sent messages) and format them as messages
    const broadcasts = await this.prisma.broadcast.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
      include: {
        attachments: true,
      },
    });

    console.log('Found broadcasts:', broadcasts.length);

    // Format broadcasts to match the message structure expected by the frontend
    return broadcasts.map(broadcast => ({
      id: broadcast.id,
      eventId: broadcast.eventId,
      title: broadcast.title,
      body: broadcast.bodyHtml,
      status: broadcast.status,
      audience: broadcast.audience || 'all',
      scheduledAt: broadcast.scheduledAt,
      sentAt: broadcast.sentAt,
      createdAt: broadcast.createdAt,
      attachments: broadcast.attachments.map(att => ({
        id: att.id,
        name: att.name,
        url: att.url,
        size: att.size,
        type: att.mime,
      })),
    }));
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
    console.log('=== createMessage DEBUG ===');
    console.log('EventId:', eventId);
    console.log('Data:', JSON.stringify(data, null, 2));

    // If attendeeId is provided (direct message to accepted guest)
    if (data.attendeeId) {
      return this.createDirectMessage(eventId, data);
    }

    // If inviteId is provided (message to invited guest - queue it)
    if (data.inviteId) {
      return this.createQueuedMessage(eventId, data);
    }

    // For broadcast messages, create a single Broadcast record
    if (!data.attendeeId && !data.inviteId && (data.status === 'sent' || data.status === 'draft' || data.status === undefined)) {
      console.log('Creating broadcast message');

      // Get a user ID or use a placeholder
      let createdBy = data.createdBy || 'system';

      // Try to get an admin user if createdBy is 'system'
      if (createdBy === 'system') {
        try {
          const adminUser = await this.prisma.user.findFirst({
            where: { role: 'ADMIN' },
            select: { id: true }
          });
          if (adminUser) {
            createdBy = adminUser.id;
          } else {
            console.log('No admin user found, creating one...');
            // Create a system admin user if none exists
            const systemUser = await this.prisma.user.upsert({
              where: { email: 'system@enout.app' },
              update: {},
              create: {
                email: 'system@enout.app',
                name: 'System',
                role: 'ADMIN',
              }
            });
            createdBy = systemUser.id;
          }
        } catch (error) {
          console.log('Error finding/creating user:', error);
          // Create a system admin user as fallback
          try {
            const systemUser = await this.prisma.user.upsert({
              where: { email: 'system@enout.app' },
              update: {},
              create: {
                email: 'system@enout.app',
                name: 'System',
                role: 'ADMIN',
              }
            });
            createdBy = systemUser.id;
          } catch (e) {
            console.error('Failed to create system user:', e);
          }
        }
      }

      // Create a single broadcast record instead of individual messages per user
      const broadcast = await this.prisma.broadcast.create({
        data: {
          eventId,
          title: data.title || data.subject || 'Untitled Broadcast',
          subject: data.subject || data.title || 'Untitled Broadcast',
          bodyHtml: data.body || '',
          status: data.status || 'draft',
          audience: data.audience || 'all',
          scheduledAt: data.scheduledFor ? new Date(data.scheduledFor) : null,
          sentAt: data.status === 'sent' ? new Date() : null,
          createdBy: createdBy,
        },
      });

      console.log('Created broadcast:', broadcast.id);

      // Handle attachments if any were provided
      if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
        console.log('Processing attachments for broadcast:', data.attachments.length);
        for (const att of data.attachments) {
          try {
            const attachment = await this.prisma.attachment.create({
              data: {
                broadcastId: broadcast.id,
                name: att.name || 'attachment',
                url: att.url || '',
                mime: att.type || att.mime || 'application/octet-stream',
                size: att.size || 0,
              }
            });
            console.log('Created attachment:', attachment.id);
          } catch (error) {
            console.error('Failed to create attachment:', error);
          }
        }
      }

      // Return the broadcast formatted as a message-like object for the API
      return {
        id: broadcast.id,
        eventId: broadcast.eventId,
        title: broadcast.title,
        body: broadcast.bodyHtml,
        status: broadcast.status,
        audience: broadcast.audience,
        scheduledAt: broadcast.scheduledAt,
        sentAt: broadcast.sentAt,
        createdAt: broadcast.createdAt,
        attachments: [], // Will be handled separately
      };
    } else {
      // Create individual message (fallback for other cases)
      return this.prisma.mobileMessage.create({
        data: {
          eventId,
          title: data.title,
          body: data.body,
          attachments: data.attachments || {},
          attendeeId: data.attendeeId,
          status: data.status || 'sent',
          deliveryStatus: 'delivered', // Default to delivered for individual messages
          unread: data.attendeeId ? true : false,
          deliveredAt: new Date(),
        },
      });
    }
  }

  /**
   * Create a direct message for an accepted guest (existing functionality)
   */
  private async createDirectMessage(eventId: string, data: any) {
    return this.prisma.mobileMessage.create({
      data: {
        eventId,
        attendeeId: data.attendeeId,
        title: data.title,
        body: data.body,
        attachments: data.attachments || {},
        status: data.status || 'sent',
        deliveryStatus: 'delivered', // Direct delivery for accepted guests
        unread: true,
        deliveredAt: new Date(),
      },
    });
  }

  /**
   * Create a queued message for an invited guest
   */
  private async createQueuedMessage(eventId: string, data: any) {
    return this.prisma.mobileMessage.create({
      data: {
        eventId,
        inviteId: data.inviteId,
        title: data.title,
        body: data.body,
        attachments: data.attachments || {},
        status: data.status || 'sent',
        deliveryStatus: 'queued', // Will be delivered when guest accepts
        unread: true,
      },
    });
  }

  /**
   * Deliver all queued messages for a specific invite when guest accepts
   */
  async deliverQueuedMessages(inviteId: string, attendeeId: string) {
    console.log('=== deliverQueuedMessages DEBUG ===');
    console.log('InviteId:', inviteId);
    console.log('AttendeeId:', attendeeId);

    const queuedMessages = await this.prisma.mobileMessage.findMany({
      where: {
        inviteId,
        deliveryStatus: 'queued',
      },
    });

    console.log('Found queued messages:', queuedMessages.length);

    if (queuedMessages.length === 0) {
      return 0;
    }

    // Update all queued messages to be delivered
    const updateResult = await this.prisma.mobileMessage.updateMany({
      where: {
        inviteId,
        deliveryStatus: 'queued',
      },
      data: {
        attendeeId,
        deliveryStatus: 'delivered',
        deliveredAt: new Date(),
      },
    });

    console.log('Updated messages:', updateResult.count);
    return updateResult.count;
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

  async sendMessage(eventId: string, messageId: string) {
    // First, try to find the message as a MobileMessage (individual message)
    let message = await this.prisma.mobileMessage.findFirst({
      where: { id: messageId, eventId },
    });

    let messageData: any = null;

    if (message) {
      // It's an individual message
      messageData = {
        title: message.title,
        body: message.body,
        attachments: message.attachments || {},
      };
    } else {
      // Try to find it as a Broadcast message
      const broadcast = await this.prisma.broadcast.findFirst({
        where: { id: messageId, eventId },
      });

      if (!broadcast) {
        throw new NotFoundException(`Message with ID "${messageId}" not found`);
      }

      messageData = {
        title: broadcast.title,
        body: broadcast.bodyHtml,
        attachments: {},
      };

      // Update broadcast status to sent
      await this.prisma.broadcast.update({
        where: { id: messageId },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      });
    }

    // Get all attendees for this event
    const attendees = await this.prisma.attendee.findMany({
      where: { eventId },
      select: { id: true },
    });

    // Create individual MobileMessage records for each attendee
    const mobileMessages = await Promise.all(
      attendees.map(attendee =>
        this.prisma.mobileMessage.create({
          data: {
            eventId,
            attendeeId: attendee.id,
            title: messageData.title,
            body: messageData.body,
            attachments: messageData.attachments,
            status: 'sent',
            unread: true,
          },
        })
      )
    );

    // Return the first message or create a summary message
    return mobileMessages[0] || message;
  }

  async uploadAttachment(eventId: string, messageId: string, file: any) {
    console.log('Uploading attachment for message:', messageId);

    // Check if it's a broadcast message
    const broadcast = await this.prisma.broadcast.findFirst({
      where: { id: messageId, eventId }
    });

    if (broadcast) {
      // Handle broadcast attachment
      console.log('Found broadcast, creating attachment record');
      const fs = require('fs').promises;

      // Generate safe filename
      const originalName = file.originalname || 'file';
      const safeFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const timestamp = Date.now();
      const finalFileName = `${messageId}_${timestamp}_${safeFileName}`;
      const filePath = `./uploads/messages/${finalFileName}`;

      // Write file to disk
      await fs.mkdir('./uploads/messages', { recursive: true });
      await fs.writeFile(filePath, file.buffer);

      const fileUrl = `${process.env.API_URL || 'http://localhost:3001'}/uploads/messages/${finalFileName}`;

      // Create attachment record in database
      const attachment = await this.prisma.attachment.create({
        data: {
          broadcastId: broadcast.id,
          name: originalName,
          url: fileUrl,
          mime: file.mimetype,
          size: file.size,
        }
      });

      console.log('Created attachment:', attachment.id);
      return { success: true, fileUrl };
    }

    // Handle regular message attachment (legacy support)
    const message = await this.prisma.mobileMessage.findFirst({
      where: { id: messageId, eventId }
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Generate safe filename
    const originalName = file.originalname || 'file';
    const safeFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const finalFileName = `${messageId}_${timestamp}_${safeFileName}`;
    const filePath = `./uploads/messages/${finalFileName}`;

    // Write file to disk
    const fs = require('fs').promises;
    await fs.mkdir('./uploads/messages', { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    // Build attachment object
    const attachment = {
      name: originalName,
      size: file.size,
      type: file.mimetype,
      url: `${process.env.API_URL || 'http://localhost:3001'}/uploads/messages/${finalFileName}`
    };

    // Update message attachments array
    const currentAttachments = (message.attachments as any) || [];
    const updatedAttachments = Array.isArray(currentAttachments) ?
      [...currentAttachments, attachment] : [attachment];

    await this.prisma.mobileMessage.update({
      where: { id: messageId },
      data: { attachments: updatedAttachments }
    });

    return { success: true, fileUrl: attachment.url };
  }
}
