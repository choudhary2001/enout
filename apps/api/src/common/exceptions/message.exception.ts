import { NotFoundException } from '@nestjs/common';

export class MessageNotFoundException extends NotFoundException {
  constructor(messageId?: string) {
    super(
      `Message ${messageId ? `with ID ${messageId}` : ''} not found`,
      'MESSAGE_NOT_FOUND',
    );
  }
}
