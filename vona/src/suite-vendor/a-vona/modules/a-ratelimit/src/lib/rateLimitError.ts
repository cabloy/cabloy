export class RateLimitError extends Error {
  readonly code = 429;
  readonly status = 429;
  readonly errors: {
    kind: 'rate_limit';
    status: 429;
    limit: number;
    retryAfterSeconds: number;
  };

  constructor(limit: number, retryAfterSeconds: number) {
    super('Too Many Requests');
    if (!Number.isSafeInteger(limit) || limit < 1) {
      throw new Error('rate-limit limit must be a positive safe integer');
    }
    if (!Number.isSafeInteger(retryAfterSeconds) || retryAfterSeconds < 1) {
      throw new Error('rate-limit retryAfterSeconds must be a positive safe integer');
    }
    this.name = 'RateLimitError';
    this.errors = { kind: 'rate_limit', status: 429, limit, retryAfterSeconds };
  }
}

export class RateLimitUnavailableError extends Error {
  readonly code = 503;
  readonly status = 503;
  readonly errors = { kind: 'rate_limit_unavailable', status: 503 } as const;

  constructor() {
    super('Service Unavailable');
    this.name = 'RateLimitUnavailableError';
  }
}
