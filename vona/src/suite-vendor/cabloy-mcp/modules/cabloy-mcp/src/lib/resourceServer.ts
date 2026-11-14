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

// These AS routes share the issuer prefix but are never business transport endpoints.
const authorizationServerPaths = new Set(['auth', 'token', 'register']);

export function mcpRequestSiteId(path: string): string | undefined {
  const match = /^\/mcp\/([\w-]+)$/.exec(path);
  return match !== null && !authorizationServerPaths.has(match[1]) ? match[1] : undefined;
}

export function mcpMetadataSiteId(path: string): string | undefined {
  const prefix = `${mcpResourceMetadataPath}/`;
  return path.startsWith(prefix)
    ? mcpRequestSiteId(`/mcp/${path.slice(prefix.length)}`)
    : undefined;
}

/** Resolve authority and enabled Site without borrowing the ingress context. */
export function resolveMcpRequestResource(
  app: VonaApplication,
  req: IncomingMessage,
  ssrSiteId: string,
) {
  const hosts: string[] = [];
  for (let index = 0; index < req.rawHeaders.length; index += 2) {
    if (req.rawHeaders[index].toLowerCase() === 'host') hosts.push(req.rawHeaders[index + 1]);
  }
  if (hosts.length !== 1 || !hosts[0]) throw new OAuthError('invalid_request', 400);
  return resolveMcpResource(app, hosts[0], ssrSiteId);
}

export function mcpResourceChallenge(
  resource: IMcpAuthResource,
  error?: 'invalid_token' | 'insufficient_scope',
) {
  // Both URLs come exclusively from the backend-derived authority.
  const metadata = new URL(`${mcpResourceMetadataPath}/${resource.ssrSiteId}`, resource.resource)
    .href;
  return `Bearer resource_metadata="${metadata}"${error ? `, error="${error}"` : ''}${error === 'insufficient_scope' ? ', scope="mcp:read"' : ''}`;
}

/** Used after explicit instance initialization in the transport-owned fresh ctx. */
export async function authenticateMcpResource(
  app: VonaApplication,
  token: string,
  resource: IMcpAuthResource,
) {
  if (
    !app.ctx?.instance ||
    app.ctx.instanceName !== resource.instanceName ||
    app.ctx.state.mcpResource?.resource !== resource.resource ||
    app.ctx.state.mcpResource.ssrSiteId !== resource.ssrSiteId
  ) {
    throw new OAuthError('invalid_token', 401);
  }
  // Admission owns Passport attachment and verified provenance for both token formats.
  const authorization = app.scope('mcp-auth').service.authorization;
  const admitted = await authorization.lookupContext(token, resource.resource);
  authorization.recordRefreshEvidence('mcp.oauth.refreshed_access_accepted');
  return admitted;
}

/** Strip opaque credentials before either framework or SDK/business dispatch. */
export function sanitizeMcpRequest(
  app: VonaApplication,
  req: IncomingMessage,
  resource: IMcpAuthResource,
) {
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
  req.url = new URL(resource.resource).pathname;
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
    const ssrSiteId = mcpMetadataSiteId(req.url ?? '');
    if (!ssrSiteId) throw new OAuthError('invalid_request', 400);
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
    const resource = resolveMcpRequestResource(app, req, ssrSiteId);
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
