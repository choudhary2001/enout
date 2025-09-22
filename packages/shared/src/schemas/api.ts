import { z } from 'zod';
import { derivedStatusEnum } from '../schemas';

/**
 * Event summary schema for the events list
 */
export const eventSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  timezone: z.string(),
  status: z.string(),
  location: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _count: z.object({
    attendees: z.number(),
    invites: z.number(),
    itineraryItems: z.number(),
  }),
});

export type EventSummary = z.infer<typeof eventSummarySchema>;
export const eventSummaryArraySchema = z.array(eventSummarySchema);

/**
 * Guest schema for the guests list
 */
export const guestSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  countryCode: z.string().nullable().optional(),
  derivedStatus: derivedStatusEnum,
  createdAt: z.string().datetime(),
  lastSentAt: z.string().datetime().nullable().optional(),
  acceptedAt: z.string().datetime().nullable().optional(),
});

export type Guest = z.infer<typeof guestSchema>;

/**
 * Paginated response schema for guests list
 */
export const paginatedGuestsSchema = z.object({
  data: z.array(guestSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type PaginatedGuests = z.infer<typeof paginatedGuestsSchema>;

/**
 * Guests query parameters schema
 */
export const guestsQueryParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.string().optional(),
  search: z.string().optional(),
});

export type GuestsQueryParams = z.infer<typeof guestsQueryParamsSchema>;
