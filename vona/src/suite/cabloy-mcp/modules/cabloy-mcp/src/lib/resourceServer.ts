import type { IncomingMessage, ServerResponse } from 'node:http';
import type { VonaApplication } from 'vona';
import type { IMcpAuthResource } from 'vona-module-mcp-auth';

import {
  getMcpIssuer,
  mcpSupportedScopes,
  OAuthError,
  resolveMcpResource,
} from 'vona-module-mcp-auth';

export const mcpResourceMetadataPath = '/.well-known/oauth-protected-resource/mcp';

/** Authority is selected only from the backend public origin, never proxy headers. */
export function resolveMcpRequestResource(app: VonaApplication, req: IncomingMessage) {
  const hosts: string[] = [];
  for (let index = 0; index < req.rawHeaders.length; index += 2) {
    if (req.rawHeaders[index].toLowerCase() === 'host') hosts.push(req.rawHeaders[index + 1]);
  }
  if (hosts.length !== 1 || !hosts[0]) throw new OAuthError('invalid_request', 400);
  return resolveMcpResource(app, hosts[0]);
}

export function mcpResourceChallenge(
  resource: IMcpAuthResource,
  error?: 'invalid_token' | 'insufficient_scope',
) {
  // Both URLs come exclusively from the backend-derived authority.
  const metadata = new URL(mcpResourceMetadataPath, resource.resource).href;
  return `Bearer resource_metadata="${metadata}"${error ? `, error="${error}"` : ''}${error === 'insufficient_scope' ? ', scope="mcp:read"' : ''}`;
}

/** Used after explicit instance initialization in the transport-owned fresh ctx. */
export async function authenticateMcpResource(
  app: VonaApplication,
  token: string,
  resource: IMcpAuthResource,
) {
  if (!app.ctx?.instance || app.ctx.instanceName !== resource.instanceName) {
    throw new OAuthError('invalid_token', 401);
  }
  const passport = await app
    .scope('mcp-auth')
    .service.authorization.lookup(token, resource.resource);
  await app.bean.passport.setCurrent(passport);
}

/** Strip opaque credentials before either framework or SDK/business dispatch. */
export function sanitizeMcpRequest(app: VonaApplication, req: IncomingMessage) {
  const extract = app.scope('a-jwt').config.field.extract;
  const removed = new Set([
    'authorization',
    'cookie',
    'proxy-authorization',
    'forwarded',
    'x-vona-instance-name',
    app.config.instance.headerField?.toLowerCase(),
    extract.header?.toLowerCase(),
    extract.headerAuth?.toLowerCase(),
  ]);
  const retain = (name: string) =>
    !removed.has(name.toLowerCase()) && !name.toLowerCase().startsWith('x-forwarded-');
  req.headers = Object.fromEntries(Object.entries(req.headers).filter(([name]) => retain(name)));
  const rawHeaders: string[] = [];
  for (let index = 0; index < req.rawHeaders.length; index += 2) {
    if (retain(req.rawHeaders[index]))
      rawHeaders.push(req.rawHeaders[index], req.rawHeaders[index + 1]);
  }
  req.rawHeaders = rawHeaders;
  req.url = '/mcp';
}

/** Direct RFC 9728 response, deliberately outside tenant middleware and envelopes. */
export function handleMcpResourceMetadata(
  app: VonaApplication,
  req: IncomingMessage,
  res: ServerResponse,
) {
  let status = 200;
  let body: unknown;
  let allow: string | undefined;
  try {
    if (!app.meta.appReady || app.meta.appClose || !app.scope('cabloy-mcp').config.enabled) {
      throw new OAuthError('temporarily_unavailable', 503);
    }
    if (req.url !== mcpResourceMetadataPath) throw new OAuthError('invalid_request', 400);
    if (
      req.rawHeaders.some(
        (name, index) =>
          index % 2 === 0 &&
          ([
            'authorization',
            'cookie',
            'proxy-authorization',
            'forwarded',
            'x-vona-instance-name',
            app.config.instance.headerField?.toLowerCase(),
          ].includes(name.toLowerCase()) ||
            name.toLowerCase().startsWith('x-forwarded-')),
      )
    ) {
      throw new OAuthError('invalid_request', 403);
    }
    if (req.method !== 'GET') {
      allow = 'GET';
      throw new OAuthError('invalid_request', 405);
    }
    const resource = resolveMcpRequestResource(app, req);
    const issuer = getMcpIssuer(app);
    body = {
      resource: resource.resource,
      authorization_servers: [issuer],
      scopes_supported: mcpSupportedScopes,
      bearer_methods_supported: ['header'],
    };
  } catch (error) {
    status = error instanceof OAuthError ? error.status : 503;
    body = { error: status === 503 ? 'temporarily_unavailable' : 'invalid_request' };
  }
  res.writeHead(status, {
    'content-type': 'application/json',
    'cache-control': 'no-store',
    ...(allow ? { allow } : {}),
  });
  res.end(JSON.stringify(body));
}
