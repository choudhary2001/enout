import { z } from 'zod';

// Event type for admin dashboard
export const dashboardEventType = z.object({
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

export type DashboardEvent = z.infer<typeof dashboardEventType>;
