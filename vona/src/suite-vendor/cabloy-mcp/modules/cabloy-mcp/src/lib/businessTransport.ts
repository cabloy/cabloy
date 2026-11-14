import type { Server } from '@modelcontextprotocol/server';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { IInstanceRecord, VonaApplication } from 'vona';
import type { IMcpAuthResource, TypeMcpScope } from 'vona-module-mcp-auth';

import { toNodeHandler } from '@modelcontextprotocol/node';
import {
  createMcpHandler,
  isInitializedNotification,
  isJSONRPCNotification,
  isLegacyRequest,
  WebStandardStreamableHTTPServerTransport,
} from '@modelcontextprotocol/server';
import { runWithZodQueryCoercion } from 'vona';
import { RateLimitError, RateLimitUnavailableError } from 'vona-module-a-ratelimit';
import { OAuthError } from 'vona-module-mcp-auth';

import { queryRepairHint } from './controllerToolContract.ts';
import { authenticateMcpResource, mcpResourceChallenge } from './resourceServer.ts';
import { FixtureTransportError, readFixtureBody } from './transport.ts';

type BusinessToolServer = Server & { settleWork(): Promise<void> };

export interface IBusinessTransportAuthentication {
  token: string;
  resource: IMcpAuthResource;
}

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

export function fail(
  res: ServerResponse,
  status: number,
  code = -32000,
  allow?: string,
  challenge?: string,
  rateLimit?: RateLimitError | RateLimitUnavailableError,
) {
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
    ...(challenge ? { 'www-authenticate': challenge } : {}),
    ...(rateLimit instanceof RateLimitError
      ? { 'retry-after': String(rateLimit.errors.retryAfterSeconds) }
      : {}),
  });
  const body = errorBody(code);
  res.end(
    JSON.stringify(
      rateLimit
        ? {
            ...body,
            error: {
              ...body.error,
              message: rateLimit.message,
              data: rateLimit.errors,
            },
          }
        : body,
    ),
  );
}

// Buffer only the selected JSON response, never an SSE stream or partial payload.
async function boundedResponse(response: Response, requestId: unknown): Promise<Response> {
  if (response.status === 202 && response.body === null) {
    return new Response(null, {
      status: 202,
      headers: { 'cache-control': 'no-store' },
    });
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
  let output = body.error ? errorBody(body.error.code, body.id) : body;
  // Only the mapper's PublicQueryError boundary emits this exact envelope.
  // Rebuild bounded diagnostics and the fixed repair hint; never forward arbitrary SDK
  // error data, action errors, messages, or caller-supplied lookalike fields.
  const queryCodes = new Set([
    'query_bytes',
    'query_complexity',
    'query_cycle',
    'query_duplicate_order',
    'query_invalid',
    'query_list_length',
    'query_offset',
    'query_predicate_depth',
    'query_shape',
    'query_string_length',
  ]);
  const data = body.error?.data;
  if (
    body.error?.code === -32602 &&
    body.error.message === 'Invalid tool arguments' &&
    data &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    Object.keys(data).length === 3 &&
    data.hint === queryRepairHint &&
    queryCodes.has(data.queryCode) &&
    typeof data.path === 'string' &&
    data.path.length <= 256 &&
    /^[\w.]*$/.test(data.path)
  ) {
    output = {
      ...output,
      error: {
        code: -32602,
        message: 'Invalid tool arguments',
        data: {
          queryCode: data.queryCode,
          path: data.path,
          hint: queryRepairHint,
        },
      },
    };
  }
  // Do not forward SDK diagnostic headers or other caller-controlled error data.
  return new Response(JSON.stringify(output), {
    status: response.status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}

/** One worker-owned exchange slot; each ingress supplies its own tool composition. */
export function createBusinessTransport(
  app: VonaApplication,
  initializeInstance: boolean,
  createServer: (
    app: VonaApplication,
    resource: string | undefined,
    scope?: TypeMcpScope,
  ) => Promise<BusinessToolServer>,
) {
  let closing = false;
  let contexts = 0;
  let settled = 0;
  let failed = false;
  let current: { abort: AbortController; res: ServerResponse; done: Promise<void> } | undefined;
  async function execute(
    req: IncomingMessage,
    res: ServerResponse,
    abort: AbortController,
    instanceName: keyof IInstanceRecord | undefined,
    authentication: IBusinessTransportAuthentication | undefined,
  ) {
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
          const denial = await app
            .scope('a-ratelimit')
            .service.rateLimitAggregate.admitConfigured();
          if (abort.signal.aborted) return;
          if (denial) {
            const error =
              denial.status === 429
                ? new RateLimitError(denial.limit, denial.retryAfterSeconds)
                : new RateLimitUnavailableError();
            fail(res, denial.status, -32000, undefined, undefined, error);
            return;
          }
          if (initializeInstance) {
            try {
              await app.scope('a-instance').service.instance.initInstance();
            } catch (error) {
              const status = (error as { status?: number }).status;
              if (status !== 403 && status !== 423) throw error;
              fail(res, status);
              return;
            }
          }
          let authorizationScope: TypeMcpScope | undefined;
          if (initializeInstance) {
            if (!authentication) {
              fail(res, 401);
              return;
            }
            try {
              const authorization = await authenticateMcpResource(
                app,
                authentication.token,
                authentication.resource,
              );
              authorizationScope = authorization.scope;
            } catch (error) {
              const scope =
                error instanceof OAuthError && error.oauthError === 'insufficient_scope';
              const status = scope
                ? 403
                : error instanceof OAuthError && error.status === 401
                  ? 401
                  : 503;
              fail(
                res,
                status,
                -32000,
                undefined,
                status === 401 || scope
                  ? mcpResourceChallenge(
                      authentication.resource,
                      scope ? 'insufficient_scope' : 'invalid_token',
                    )
                  : undefined,
              );
              return;
            }
          }
          if (abort.signal.aborted) return;
          await runWithZodQueryCoercion(false, async () => {
            let business: BusinessToolServer | undefined;
            let legacy: WebStandardStreamableHTTPServerTransport | undefined;
            const handler = createMcpHandler(
              async () => {
                business = await createServer(
                  app,
                  authentication?.resource.resource,
                  authorizationScope,
                );
                return business;
              },
              {
                legacy: 'reject',
                // Current tools emit no mid-call notifications, so auto retains JSON.
                responseMode: 'auto',
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
                      business = await createServer(
                        app,
                        authentication?.resource.resource,
                        authorizationScope,
                      );
                      await business.connect(legacy);
                      signal.throwIfAborted();
                      let cancel!: () => void;
                      const cancelled = new Promise<never>((_resolve, reject) => {
                        cancel = () => reject(new Error('MCP_LOCAL_CANCELLED'));
                        signal.addEventListener('abort', cancel, {
                          once: true,
                        });
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
          instanceName,
          innerAccess: false,
          dbInfo: { level: 0 },
          req,
          res,
        },
        {
          initializeContext(ctx) {
            ctx.state.mcpResource = authentication
              ? Object.freeze({ ...authentication.resource })
              : undefined;
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

  let closure: Promise<void> | undefined;
  return {
    snapshot: () => ({ active: current ? 1 : 0, contexts, settled, closing }),
    async handle(
      req: IncomingMessage,
      res: ServerResponse,
      instanceName?: keyof IInstanceRecord,
      authentication?: IBusinessTransportAuthentication,
    ) {
      if (closing) return fail(res, 503);
      if (current) return fail(res, 429);
      const abort = new AbortController();
      const owned = { abort, res, done: Promise.resolve() };
      current = owned;
      owned.done = execute(req, res, abort, instanceName, authentication).finally(() => {
        if (current === owned) current = undefined;
      });
      await owned.done;
    },
    close(): Promise<void> {
      return (closure ??= (async () => {
        closing = true;
        if (current) {
          fail(current.res, 503);
          current.abort.abort();
          await current.done;
        }
        if (failed) throw new Error('MCP_LOCAL_OPERATION_FAILED');
      })());
    },
  };
}
