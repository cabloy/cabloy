import type { IncomingMessage, ServerResponse } from 'node:http';
import type { IInstanceRecord, VonaApplication } from 'vona';

import { checkProtocolIngress, fixtureIngressLimits } from 'vona-module-cabloy-mcp';

import type { createBusinessTransport } from './businessTransport.ts';

function fail(res: ServerResponse, status: number, allow?: string) {
  if (res.destroyed || res.writableEnded) return;
  res.writeHead(status, {
    'content-type': 'application/json',
    'cache-control': 'no-store',
    'connection': 'close',
    ...(allow ? { allow } : {}),
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

/** Shared dev/test ingress; guarded business actions retain their own permissions. */
export async function handleDevRequest(
  app: VonaApplication,
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (!app.meta.appReady || app.meta.appClose || !app.scope('cabloy-mcp').config.enabled) {
    fail(res, 503);
    return;
  }
  if (Buffer.byteLength(req.url ?? '') > fixtureIngressLimits.targetBytes) {
    fail(res, 414);
    return;
  }
  // The base only parses an origin-form target; it is not an ingress authority.
  const url = URL.parse(req.url ?? '', 'http://mcp.invalid');
  const queryField = app.config.instance.queryField;
  if (
    !req.url?.startsWith('/mcp') ||
    !url ||
    url.hash ||
    url.pathname !== '/mcp' ||
    [...url.searchParams.keys()].some(key => key !== 'instanceName' && key !== queryField) ||
    [...new Set(url.searchParams.keys())].some(key => url.searchParams.getAll(key).length !== 1)
  ) {
    fail(res, 400);
    return;
  }
  const denial = checkProtocolIngress({
    rawHeaders: req.rawHeaders,
    target: url.pathname,
    method: req.method,
    instanceHeader: app.config.instance.headerField,
  });
  if (denial) {
    fail(res, denial.status, denial.allow);
    return;
  }
  const instanceName = (url.searchParams.get('instanceName') || undefined) as
    | keyof IInstanceRecord
    | undefined;
  // DTO decorators require the configured application; load protocol/business
  // code only after startup, just like the independent local runtime.
  const { createBusinessTransport } = await import('./businessTransport.ts');
  let exchange = exchanges.get(app);
  if (!exchange) {
    exchange = createBusinessTransport(app, true);
    exchanges.set(app, exchange);
  }
  await exchange.handle(req, res, instanceName);
}

export function devTransportSnapshot(app: VonaApplication) {
  return exchanges.get(app)?.snapshot();
}

export async function closeDevTransport(app: VonaApplication) {
  await exchanges.get(app)?.close();
}
