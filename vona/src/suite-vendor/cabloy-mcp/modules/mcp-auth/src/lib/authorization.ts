import type { VonaApplication } from 'vona';

import { createHash, timingSafeEqual } from 'node:crypto';

import type {
  IMcpAuthConfig,
  IMcpAuthResource,
  IMcpAuthIssuer,
  IMcpAuthRegistrationConfig,
  TypeMcpGrantTypes,
  TypeMcpBuiltinScope,
  TypeMcpCustomScope,
  TypeMcpScope,
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

export const mcpSupportedScopes = ['mcp:all', 'mcp:read'] as const;
export const mcpCustomScopeNamePattern = /^[\w-]{1,100}$/;
export const mcpCustomScopePattern = /^mcp:custom:[\w-]{1,100}$/;

export function isCanonicalMcpCustomScope(value: { name: string; scope: string }): boolean {
  return (
    typeof value.name === 'string' &&
    value.name === value.name.trim() &&
    mcpCustomScopeNamePattern.test(value.name) &&
    value.scope === `mcp:custom:${value.name}`
  );
}

export function isMcpBuiltinScope(value: unknown): value is TypeMcpBuiltinScope {
  return value === 'mcp:all' || value === 'mcp:read';
}

export function isMcpCustomScope(value: unknown): value is TypeMcpCustomScope {
  return typeof value === 'string' && value === value.trim() && mcpCustomScopePattern.test(value);
}

/** Syntax only. Custom authority must also resolve a live owner-scoped definition. */
export function isMcpScope(value: unknown): value is TypeMcpScope {
  return isMcpBuiltinScope(value) || isMcpCustomScope(value);
}

/** Registration and anonymous discovery only support built-in ceilings. */
export function parseMcpScope(value: unknown): TypeMcpBuiltinScope | undefined {
  if (typeof value !== 'string') return undefined;
  const scopes = value.split(' ');
  if (
    scopes.length > 2 ||
    scopes.some(scope => !isMcpBuiltinScope(scope)) ||
    new Set(scopes).size !== scopes.length
  ) {
    return undefined;
  }
  return scopes.includes('mcp:all') ? 'mcp:all' : 'mcp:read';
}

/** Custom remembered identifiers are admitted syntactically before login, never resolved anonymously. */
export function parseMcpRequestedScope(value: unknown): TypeMcpScope | undefined {
  return isMcpCustomScope(value) ? value : parseMcpScope(value);
}

/** Legacy absent grants are code-only; malformed persisted authority is never upgraded. */
export function resolveMcpGrantTypes(value: unknown): TypeMcpGrantTypes | undefined {
  if (value === undefined || value === null) return ['authorization_code'];
  if (!Array.isArray(value)) return undefined;
  if (value.length === 1 && value[0] === 'authorization_code') return ['authorization_code'];
  if (
    value.length === 2 &&
    ((value[0] === 'authorization_code' && value[1] === 'refresh_token') ||
      (value[0] === 'refresh_token' && value[1] === 'authorization_code'))
  ) {
    return ['authorization_code', 'refresh_token'];
  }
  return undefined;
}

export function mcpScopeIncludes(ceiling: TypeMcpScope, scope: TypeMcpScope): boolean {
  return ceiling === 'mcp:all' || ceiling === scope;
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
  // Personal grants have no product cap, only safely representable finite deadlines.
  if (
    !Number.isSafeInteger(config.personalTokenTtl) ||
    config.personalTokenTtl <= 0 ||
    !Number.isSafeInteger(Date.now() + config.personalTokenTtl * 1000)
  ) {
    invalid();
  }
  if (
    !Number.isSafeInteger(config.refreshTokenTtl) ||
    config.refreshTokenTtl <= 0 ||
    config.refreshTokenTtl > 30 * 24 * 60 * 60
  ) {
    invalid();
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

/** Share the framework public origin, including its nonproduction request fallback. */
export function getMcpIssuer(app: VonaApplication): string {
  const config = getMcpAuthConfig(app);
  const origin = app.util.getAbsoluteUrl();
  const url = configuredUrl(origin, config.allowLoopbackHttp);
  if (url.origin !== origin) throw new OAuthError('server_error', 503);
  return `${origin}/mcp`;
}

/** Resolve normal AS routing without caller selectors or ambient tenant state. */
export function resolveMcpInstance(app: VonaApplication, host: string): IMcpAuthIssuer {
  const issuer = getMcpIssuer(app);
  const url = new URL(issuer);
  if (url.host !== host) throw new OAuthError('invalid_target');
  const ctx = app.createAnonymousContext({
    headers: { host },
    method: 'POST',
    url: '/mcp/auth',
    socket: { encrypted: url.protocol === 'https:' },
  });
  const instanceName = ctx.instanceName;
  if (typeof instanceName !== 'string') throw new OAuthError('invalid_target');
  return { issuer, instanceName };
}

/** Resolve a registered, enabled SSR Site independently of browser input and ambient selectors. */
export function resolveMcpResource(
  app: VonaApplication,
  host: string,
  ssrSiteId: string,
): IMcpAuthResource {
  const { issuer, instanceName } = resolveMcpInstance(app, host);
  if (
    typeof ssrSiteId !== 'string' ||
    !/^[\w-]+$/.test(ssrSiteId) ||
    ['auth', 'token', 'register'].includes(ssrSiteId)
  ) {
    throw new OAuthError('invalid_target');
  }
  const sites = app.scope('a-ssr').service.ssr.getSitesEnabled(instanceName as never, host);
  if (!sites.some(site => site.beanOptions.options?.siteId === ssrSiteId)) {
    throw new OAuthError('invalid_target');
  }
  return { resource: `${issuer}/${ssrSiteId}`, instanceName, ssrSiteId };
}

/** Resource identity is an exact trusted URL: no aliases, query, fragment or encoded path. */
export function resolveMcpResourceUrl(app: VonaApplication, resource: string): IMcpAuthResource {
  if (typeof resource !== 'string') throw new OAuthError('invalid_target');
  const issuer = getMcpIssuer(app);
  const prefix = `${issuer}/`;
  if (!resource.startsWith(prefix)) throw new OAuthError('invalid_target');
  const ssrSiteId = resource.slice(prefix.length);
  const resolved = resolveMcpResource(app, new URL(issuer).host, ssrSiteId);
  if (resolved.resource !== resource) throw new OAuthError('invalid_target');
  return resolved;
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
