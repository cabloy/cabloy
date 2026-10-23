import type { IncomingMessage, ServerResponse } from 'node:http';
import type { VonaApplication } from 'vona';

import { toNodeHandler } from '@modelcontextprotocol/node';
import {
  createMcpHandler,
  isInitializedNotification,
  isJSONRPCNotification,
  isLegacyRequest,
  WebStandardStreamableHTTPServerTransport,
} from '@modelcontextprotocol/server';
import { createServer } from 'node:http';
import { assertTestAppIdentity, runWithZodQueryCoercion } from 'vona';
import {
  FixtureTransportError,
  checkFixtureIngress,
  fixtureIngressLimits,
  readFixtureBody,
} from 'vona-module-cabloy-mcp';

import { createBusinessToolServer } from './businessTools.ts';

const RESPONSE_BYTES = 1024 * 1024;
const messages = new Map([
  [-32700, 'Parse error'],
  [-32600, 'Invalid request'],
  [-32601, 'Method not found'],
  [-32602, 'Invalid params'],
  [-32603, 'Internal error'],
  [-32000, 'Request rejected'],
  [-32020, 'Invalid request headers'],
  [-32021, 'Missing required client capability'],
  [-32022, 'Unsupported protocol version'],
]);

function errorBody(code: number, id: unknown = null) {
  const safeCode = messages.has(code) ? code : -32603;
  return {
    jsonrpc: '2.0',
    id: typeof id === 'string' || (typeof id === 'number' && Number.isSafeInteger(id)) ? id : null,
    error: {
      code: safeCode,
      message: messages.get(safeCode),
      ...(safeCode === -32022 ? { data: { supported: ['2026-07-28'] } } : {}),
    },
  };
}

function fail(res: ServerResponse, status: number, code = -32000, allow?: string) {
  if (res.destroyed || res.writableEnded) return;
  if (res.headersSent) {
    res.destroy();
    return;
  }
  res.writeHead(status, {
    'content-type': 'application/json',
    'cache-control': 'no-store',
    'connection': 'close',
    ...(allow ? { allow } : {}),
  });
  res.end(JSON.stringify(errorBody(code)));
}

// Buffer only the selected JSON response, never an SSE stream or partial payload.
async function boundedResponse(response: Response, requestId: unknown): Promise<Response> {
  if (response.status === 202 && response.body === null) {
    return new Response(null, { status: 202, headers: { 'cache-control': 'no-store' } });
  }
  if (!response.headers.get('content-type')?.startsWith('application/json') || !response.body) {
    await response.body?.cancel();
    throw new Error('MCP_LOCAL_JSON_REQUIRED');
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > RESPONSE_BYTES) throw new Error('MCP_LOCAL_RESPONSE_LIMIT');
      chunks.push(chunk.value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }
  const body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
  // Vona's query parse adapter can coerce the legacy SDK's numeric ID to string.
  // Each local exchange has one request; preserve its original JSON-RPC ID type.
  if (
    (typeof requestId === 'string' ||
      (typeof requestId === 'number' && Number.isSafeInteger(requestId))) &&
    String(body.id) === String(requestId)
  ) {
    body.id = requestId;
  }
  const output = body.error ? errorBody(body.error.code, body.id) : body;
  // Do not forward SDK diagnostic headers or caller-controlled error data.
  return new Response(JSON.stringify(output), {
    status: response.status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

/** Dedicated managed-test local verification only; never registered by dev/start. */
export async function startLocalTransport(app: VonaApplication) {
  const env = app.meta.env;
  const runId = assertTestAppIdentity(env.META_MODE, env.VONA_TEST_RUN_ID, app.name);
  if (
    !runId ||
    !app.meta.isTest ||
    env.META_MODE !== 'test' ||
    process.env.VONA_TEST_RUN_ID !== runId ||
    process.env.TEST_ONLY === 'true' ||
    app.config.server.listen.disable !== true ||
    app.server
  ) {
    throw new Error('MCP_LOCAL_ISOLATED_APP_REQUIRED');
  }

  let host = '';
  let closing = false;
  let contexts = 0;
  let settled = 0;
  let failed = false;
  let current: { abort: AbortController; res: ServerResponse; done: Promise<void> } | undefined;
  const instanceHeader = app.config.instance.headerField;
  const instanceHeaders = typeof instanceHeader === 'string' ? [instanceHeader] : [];

  async function execute(req: IncomingMessage, res: ServerResponse, abort: AbortController) {
    const disconnected = () => {
      if (!res.writableFinished) abort.abort();
    };
    res.once('close', disconnected);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const body = await readFixtureBody(req, abort.signal);
      if (abort.signal.aborted) return;
      // Only initialization acknowledgement; no business notification producers.
      const initialized = runWithZodQueryCoercion(
        false,
        () => isJSONRPCNotification(body) && isInitializedNotification(body),
      );
      const request =
        body &&
        typeof body === 'object' &&
        'id' in body &&
        'method' in body &&
        ['server/discover', 'tools/list', 'tools/call', 'initialize'].includes(String(body.method));
      if (!request && !initialized) {
        fail(res, 400, -32600);
        return;
      }
      const requestId = body && typeof body === 'object' && 'id' in body ? body.id : undefined;
      timer = setTimeout(() => {
        fail(res, 504);
        abort.abort();
      }, 10000);
      await app.bean.executor.newCtx(
        async () => {
          contexts++;
          await runWithZodQueryCoercion(false, async () => {
            let business: Awaited<ReturnType<typeof createBusinessToolServer>> | undefined;
            let legacy: WebStandardStreamableHTTPServerTransport | undefined;
            const handler = createMcpHandler(
              async () => {
                business = await createBusinessToolServer(app);
                return business;
              },
              {
                legacy: 'reject',
                responseMode: 'json',
                keepAliveMs: 0,
                maxRequestBodySize: 16 * 1024,
                onerror: () => {},
              },
            );
            try {
              const adapter = toNodeHandler({
                async fetch(request, options) {
                  const signal = AbortSignal.any([request.signal, abort.signal]);
                  try {
                    const incoming = new Request(request, { signal });
                    signal.throwIfAborted();
                    let response: Response;
                    if (await isLegacyRequest(incoming, options?.parsedBody)) {
                      legacy = new WebStandardStreamableHTTPServerTransport({
                        sessionIdGenerator: undefined,
                        enableJsonResponse: true,
                        keepAliveMs: 0,
                        maxRequestBodySize: 16 * 1024,
                      });
                      business = await createBusinessToolServer(app);
                      await business.connect(legacy);
                      signal.throwIfAborted();
                      let cancel!: () => void;
                      const cancelled = new Promise<never>((_resolve, reject) => {
                        cancel = () => reject(new Error('MCP_LOCAL_CANCELLED'));
                        signal.addEventListener('abort', cancel, { once: true });
                      });
                      try {
                        // Native JSON close does not resolve its pending response wait.
                        // Actual business settlement is still owned by the outer finally.
                        response = await Promise.race([
                          legacy.handleRequest(incoming, options),
                          cancelled,
                        ]);
                      } finally {
                        signal.removeEventListener('abort', cancel);
                      }
                    } else {
                      response = await handler.fetch(incoming, options);
                    }
                    const bounded = await boundedResponse(response, requestId);
                    if (abort.signal.aborted) throw new Error('MCP_LOCAL_CANCELLED');
                    return bounded;
                  } catch (error) {
                    if (abort.signal.aborted) throw error;
                    // The Node adapter otherwise converts this failure to its own
                    // response and resolves, hiding failure from the drain owner.
                    failed = true;
                    return Response.json(errorBody(-32603), {
                      status: 500,
                      headers: { 'cache-control': 'no-store' },
                    });
                  }
                },
              });
              try {
                await adapter(req, res, body);
              } catch (error) {
                if (!abort.signal.aborted) throw error;
              }
            } finally {
              // Transport abort/close is not proof that the controller/DTO work ended.
              try {
                try {
                  await legacy?.close();
                } finally {
                  await handler.close();
                }
              } finally {
                await business?.settleWork();
                await business?.close();
              }
            }
          });
        },
        {
          instanceName: '',
          innerAccess: false,
          dbInfo: { level: 0 },
          req,
          res,
        },
        {
          initializeContext(ctx) {
            ctx.respond = false;
            ctx.onerror = () => {
              failed = true;
              fail(res, 500, -32603);
              abort.abort();
            };
          },
          onScopeOutcome(outcome) {
            if (outcome !== 'disposed') failed = true;
          },
        },
      );
    } catch (error) {
      if (error instanceof FixtureTransportError) {
        fail(res, error.status, error.code);
      } else {
        fail(res, 500, -32603);
        // Expected adapter cancellation is handled inside the owned callback.
        // Executor/cleanup failure remains failure even after a disconnect.
        failed = true;
      }
    } finally {
      clearTimeout(timer);
      res.removeListener('close', disconnected);
      settled++;
    }
  }

  const listener = createServer(
    {
      maxHeaderSize: fixtureIngressLimits.headerBytes,
      headersTimeout: 2000,
      connectionsCheckingInterval: 250,
      requestTimeout: 0,
      keepAliveTimeout: 1000,
    },
    (req, res) => {
      const denial = checkFixtureIngress({
        peer: req.socket.remoteAddress,
        host,
        rawHeaders: req.rawHeaders,
        target: req.url,
        method: req.method,
        instanceHeaders,
      });
      if (denial) {
        fail(res, denial.status, -32000, denial.allow);
        return;
      }
      if (closing) {
        fail(res, 503);
        return;
      }
      if (current) {
        fail(res, 429);
        return;
      }
      const abort = new AbortController();
      const owned = { abort, res, done: Promise.resolve() };
      current = owned;
      owned.done = execute(req, res, abort).finally(() => {
        if (current === owned) current = undefined;
      });
    },
  );
  listener.on('clientError', (_error, socket) => {
    if (socket.writable)
      socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
  });
  listener.on('checkContinue', (_req, res) => fail(res, 400));
  listener.on('checkExpectation', (_req, res) => fail(res, 400));
  await new Promise<void>((resolve, reject) => {
    listener.once('error', reject);
    listener.listen(0, '127.0.0.1', () => {
      listener.removeListener('error', reject);
      resolve();
    });
  });
  const address = listener.address();
  if (!address || typeof address === 'string') throw new Error('MCP_LOCAL_LISTENER_REQUIRED');
  host = `127.0.0.1:${address.port}`;
  let closure: Promise<void> | undefined;
  return {
    url: `http://${host}/mcp`,
    snapshot: () => ({ active: current ? 1 : 0, contexts, settled, closing }),
    close(): Promise<void> {
      return (closure ??= (async () => {
        closing = true;
        const stopped = new Promise<void>((resolve, reject) =>
          listener.close(error => (error ? reject(error) : resolve())),
        );
        if (current) {
          fail(current.res, 503);
          current.abort.abort();
          await current.done;
        }
        await stopped;
        if (failed) throw new Error('MCP_LOCAL_OPERATION_FAILED');
      })());
    },
  };
}
