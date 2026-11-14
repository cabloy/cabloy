import type { IncomingMessage, ServerResponse } from 'node:http';
import type { IInstanceRecord, VonaApplication } from 'vona';
import type { IMcpAuthResource } from 'vona-module-mcp-auth';

import { OAuthError } from 'vona-module-mcp-auth';

import type { createBusinessTransport } from './businessTransport.ts';

import {
  mcpRequestSiteId,
  mcpResourceChallenge,
  resolveMcpRequestResource,
  sanitizeMcpRequest,
} from './resourceServer.ts';
import { checkProtocolIngress, fixtureIngressLimits } from './transportIngress.ts';

function fail(res: ServerResponse, status: number, allow?: string, challenge?: string) {
  if (res.destroyed || res.writableEnded) return;
  res.writeHead(status, {
    'content-type': 'application/json',
    'cache-control': 'no-store',
    'connection': 'close',
    ...(allow ? { allow } : {}),
    ...(challenge ? { 'www-authenticate': challenge } : {}),
  });
  res.end(
    JSON.stringify({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32000, message: 'Request rejected' },
    }),
  );
}

const exchanges = new WeakMap<VonaApplication, ReturnType<typeof createBusinessTransport>>();

/** Shared-listener MCP ingress; guarded business actions retain their own permissions. */
export async function handleMcpRequest(
  app: VonaApplication,
  req: IncomingMessage,
  res: ServerResponse,
) {
  // Recognized runtime modes share the same readiness and authorization boundary.
  if (
    (!app.meta.isDev && !app.meta.isTest && !app.meta.isProd) ||
    !app.meta.appReady ||
    app.meta.appClose ||
    !app.scope('cabloy-mcp').config.enabled
  ) {
    fail(res, 503);
    return;
  }
  if (Buffer.byteLength(req.url ?? '') > fixtureIngressLimits.targetBytes) {
    fail(res, 414);
    return;
  }
  if (req.url === '/mcp') {
    fail(res, 404);
    return;
  }
  // Parse only origin-form input; the synthetic base is never an authority.
  const url = URL.parse(req.url ?? '', 'http://mcp.invalid');
  const ssrSiteId = url ? mcpRequestSiteId(url.pathname) : undefined;
  const queryField = app.config.instance.queryField;
  const selectors = new Set(['instanceName', ...(queryField ? [queryField] : [])]);
  if (
    !req.url?.startsWith('/mcp/') ||
    !url ||
    !ssrSiteId ||
    url.hash ||
    req.url.split('?')[0] !== url.pathname ||
    [...url.searchParams.keys()].some(key => !selectors.has(key)) ||
    [...new Set(url.searchParams.keys())].some(key => url.searchParams.getAll(key).length !== 1)
  ) {
    fail(res, 400);
    return;
  }
  let resource: IMcpAuthResource;
  try {
    resource = resolveMcpRequestResource(app, req, ssrSiteId);
  } catch (error) {
    fail(res, error instanceof OAuthError ? error.status : 503);
    return;
  }
  const denial = checkProtocolIngress({
    rawHeaders: req.rawHeaders,
    target: url.pathname,
    method: req.method,
    instanceHeader: app.config.instance.headerField,
    authentication: 'bearer',
  });
  if (denial) {
    fail(
      res,
      denial.status,
      denial.allow,
      denial.status === 401 ? mcpResourceChallenge(resource) : undefined,
    );
    return;
  }
  const headerField = app.config.instance.headerField?.toLowerCase();
  const extract = app.scope('a-jwt').config.field.extract;
  const extraCredentialHeaders = new Set([
    extract.header?.toLowerCase(),
    extract.headerAuth?.toLowerCase(),
  ]);
  extraCredentialHeaders.delete('authorization');
  let token = '';
  for (let index = 0; index < req.rawHeaders.length; index += 2) {
    const name = req.rawHeaders[index].toLowerCase();
    const value = req.rawHeaders[index + 1];
    if (
      (name === headerField && value !== resource.instanceName) ||
      extraCredentialHeaders.has(name)
    ) {
      fail(res, 403);
      return;
    }
    if (name === 'authorization') token = value.slice(7);
  }
  if ([...url.searchParams.values()].some(value => value !== resource.instanceName)) {
    fail(res, 403);
    return;
  }
  // The bearer is passed only to the current-token lookup, never to JWT/authToken.
  // Remove credentials and caller selectors before creating the isolated ctx/SDK request.
  sanitizeMcpRequest(app, req, resource);
  const { createBusinessTransport } = await import('./businessTransport.ts');
  const { createSharedBusinessToolServer } = await import('./sharedBusinessTools.ts');
  let exchange = exchanges.get(app);
  if (!exchange) {
    exchange = createBusinessTransport(app, true, createSharedBusinessToolServer);
    exchanges.set(app, exchange);
  }
  await exchange.handle(req, res, resource.instanceName as keyof IInstanceRecord, {
    token,
    resource,
  });
}

export function mcpTransportSnapshot(app: VonaApplication) {
  return exchanges.get(app)?.snapshot();
}

export async function closeMcpTransport(app: VonaApplication) {
  await exchanges.get(app)?.close();
}
