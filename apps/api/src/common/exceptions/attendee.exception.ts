import { NotFoundException } from '@nestjs/common';

export class AttendeeNotFoundException extends NotFoundException {
  constructor(attendeeId?: string) {
    super(
      `Attendee ${attendeeId ? `with ID ${attendeeId}` : ''} not found`,
      'ATTENDEE_NOT_FOUND',
    );
  }
}
