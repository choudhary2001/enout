import { z } from 'zod';

// Enums
export const EventStatus = z.enum(['pending', 'in_progress', 'complete']);
export const AttendeeStatus = z.enum(['invited', 'accepted', 'registered']);
export const MessageStatus = z.enum(['draft', 'sent', 'scheduled']);
export const UserRole = z.enum(['admin', 'hr']);

// Base types
export const AdminEvent = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  timezone: z.string(),
  status: EventStatus,
  location: z.string().nullable(),
  _count: z.object({
    attendees: z.number(),
    invites: z.number(),
    itineraryItems: z.number(),
  }),
});

export const AdminItineraryItem = z.object({
  id: z.string(),
  eventId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  location: z.string().nullable(),
  type: z.string(),
  order: z.number(),
});

export const AdminAttendee = z.object({
  id: z.string(),
  eventId: z.string(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  countryCode: z.string().nullable(),
  status: AttendeeStatus,
  roomId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AdminMessage = z.object({
  id: z.string(),
  eventId: z.string(),
  title: z.string(),
  body: z.string(),
  status: MessageStatus,
  scheduledFor: z.string().datetime().nullable(),
  sentAt: z.string().datetime().nullable(),
  audience: z.string(),
  attachments: z.array(z.object({
    id: z.string(),
    name: z.string(),
    size: z.number(),
    type: z.string(),
    url: z.string().optional(),
  })).default([]),
  createdAt: z.string().datetime(),
});

export const AdminRoom = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  hotel: z.string(),
  capacity: z.number(),
  type: z.string(),
  amenities: z.array(z.string()),
});

export const AdminUser = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: UserRole,
  avatar: z.string().nullable(),
});

// Type exports
export type EventType = z.infer<typeof AdminEvent>;
export type ItineraryItemType = z.infer<typeof AdminItineraryItem>;
export type AttendeeType = z.infer<typeof AdminAttendee>;
export type MessageType = z.infer<typeof AdminMessage>;
export type RoomType = z.infer<typeof AdminRoom>;
export type UserType = z.infer<typeof AdminUser>;
export type EventStatusType = z.infer<typeof EventStatus>;
export type AttendeeStatusType = z.infer<typeof AttendeeStatus>;
export type MessageStatusType = z.infer<typeof MessageStatus>;
export type UserRoleType = z.infer<typeof UserRole>;
