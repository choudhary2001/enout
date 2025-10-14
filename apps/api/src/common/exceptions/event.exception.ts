import { NotFoundException, BadRequestException } from '@nestjs/common';

export class EventNotFoundException extends NotFoundException {
  constructor(eventId?: string) {
    super(
      `Event ${eventId ? `with ID ${eventId}` : ''} not found`,
      'EVENT_NOT_FOUND',
    );
  }
}

export class EventAccessDeniedException extends BadRequestException {
  constructor(eventId: string) {
    super(
      `Access denied to event ${eventId}`,
      'EVENT_ACCESS_DENIED',
    );
  }
}
