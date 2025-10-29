import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class RateLimiterService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Check if an action is rate limited
   * @param key The unique identifier for the rate limited action
   * @param ttl The time-to-live in seconds for the rate limit
   * @returns true if the action is allowed, false if it's rate limited
   */
  async isRateLimited(key: string, ttl: number): Promise<boolean> {
    const exists = await this.redisService.exists(key);
    if (exists) {
      return true; // Rate limited
    }
    
    await this.redisService.set(key, '1', ttl);
    return false; // Not rate limited
  }

  /**
   * Get the remaining time in seconds for a rate limit
   * @param key The unique identifier for the rate limited action
   * @returns The remaining time in seconds, or -1 if not rate limited
   */
  async getRemainingTime(key: string): Promise<number> {
    return this.redisService.ttl(key);
  }
}
