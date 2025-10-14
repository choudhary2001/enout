import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api';

// Mock fetch
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse /events response correctly', async () => {
    const mockEvents = [
      {
        id: 'clq1234567890abcdefghijkl',
        name: 'Test Event',
        startDate: '2025-07-15T03:30:00.000Z',
        endDate: '2025-07-18T11:30:00.000Z',
        timezone: 'Asia/Kolkata',
        status: 'upcoming',
        location: 'Test Location',
        _count: {
          attendees: 4,
          invites: 6,
          itineraryItems: 8,
        },
      },
    ];

    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    const result = await api.getEvents();
    
    expect(result).toEqual(mockEvents);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3003/events',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('should handle API errors correctly', async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ message: 'Server error' }),
    });

    await expect(api.getEvents()).rejects.toThrow('Server error');
  });

  it('should handle network errors correctly', async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

    await expect(api.getEvents()).rejects.toThrow('Network error');
  });
});
