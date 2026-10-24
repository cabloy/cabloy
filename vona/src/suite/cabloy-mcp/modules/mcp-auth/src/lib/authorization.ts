import type { VonaApplication } from 'vona';

import { createHash, timingSafeEqual } from 'node:crypto';

import type {
  IMcpAuthConfig,
  IMcpAuthResource,
  IMcpAuthRegistrationConfig,
} from '../types/index.ts';

export class OAuthError extends Error {
  constructor(
    public readonly oauthError: string,
    public readonly status: number = 400,
  ) {
    super(oauthError);
    this.name = 'OAuthError';
  }
}

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function equalDigest(left: string, right: string): boolean {
  return (
    /^[a-f0-9]{64}$/.test(left) &&
    /^[a-f0-9]{64}$/.test(right) &&
    timingSafeEqual(Buffer.from(left, 'hex'), Buffer.from(right, 'hex'))
  );
}

export function validateConfiguredRedirectUri(value: string, allowLoopbackHttp: boolean): URL {
  const url = configuredUrl(value, allowLoopbackHttp);
  if (url.href !== value) throw new OAuthError('invalid_redirect_uri');
  return url;
}

function configuredUrl(value: string, allowLoopbackHttp: boolean): URL {
  if (typeof value !== 'string' || value.length > 2048) throw new OAuthError('server_error', 503);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new OAuthError('server_error', 503);
  }
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (
    url.username ||
    url.password ||
    url.hash ||
    value.includes('#') ||
    (url.protocol !== 'https:' && !(allowLoopbackHttp && loopback && url.protocol === 'http:'))
  ) {
    throw new OAuthError('server_error', 503);
  }
  return url;
}

/** Validate operational policy independently of runtime authority. */
export function validateMcpAuthConfig(config: IMcpAuthConfig): IMcpAuthConfig {
  const invalid = () => {
    throw new OAuthError('server_error', 503);
  };
  if (!config || typeof config.allowLoopbackHttp !== 'boolean') {
    invalid();
  }
  const registration: IMcpAuthRegistrationConfig = {
    maxBodyBytes: config.registration?.maxBodyBytes ?? 16384,
    maxRedirectUris: config.registration?.maxRedirectUris ?? 16,
    rateLimit: config.registration?.rateLimit ?? 10,
    rateLimitWindow: config.registration?.rateLimitWindow ?? 600,
  };
  config.registration = registration;
  for (const ttl of [config.pendingTtl, config.codeTtl, config.tokenTtl]) {
    if (!Number.isSafeInteger(ttl) || ttl <= 0 || ttl > 86400) invalid();
  }
  if (
    registration.maxBodyBytes < 1024 ||
    registration.maxBodyBytes > 1024 * 1024 ||
    registration.maxRedirectUris < 1 ||
    registration.maxRedirectUris > 64 ||
    registration.rateLimit < 1 ||
    registration.rateLimit > 10000 ||
    registration.rateLimitWindow < 1 ||
    registration.rateLimitWindow > 86400
  ) {
    invalid();
  }
  return config;
}

export function getMcpAuthConfig(app: VonaApplication): IMcpAuthConfig {
  return validateMcpAuthConfig(app.config.modules['mcp-auth']);
}

/** Use the backend public origin, never request or proxy headers, as authority. */
export function getMcpIssuer(app: VonaApplication): string {
  const config = getMcpAuthConfig(app);
  const { protocol, host } = app.config.server.serve;
  if (app.meta.isProd && (!protocol || !host)) {
    throw new OAuthError('temporarily_unavailable', 503);
  }
  const port = app.meta.env.SERVER_LISTEN_PORT;
  const origin = `${protocol || 'http'}://${host || (port ? `localhost:${port}` : 'localhost')}`;
  const url = configuredUrl(origin, config.allowLoopbackHttp);
  if (url.origin !== origin) throw new OAuthError('server_error', 503);
  return `${origin}/mcp`;
}

/** Resolve normal server routing without caller selectors or ambient tenant state. */
export function resolveMcpResource(app: VonaApplication, host: string): IMcpAuthResource {
  const resource = getMcpIssuer(app);
  const url = new URL(resource);
  if (url.host !== host) throw new OAuthError('invalid_target');
  const ctx = app.createAnonymousContext({
    headers: { host },
    method: 'POST',
    url: '/mcp',
    socket: { encrypted: url.protocol === 'https:' },
  });
  const instanceName = ctx.instanceName;
  if (typeof instanceName !== 'string') throw new OAuthError('invalid_target');
  return { resource, instanceName };
}

export function validateOAuthParameters(params: URLSearchParams, allowed: string[]): void {
  let size = 0;
  for (const [name, value] of params) {
    size += name.length + value.length;
    if (!allowed.includes(name) || params.getAll(name).length !== 1 || value.length > 2048) {
      throw new OAuthError('invalid_request');
    }
  }
  if (size > 8192) throw new OAuthError('invalid_request');
}

export function requiredOAuthParameter(params: URLSearchParams, name: string): string {
  const value = params.get(name);
  if (!value) throw new OAuthError('invalid_request');
  return value;
}
