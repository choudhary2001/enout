import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { api } from '../api';
import { eventSummaryArraySchema } from '@enout/shared';

// Mock API server
const server = setupServer(
  http.get('http://localhost:3003/events', () => {
    return HttpResponse.json([
      {
        id: 'event-1',
        name: 'Test Event',
        startDate: '2025-07-15T03:30:00.000Z',
        endDate: '2025-07-18T11:30:00.000Z',
        timezone: 'Asia/Kolkata',
        status: 'upcoming',
        location: 'Test Location',
        createdAt: '2025-09-22T05:42:19.792Z',
        updatedAt: '2025-09-22T05:43:58.103Z',
        _count: {
          attendees: 4,
          invites: 6,
          itineraryItems: 8,
        },
      },
    ]);
  }),
  
  http.get('http://localhost:3003/error', () => {
    return new HttpResponse(null, { status: 500 });
  }),
  
  http.get('http://localhost:3003/timeout', () => {
    return new Promise(() => {
      // This request will never resolve, simulating a timeout
    });
  })
);

// Start mock server before tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());

describe('API Client', () => {
  it('should fetch and parse events correctly', async () => {
    const events = await api.get('/events', eventSummaryArraySchema);
    
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      id: 'event-1',
      name: 'Test Event',
      timezone: 'Asia/Kolkata',
      status: 'upcoming',
      _count: {
        attendees: 4,
        invites: 6,
        itineraryItems: 8,
      },
    });
  });
  
  it('should throw ApiError on server error', async () => {
    await expect(api.get('/error', eventSummaryArraySchema)).rejects.toThrow(/API request failed/);
  });
  
  it('should throw ApiError on timeout', async () => {
    // Mock setTimeout and clearTimeout
    const originalSetTimeout = global.setTimeout;
    const originalClearTimeout = global.clearTimeout;
    
    global.setTimeout = vi.fn().mockImplementation((cb) => {
      cb();
      return 1;
    });
    global.clearTimeout = vi.fn();
    
    try {
      await expect(api.get('/timeout', eventSummaryArraySchema, { timeout: 1 })).rejects.toThrow(/Request timed out/);
    } finally {
      // Restore original functions
      global.setTimeout = originalSetTimeout;
      global.clearTimeout = originalClearTimeout;
    }
  });
});
