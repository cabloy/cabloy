import type { VonaApplication } from 'vona';

import { createHash, timingSafeEqual } from 'node:crypto';

import type { IMcpAuthConfig, IMcpAuthResource } from '../types/index.ts';

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

/** Validate authored registrations, including the intentionally disabled empty default. */
export function validateMcpAuthConfig(config: IMcpAuthConfig): IMcpAuthConfig {
  const invalid = () => {
    throw new OAuthError('server_error', 503);
  };
  if (
    !config ||
    typeof config.issuer !== 'string' ||
    !Array.isArray(config.resources) ||
    !Array.isArray(config.clients) ||
    typeof config.allowLoopbackHttp !== 'boolean'
  ) {
    invalid();
  }
  for (const ttl of [config.pendingTtl, config.codeTtl, config.tokenTtl]) {
    if (!Number.isSafeInteger(ttl) || ttl <= 0 || ttl > 86400) invalid();
  }
  if (!config.issuer) {
    if (config.resources.length || config.clients.length) invalid();
    return config;
  }
  const issuer = configuredUrl(config.issuer, config.allowLoopbackHttp);
  if (issuer.origin !== config.issuer) invalid();
  const resources = new Set<string>();
  const hosts = new Set<string>();
  for (const item of config.resources) {
    if (!item || typeof item.instanceName !== 'string') invalid();
    const url = configuredUrl(item.resource, config.allowLoopbackHttp);
    // Initial profile is integrated, same-origin AS/Site/resource, not remote federation.
    if (
      url.origin !== issuer.origin ||
      url.pathname !== '/mcp' ||
      url.search ||
      item.resource.includes('?') ||
      url.href !== item.resource ||
      resources.has(item.resource) ||
      hosts.has(url.host)
    ) {
      invalid();
    }
    resources.add(item.resource);
    hosts.add(url.host);
  }
  const clientIds = new Set<string>();
  for (const client of config.clients) {
    if (
      !client ||
      typeof client.clientId !== 'string' ||
      !client.clientId ||
      client.clientId.length > 255 ||
      typeof client.name !== 'string' ||
      !client.name ||
      client.name.length > 255 ||
      clientIds.has(client.clientId) ||
      !Array.isArray(client.redirectUris) ||
      !client.redirectUris.length ||
      !Array.isArray(client.resources) ||
      !client.resources.length ||
      new Set(client.redirectUris).size !== client.redirectUris.length ||
      new Set(client.resources).size !== client.resources.length
    ) {
      invalid();
    }
    clientIds.add(client.clientId);
    for (const redirectUri of client.redirectUris) {
      const url = configuredUrl(redirectUri, config.allowLoopbackHttp);
      if (url.href !== redirectUri) invalid();
    }
    if (client.resources.some(resource => !resources.has(resource))) invalid();
    if (client.authentication === 'client_secret_basic') {
      if (!client.secretSha256 || !/^[a-f0-9]{64}$/.test(client.secretSha256)) invalid();
    } else if (client.authentication !== 'none' || client.secretSha256 !== undefined) {
      invalid();
    }
  }
  return config;
}

export function getMcpAuthConfig(app: VonaApplication): IMcpAuthConfig {
  // One root-owned registry is shared by pre-instance ingress and scoped services.
  // Instance-local overrides must not create a second authority mapping.
  const config = validateMcpAuthConfig(app.config.modules['mcp-auth']);
  if (!config.issuer || !config.resources.length || !config.clients.length) {
    throw new OAuthError('temporarily_unavailable', 503);
  }
  return config;
}

/** Host selects only a canonical registered resource; it never creates an authority. */
export function resolveMcpResource(app: VonaApplication, host: string): IMcpAuthResource {
  const config = getMcpAuthConfig(app);
  const resource = config.resources.find(item => new URL(item.resource).host === host);
  if (!resource) throw new OAuthError('invalid_target');
  return resource;
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
