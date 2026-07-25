import type { IRedisClientRecord } from 'vona-module-a-redis';

export type RateLimitRedisClient = keyof IRedisClientRecord | 'limiter';
export type RateLimitMode = 'observe' | 'enforce';
export type RateLimitKey = 'identity' | 'ip' | 'subject';
export type RateLimitFailureMode = 'closed';

export interface IRateLimitPolicy {
  mode: RateLimitMode;
  client: RateLimitRedisClient;
  limit: number;
  windowMs: number;
  key: RateLimitKey;
  name?: string;
  headers: boolean;
  failureMode: RateLimitFailureMode;
}

export interface IRateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAfterMs: number;
  retryAfterSeconds: number;
}
