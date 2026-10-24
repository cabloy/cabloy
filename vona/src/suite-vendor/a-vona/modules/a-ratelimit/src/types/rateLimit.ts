export type RateLimitMode = 'observe' | 'enforce';
export type RateLimitKey = 'identity' | 'ip' | 'subject';

export interface IRateLimitPolicy {
  mode: RateLimitMode;
  limit: number;
  windowMs: number;
  key: RateLimitKey;
  name?: string;
  route?: {
    method: string;
    path: string;
  };
  headers: boolean;
}

export interface IRateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAfterMs: number;
  retryAfterSeconds: number;
}
