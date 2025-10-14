import { z } from 'zod';

// Event summary schema for the events list
export const eventSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  timezone: z.string(),
  status: z.string(),
  location: z.string().nullable(),
  _count: z.object({
    attendees: z.number(),
    invites: z.number(),
    itineraryItems: z.number(),
  }),
});

export type EventSummary = z.infer<typeof eventSummarySchema>;

// Guest schema for the guests list
export const guestSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  countryCode: z.string().nullable(),
  derivedStatus: z.string(),
  createdAt: z.string().datetime(),
  lastSentAt: z.string().datetime().nullable().optional(),
  acceptedAt: z.string().datetime().nullable().optional(),
});

export type Guest = z.infer<typeof guestSchema>;

// Paginated guests response schema
export const paginatedGuestsSchema = z.object({
  data: z.array(guestSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type PaginatedGuests = z.infer<typeof paginatedGuestsSchema>;

// API error response schema
export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
  fields: z.record(z.string()).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
