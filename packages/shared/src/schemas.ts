import { z } from 'zod';

// Event schema
export const eventSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export type Event = z.infer<typeof eventSchema>;

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['ADMIN', 'HR']),
});

export type User = z.infer<typeof userSchema>;

// Message schema
export const messageSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  userId: z.string(),
  content: z.string(),
  createdAt: z.string().datetime(),
});

export type Message = z.infer<typeof messageSchema>;

// Auth schemas
export const authRequestEmailOtpSchema = z.object({
  email: z.string().email().transform(email => email.toLowerCase()),
  eventId: z.string(),
});

export type AuthRequestEmailOtp = z.infer<typeof authRequestEmailOtpSchema>;

export const authVerifyEmailSchema = z.object({
  email: z.string().email().transform(email => email.toLowerCase()),
  code: z.string().length(5),
  eventId: z.string(),
});

export type AuthVerifyEmail = z.infer<typeof authVerifyEmailSchema>;

// Invite schemas
export const inviteRowSchema = z.object({
  email: z.string().email().transform(email => email.toLowerCase()),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z.string().optional(),
});

export type InviteRow = z.infer<typeof inviteRowSchema>;

export const inviteImportSchema = z.object({
  rows: z.array(inviteRowSchema),
});

export type InviteImport = z.infer<typeof inviteImportSchema>;

// Derived status enum
export const derivedStatusEnum = z.enum([
  'not_invited',
  'invited',
  'email_verified',
  'accepted',
  'registered',
]);

export type DerivedStatus = z.infer<typeof derivedStatusEnum>;

// Query params
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof paginationSchema>;

export const guestsQuerySchema = paginationSchema.extend({
  query: z.string().optional(),
  status: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'name', 'status']).default('newest'),
});

export type GuestsQuery = z.infer<typeof guestsQuerySchema>;
