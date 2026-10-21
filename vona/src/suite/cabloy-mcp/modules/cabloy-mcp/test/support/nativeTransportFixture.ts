import type { IncomingMessage, ServerResponse } from 'node:http';
import type { VonaContext } from 'vona';

import { Buffer } from 'node:buffer';
import { createServer } from 'node:http';
import { Socket } from 'node:net';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertTestAppIdentity, SymbolBeanContainerInstances } from 'vona';
import { app } from 'vona-mock';
import { SymbolRouterMiddleware } from 'vona-module-a-executor';

import {
  createFixtureTransport,
  FixtureTransportError,
  readFixtureBody,
  writeFixtureFailure,
} from '../../src/lib/transport.ts';
import { checkFixtureIngress, fixtureIngressLimits } from '../../src/lib/transportIngress.ts';

type Transport = ReturnType<typeof createFixtureTransport>;
type TransportOptions = Parameters<typeof createFixtureTransport>[3];
export type NativeTransportPlan = Pick<TransportOptions, 'mode' | 'workBarrier' | 'cleanupBarrier'>;

type Outcome =
  | 'RESERVED'
  | 'INGRESS_DENIED'
  | 'CAPACITY_DENIED'
  | 'CONNECTION_DENIED'
  | 'HEADER_TIMEOUT'
  | 'PARSER_DENIED'
  | 'READER_SETTLED'
  | 'EXECUTOR_ENTERED'
  | 'ROUTER_ENTERED'
  | 'TRANSPORT_EVENT'
  | 'ADAPTER_SETTLED'
  | 'WORK_SETTLED'
  | 'CLEANUP_SETTLED'
  | 'CANCEL_REQUESTED'
  | 'CANCEL_OBSERVED'
  | 'SCOPE_DISPOSED'
  | 'EXECUTOR_SETTLED'
  | 'HTTP_SETTLED'
  | 'RELEASED'
  | 'FINISH'
  | 'PREMATURE_CLOSE'
  | 'EXECUTION_DEADLINE'
  | 'CLEANUP_DEADLINE'
  | 'CASE_DEADLINE'
  | 'SUITE_DEADLINE'
  | 'QUALIFICATION_FAILED'
  | 'CLOSED';

export interface NativeTransportEvent {
  readonly sequence: number;
  readonly alias: string;
  readonly outcome: Outcome;
  readonly status?: number;
  readonly active: number;
  readonly adapterSettled?: boolean;
  readonly workSettled?: boolean;
  readonly cleanupSettled?: boolean;
  readonly scopeDisposed?: boolean;
  readonly executorSettled?: boolean;
  readonly released?: boolean;
}

export interface NativeTransportRun {
  reserved: boolean;
  readerSettled: boolean;
  httpSettled: boolean;
  adapterSettled: boolean;
  workSettled: boolean;
  cleanupSettled: boolean;
  cancelRequested: boolean;
  cancelObserved: boolean;
  executorEntered: boolean;
  routerEntered: boolean;
  scopeDisposed: boolean;
  executorSettled: boolean;
  released: boolean;
  finish: boolean;
  prematureClose: boolean;
}

export interface NativeTransportSnapshot {
  active: number;
  executorEntries: number;
  routerEntries: number;
  scopeDisposed: number;
  executorSettled: number;
  released: number;
  failed: number;
  finish: number;
  prematureClose: number;
  httpOperations: number;
  httpSettled: number;
  cancelRequested: number;
  cancelObserved: number;
  admissionOpen: boolean;
  closed: boolean;
  runs: Record<string, NativeTransportRun>;
}

export interface NativeTransportFixture {
  readonly port: number;
  readonly origin: string;
  readonly host: string;
  readonly events: readonly NativeTransportEvent[];
  readonly state: NativeTransportSnapshot;
  enqueue: (options: NativeTransportPlan) => string;
  snapshot: () => NativeTransportSnapshot;
  waitFor: (
    predicate: (state: NativeTransportSnapshot) => boolean,
  ) => Promise<NativeTransportSnapshot>;
  runCase: <T>(alias: string, fn: () => Promise<T>) => Promise<T>;
  close: () => Promise<void>;
}

const selectedFile = 'src/suite/cabloy-mcp/modules/cabloy-mcp/qualification/transport.test.ts';
const methods = ['POST', 'GET', 'DELETE'] as const;
const modes = new Set([
  'json',
  'sse',
  'hold',
  'throw',
  'postcommit',
  'large-json',
  'large-sse',
  'cleanup-hold',
]);
const ceilings = Object.freeze({
  sockets: 4,
  active: 2,
  headerMs: 2000,
  executionMs: 5000,
  cleanupMs: 1000,
  caseMs: 15000,
  suiteMs: 120000,
  hardExitMs: 1000,
  events: 512,
  eventBytes: 512,
  retainedBytes: 256 * 1024,
});

type Timer = ReturnType<typeof setTimeout>;
interface LiveRun {
  alias: string;
  view: NativeTransportRun;
  req: IncomingMessage;
  res: ServerResponse;
  abort: AbortController;
  owner?: Transport;
  cleanupTimer?: Timer;
  executionTimer?: Timer;
  terminal: Promise<void>;
  unbind: () => void;
}

/** Only this exact, managed, single-file test child may own the failure exit. */
function assertDedicatedChild() {
  const env = app.meta.env;
  let runId: string | undefined;
  try {
    runId = assertTestAppIdentity(env.META_MODE, env.VONA_TEST_RUN_ID, app.name);
  } catch {
    throw new Error('MCP_FIXTURE_TEST_IDENTITY_REQUIRED');
  }
  const runner = process.argv[1]?.replaceAll('\\', '/');
  const exactSelection =
    process.argv[4] === selectedFile &&
    process.argv[3] === 'false' &&
    process.argv.length === 5 &&
    process.argv[2] !== undefined &&
    resolve(process.argv[2], selectedFile) ===
      fileURLToPath(new URL('../../qualification/transport.test.ts', import.meta.url));
  if (
    !app.meta.isTest ||
    env.META_MODE !== 'test' ||
    !runId ||
    process.env.VONA_TEST_RUN_ID !== runId ||
    !runner ||
    !/(?:\/toolsIsolate\/test\.ts|\/dist-toolsIsolate\/test\.js)$/.test(runner) ||
    !exactSelection ||
    process.env.TEST_ONLY === 'true'
  ) {
    throw new Error('MCP_FIXTURE_DEDICATED_CHILD_REQUIRED');
  }
  if (app.config.server.listen.disable !== true || app.server) {
    throw new Error('MCP_FIXTURE_DISABLED_DEFAULT_LISTENER_REQUIRED');
  }
}

function emptyRun(): NativeTransportRun {
  return {
    reserved: false,
    readerSettled: false,
    httpSettled: false,
    adapterSettled: false,
    workSettled: false,
    cleanupSettled: false,
    cancelRequested: false,
    cancelObserved: false,
    executorEntered: false,
    routerEntered: false,
    scopeDisposed: false,
    executorSettled: false,
    released: false,
    finish: false,
    prematureClose: false,
  };
}

/**
 * Test-only native listener. No application/proxy/environment configuration is
 * changed, no system middleware runs, and no raw context escapes its callback.
 */
export async function createNativeTransportFixture(): Promise<NativeTransportFixture> {
  assertDedicatedChild();
  const timers = new Set<Timer>();
  const sockets = new Set<Socket>();
  const headerTimers = new Map<Socket, Timer>();
  const usedSockets = new WeakSet<Socket>();
  const admitted = new WeakSet<IncomingMessage>();
  const byRequest = new WeakMap<IncomingMessage, LiveRun>();
  const live = new Set<LiveRun>();
  const operations = new Set<Promise<void>>();
  const runs = new Map<string, NativeTransportRun>();
  const plans: Array<{ alias: string; options: NativeTransportPlan }> = [];
  const retained: NativeTransportEvent[] = [];
  const ownedMethods: Array<(typeof methods)[number]> = [];
  const waiters = new Set<() => void>();
  const counts = {
    active: 0,
    executorEntries: 0,
    routerEntries: 0,
    scopeDisposed: 0,
    executorSettled: 0,
    released: 0,
    failed: 0,
    finish: 0,
    prematureClose: 0,
    httpOperations: 0,
    httpSettled: 0,
    cancelRequested: 0,
    cancelObserved: 0,
  };
  let admissionOpen = false;
  let closed = false;
  let nextAlias = 0;
  let retainedBytes = 0;
  let evidenceOverflow = false;
  let host = '';
  let port = 0;
  let closePromise: Promise<void> | undefined;
  let serverClosePromise: Promise<void> | undefined;
  let hardExitTimer: Timer | undefined;
  let caseActive = false;
  let activeCaseTimer: Timer | undefined;
  let startupSettled = false;
  let startupPromise: Promise<void> | undefined;
  let shutdownRequested = false;

  function schedule(fn: () => void, ms: number): Timer {
    const timer = setTimeout(() => {
      timers.delete(timer);
      fn();
    }, ms);
    timers.add(timer);
    return timer;
  }
  function clear(timer: Timer | undefined) {
    if (timer === undefined) return;
    clearTimeout(timer);
    timers.delete(timer);
  }
  function notify() {
    for (const waiter of [...waiters]) waiter();
  }
  function event(alias: string, outcome: Outcome, run?: NativeTransportRun, status?: number) {
    // All strings here are fixture-assigned or fixed enums; never spread an SDK event.
    const entry: NativeTransportEvent = Object.freeze({
      sequence: retained.length + 1,
      alias,
      outcome,
      ...(status === undefined ? {} : { status }),
      active: counts.active,
      ...(run === undefined
        ? {}
        : {
            adapterSettled: run.adapterSettled,
            workSettled: run.workSettled,
            cleanupSettled: run.cleanupSettled,
            scopeDisposed: run.scopeDisposed,
            executorSettled: run.executorSettled,
            released: run.released,
          }),
    });
    const bytes = Buffer.byteLength(JSON.stringify(entry), 'utf8');
    if (
      retained.length >= ceilings.events ||
      bytes > ceilings.eventBytes ||
      retainedBytes + bytes > ceilings.retainedBytes
    ) {
      if (!evidenceOverflow) {
        evidenceOverflow = true;
        counts.failed++;
        admissionOpen = false;
        for (const item of live) cancel(item);
        stopListener();
      }
      notify();
      return;
    }
    retained.push(entry);
    retainedBytes += bytes;
    notify();
  }
  function qualifyFailure(alias = 'fixture', outcome: Outcome = 'QUALIFICATION_FAILED') {
    counts.failed++;
    admissionOpen = false;
    event(alias, outcome);
    stopListener();
    for (const item of live) cancel(item);
  }
  function sync(run: LiveRun) {
    const state = run.owner?.state;
    if (!state) return;
    for (const [key, outcome] of [
      ['adapterSettled', 'ADAPTER_SETTLED'],
      ['workSettled', 'WORK_SETTLED'],
      ['cleanupSettled', 'CLEANUP_SETTLED'],
      ['cancelObserved', 'CANCEL_OBSERVED'],
    ] as const) {
      if (state[key] && !run.view[key]) {
        run.view[key] = true;
        if (key === 'cancelObserved') counts.cancelObserved++;
        event(run.alias, outcome, run.view);
      }
    }
    if (state.cleanupSettled) {
      clear(run.cleanupTimer);
      run.cleanupTimer = undefined;
    } else if (state.workSettled || run.view.cancelRequested) {
      watchCleanup(run);
    }
  }
  function watchCleanup(run: LiveRun) {
    if (!run.owner || run.cleanupTimer || run.owner.state.cleanupSettled) return;
    run.cleanupTimer = schedule(() => {
      // Expiry never manufactures settlement, disposal, or a free slot.
      if (!run.owner?.state.cleanupSettled) qualifyFailure(run.alias, 'CLEANUP_DEADLINE');
    }, ceilings.cleanupMs);
  }
  function cancel(run: LiveRun) {
    if (run.view.cancelRequested) return;
    run.view.cancelRequested = true;
    counts.cancelRequested++;
    event(run.alias, 'CANCEL_REQUESTED', run.view);
    run.abort.abort();
    try {
      run.owner?.cancel();
    } catch {
      counts.failed++;
      admissionOpen = false;
      stopListener();
    }
    watchCleanup(run);
  }
  function snapshot(): NativeTransportSnapshot {
    for (const item of live) sync(item);
    return {
      ...counts,
      admissionOpen,
      closed,
      runs: Object.fromEntries(Array.from(runs, ([alias, view]) => [alias, { ...view }])),
    };
  }
  function deny(res: ServerResponse, status: number, allow?: string) {
    if (res.destroyed || res.writableEnded) return;
    if (res.headersSent) {
      res.destroy();
      return;
    }
    res.shouldKeepAlive = false;
    res.statusCode = status;
    res.setHeader('Connection', 'close');
    res.setHeader('Content-Length', '0');
    if (allow === 'POST') res.setHeader('Allow', 'POST');
    res.end();
  }
  function pureFailure(run: LiveRun, error: unknown) {
    // Safe even when on-finished invokes this after ALS disposal.
    try {
      if (run.owner) {
        if (error instanceof FixtureTransportError) run.owner.fail(error.status, error.code);
        else run.owner.fail(500, -32603);
      } else if (error instanceof FixtureTransportError) {
        if (error.status === 413 || error.status === 408 || error.code === undefined) {
          deny(run.res, error.status);
        } else {
          writeFixtureFailure(run.res, error.status, error.code);
        }
      } else {
        deny(run.res, 500);
      }
    } catch {
      run.res.destroy();
      qualifyFailure(run.alias);
    }
  }

  // Installed before even constructing the listener. Exit is permitted only by
  // assertDedicatedChild, never by a shared suite, arbitrary PID or signal.
  function watchdog(alias: string, outcome: 'CASE_DEADLINE' | 'SUITE_DEADLINE') {
    process.exitCode = 1;
    qualifyFailure(alias, outcome);
    if (!hardExitTimer) {
      hardExitTimer = schedule(() => {
        if (
          !startupSettled ||
          !closed ||
          caseActive ||
          counts.active !== 0 ||
          operations.size !== 0
        ) {
          process.stderr.write('MCP_FIXTURE_OWNED_CHILD_WATCHDOG\n');
          process.exit(1);
        }
      }, ceilings.hardExitMs);
    }
    void close().catch(() => {});
  }
  const suiteTimer = schedule(() => watchdog('suite', 'SUITE_DEADLINE'), ceilings.suiteMs);
  let server: ReturnType<typeof createServer>;
  try {
    server = createServer({
      maxHeaderSize: fixtureIngressLimits.headerBytes,
      headersTimeout: ceilings.headerMs,
      requestTimeout: ceilings.headerMs,
      keepAliveTimeout: 0,
      connectionsCheckingInterval: 100,
    });
  } catch {
    // Construction is synchronous: no startup work or server was acquired.
    startupSettled = true;
    for (const timer of [...timers]) clear(timer);
    throw new Error('MCP_FIXTURE_LISTENER_CONSTRUCTION_FAILED');
  }
  // Zero disables Node's lossy field-count truncation; rawHeaders is checked.
  server.maxHeadersCount = 0;
  server.maxRequestsPerSocket = 1;

  function stopListener() {
    shutdownRequested = true;
    if (serverClosePromise) return;
    serverClosePromise = new Promise<void>(resolveClosed => {
      server.close(() => resolveClosed());
    });
    // Partial-header sockets have no request owner to receive cancellation.
    for (const socket of sockets) {
      if (!usedSockets.has(socket)) socket.destroy();
    }
  }
  function clearHeaderTimer(socket: Socket) {
    clear(headerTimers.get(socket));
    headerTimers.delete(socket);
  }
  server.on('connection', socket => {
    if (!admissionOpen || sockets.size >= ceilings.sockets) {
      event('ingress', 'CONNECTION_DENIED');
      socket.destroy();
      return;
    }
    sockets.add(socket);
    socket.once('close', () => {
      clearHeaderTimer(socket);
      sockets.delete(socket);
    });
    headerTimers.set(
      socket,
      schedule(() => {
        headerTimers.delete(socket);
        event('ingress', 'HEADER_TIMEOUT', undefined, 408);
        socket.destroy();
      }, ceilings.headerMs),
    );
  });
  server.on('clientError', (error: NodeJS.ErrnoException, socket) => {
    if (!(socket instanceof Socket)) {
      socket.destroy();
      return;
    }
    clearHeaderTimer(socket);
    const status = error.code === 'HPE_HEADER_OVERFLOW' ? 431 : 400;
    event('ingress', 'PARSER_DENIED', undefined, status);
    if (socket.writable && !socket.destroyed && !usedSockets.has(socket)) {
      usedSockets.add(socket);
      socket.end(
        `HTTP/1.1 ${status} ${status === 431 ? 'Request Header Fields Too Large' : 'Bad Request'}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
      );
      // No parser-controlled payload or diagnostic is reflected or logged.
      schedule(() => socket.destroy(), ceilings.hardExitMs);
    } else {
      socket.destroy();
    }
  });
  server.on('error', () => qualifyFailure());

  async function operate(run: LiveRun, options: NativeTransportPlan) {
    let body: Awaited<ReturnType<typeof readFixtureBody>>;
    try {
      try {
        body = await readFixtureBody(run.req, run.abort.signal);
      } finally {
        run.view.readerSettled = true;
        event(run.alias, 'READER_SETTLED', run.view);
      }
      if (run.abort.signal.aborted) return;
      run.owner = createFixtureTransport(run.req, run.res, body, {
        ...options,
        signal: run.abort.signal,
        event: fixedEnum => {
          if (fixedEnum === 'cleanup_started') watchCleanup(run);
          if (fixedEnum === 'cleanup_timeout') qualifyFailure(run.alias, 'CLEANUP_DEADLINE');
          sync(run);
          if (fixedEnum === 'sdk_error' || fixedEnum === 'output_rejected') {
            event(run.alias, 'TRANSPORT_EVENT', run.view);
          }
        },
      });
      let callbackFailed = false;
      try {
        await app.bean.executor.newCtx(
          async () => {
            run.view.executorEntered = true;
            counts.executorEntries++;
            event(run.alias, 'EXECUTOR_ENTERED', run.view);
            const ctx = app.ctx;
            // The existing container record is the runtime-supported disposal path.
            // The probe is fixture-local, uniquely keyed, bounded and nonthrowing.
            const instances = (
              ctx.bean as unknown as {
                [SymbolBeanContainerInstances]: Record<string, unknown>;
              }
            )[SymbolBeanContainerInstances];
            const key = `__nativeTransportFixture:${run.alias}`;
            instances[key] = {
              __dispose__() {
                if (!run.view.scopeDisposed) {
                  run.view.scopeDisposed = true;
                  counts.scopeDisposed++;
                  event(run.alias, 'SCOPE_DISPOSED', run.view);
                }
              },
            };
            ctx.respond = false;
            ctx.onerror = (error: unknown) => {
              if (error) pureFailure(run, error);
            };
            // Koa exposes this at runtime but not in its public TypeScript API.
            const koa = app as unknown as {
              handleRequest: (
                ctx: VonaContext,
                middleware: (context: VonaContext) => Promise<unknown>,
              ) => Promise<void>;
            };
            try {
              await koa.handleRequest(ctx, app[SymbolRouterMiddleware]);
            } catch (error) {
              callbackFailed = true;
              pureFailure(run, error);
            } finally {
              await run.owner!.close();
              sync(run);
            }
          },
          { instanceName: null, innerAccess: false, req: run.req, res: run.res },
        );
      } catch (error) {
        // This boundary also contains commitsDone and ALS/container disposal.
        pureFailure(run, error);
        if (!callbackFailed || !run.view.scopeDisposed) qualifyFailure(run.alias);
      } finally {
        run.view.executorSettled = true;
        counts.executorSettled++;
        sync(run);
        event(run.alias, 'EXECUTOR_SETTLED', run.view);
        if (run.view.executorEntered && !run.view.scopeDisposed) qualifyFailure(run.alias);
      }
    } catch (error) {
      pureFailure(run, error);
      if (!(error instanceof FixtureTransportError) && !run.abort.signal.aborted)
        qualifyFailure(run.alias);
    } finally {
      // Covers construction/reader failures as well as the ordinary router path.
      // close is idempotent and is awaited; no timeout race releases this owner.
      if (run.owner) {
        try {
          await run.owner.close();
        } catch {
          qualifyFailure(run.alias);
        }
        sync(run);
        if (!run.view.adapterSettled || !run.view.workSettled || !run.view.cleanupSettled)
          qualifyFailure(run.alias);
      }
      clear(run.cleanupTimer);
      if (!run.res.destroyed && !run.res.writableEnded)
        deny(run.res, run.abort.signal.aborted ? 504 : 500);
      // end() only schedules delivery. Keep the reservation and execution
      // deadline until an actual native finish or close has been observed.
      await run.terminal;
      clear(run.executionTimer);
      run.unbind();
      admitted.delete(run.req);
      byRequest.delete(run.req);
    }
  }

  const rawHandler = async function (req: IncomingMessage, res: ServerResponse) {
    const run = byRequest.get(req);
    if (!admitted.has(req) || !run?.owner) {
      deny(res, 403);
      return;
    }
    run.view.routerEntered = true;
    counts.routerEntries++;
    event(run.alias, 'ROUTER_ENTERED', run.view);
    await run.owner.run();
  };

  function ownDeniedHttp(req: IncomingMessage, res: ServerResponse) {
    let done!: () => void;
    const terminal = new Promise<void>(resolveTerminal => {
      done = resolveTerminal;
    });
    let finished = false;
    const finish = () => {
      finished = true;
      counts.finish++;
      event('ingress', 'FINISH');
      done();
    };
    const closeTerminal = () => {
      if (!finished) {
        counts.prematureClose++;
        event('ingress', 'PREMATURE_CLOSE');
      }
      done();
    };
    const error = () => {
      res.destroy();
    };
    const timer = schedule(() => res.destroy(), ceilings.headerMs);
    res.once('finish', finish);
    res.once('close', closeTerminal);
    res.on('error', error);
    // A rejected body is never drained or buffered by the fixture.
    req.pause();
    const operation = terminal.finally(() => {
      clear(timer);
      res.off('finish', finish);
      res.off('close', closeTerminal);
      res.off('error', error);
      counts.httpSettled++;
      operations.delete(operation);
      notify();
    });
    operations.add(operation);
  }

  let instanceHeaders: readonly string[] = [];
  server.on('request', (req, res) => {
    clearHeaderTimer(req.socket);
    counts.httpOperations++;
    res.shouldKeepAlive = false;
    const reused = usedSockets.has(req.socket);
    usedSockets.add(req.socket);
    const denial = checkFixtureIngress({
      peer: req.socket.remoteAddress,
      host,
      rawHeaders: req.rawHeaders,
      target: req.url,
      method: req.method,
      instanceHeaders,
    });
    if (!admissionOpen || reused || denial) {
      const status = denial?.status ?? (reused ? 400 : 503);
      event('ingress', 'INGRESS_DENIED', undefined, status);
      ownDeniedHttp(req, res);
      deny(res, status, denial?.allow);
      return;
    }
    if (counts.active >= ceilings.active) {
      event('ingress', 'CAPACITY_DENIED', undefined, 429);
      ownDeniedHttp(req, res);
      deny(res, 429);
      return;
    }
    // Only an admitted reservation consumes the test-owned FIFO plan.
    const plan = plans.shift();
    if (!plan) {
      ownDeniedHttp(req, res);
      deny(res, 503);
      qualifyFailure();
      return;
    }
    const view = runs.get(plan.alias)!;
    let terminalSettled!: () => void;
    const terminal = new Promise<void>(resolveTerminal => {
      terminalSettled = resolveTerminal;
    });
    const run: LiveRun = {
      alias: plan.alias,
      view,
      req,
      res,
      abort: new AbortController(),
      terminal,
      unbind() {},
    };
    view.reserved = true;
    counts.active++;
    live.add(run);
    admitted.add(req);
    byRequest.set(req, run);
    const onAbort = () => cancel(run);
    const onError = () => {
      cancel(run);
      res.destroy();
    };
    const onFinish = () => {
      if (!view.finish) {
        view.finish = true;
        counts.finish++;
        event(run.alias, 'FINISH', view);
      }
      terminalSettled();
    };
    const onClose = () => {
      if (!view.finish && !view.prematureClose) {
        view.prematureClose = true;
        counts.prematureClose++;
        event(run.alias, 'PREMATURE_CLOSE', view);
        cancel(run);
      }
      terminalSettled();
    };
    req.once('aborted', onAbort);
    req.on('error', onError);
    res.once('finish', onFinish);
    res.once('close', onClose);
    res.on('error', onError);
    run.unbind = () => {
      req.off('aborted', onAbort);
      req.off('error', onError);
      res.off('finish', onFinish);
      res.off('close', onClose);
      res.off('error', onError);
    };
    run.executionTimer = schedule(() => {
      event(run.alias, 'EXECUTION_DEADLINE', view, 504);
      deny(res, 504);
      cancel(run);
      if (res.writableEnded && !view.finish) res.destroy();
    }, ceilings.executionMs);
    event(run.alias, 'RESERVED', view);
    const operation = operate(run, plan.options)
      .catch(() => {
        qualifyFailure(run.alias);
      })
      .finally(() => {
        // operate has awaited the complete executor promise, not just the adapter.
        view.httpSettled = true;
        counts.httpSettled++;
        event(run.alias, 'HTTP_SETTLED', view);
        operations.delete(operation);
        const scopeSettled = !view.executorEntered || (view.executorSettled && view.scopeDisposed);
        const transportSettled =
          !run.owner || (view.adapterSettled && view.workSettled && view.cleanupSettled);
        if (view.readerSettled && scopeSettled && transportSettled) {
          live.delete(run);
          counts.active--;
          view.released = true;
          counts.released++;
          event(run.alias, 'RELEASED', view);
        } else {
          // A failed disposer/owner is not repaired by a fulfilled outer catch.
          // Preserve the reservation and let the owned-child watchdog fail it.
          qualifyFailure(run.alias);
        }
      });
    operations.add(operation);
  });
  // Node emits these instead of request for Expect traffic. Never send 100 or
  // admit a second body path: it is unsupported framing in this direct fixture.
  const denyExpectation = (req: IncomingMessage, res: ServerResponse) => {
    clearHeaderTimer(req.socket);
    usedSockets.add(req.socket);
    counts.httpOperations++;
    ownDeniedHttp(req, res);
    event('ingress', 'INGRESS_DENIED', undefined, 400);
    deny(res, 400);
  };
  server.on('checkContinue', denyExpectation);
  server.on('checkExpectation', denyExpectation);

  async function unregister() {
    await app.bean.executor.mockCtx(
      async () => {
        for (const method of ownedMethods.splice(0).reverse()) {
          // Do not remove a route that somebody replaced after fixture setup.
          const route = app.bean.router.findByPath(method, 'cabloy-mcp', '//mcp', true);
          if (route?.handler !== rawHandler) {
            qualifyFailure();
            continue;
          }
          app.bean.router.unRegister(method, 'cabloy-mcp', '//mcp', true);
        }
      },
      { instanceName: null, innerAccess: false },
    );
  }
  function close(): Promise<void> {
    return (closePromise ??= (async () => {
      admissionOpen = false;
      stopListener();
      for (const run of live) cancel(run);
      try {
        // Setup can still be inside mockCtx when the pre-listener watchdog
        // fires. Await its real settlement before unregistering owned routes.
        await startupPromise;
        // No work can be added once admission is closed. Await actual owners.
        await Promise.allSettled([...operations]);
      } finally {
        for (const socket of sockets) socket.destroy();
        try {
          await serverClosePromise;
        } finally {
          try {
            await unregister();
          } catch {
            counts.failed++;
          } finally {
            for (const timer of [...timers]) {
              // A case callback still live after cooperative closure must not
              // cancel the dedicated child's final hard-exit enforcement.
              if (
                (caseActive && (timer === hardExitTimer || timer === activeCaseTimer)) ||
                ((!startupSettled || counts.active !== 0 || operations.size !== 0) &&
                  (timer === hardExitTimer || timer === suiteTimer))
              ) {
                continue;
              }
              clear(timer);
            }
            headerTimers.clear();
            plans.length = 0;
            closed = true;
            event('fixture', 'CLOSED');
            notify();
          }
        }
      }
      if (counts.active !== 0 || counts.failed !== 0)
        throw new Error('MCP_FIXTURE_QUALIFICATION_FAILED');
    })());
  }

  startupPromise = (async () => {
    try {
      await app.bean.executor.mockCtx(
        async () => {
          if (shutdownRequested) throw new Error('MCP_FIXTURE_STARTUP_STOPPED');
          for (const method of methods) {
            if (app.bean.router.findByPath(method, 'cabloy-mcp', '//mcp', true))
              throw new Error('MCP_FIXTURE_ROUTE_ALREADY_PRESENT');
          }
          const header = app.config.instance.headerField;
          instanceHeaders = Object.freeze(typeof header === 'string' ? [header] : []);
          for (const method of methods) {
            app.bean.router.register(method, 'cabloy-mcp', '//mcp', true, rawHandler);
            ownedMethods.push(method);
          }
        },
        { instanceName: null, innerAccess: false },
      );
      if (shutdownRequested) throw new Error('MCP_FIXTURE_STARTUP_STOPPED');
      await new Promise<void>((resolveListening, rejectListening) => {
        const onError = () => rejectListening(new Error('MCP_FIXTURE_LISTENER_START_FAILED'));
        server.once('error', onError);
        server.listen(0, '127.0.0.1', () => {
          server.off('error', onError);
          if (shutdownRequested) {
            // close() may have run while Node was allocating the listener. A
            // late listening callback never reopens admission or leaves it live.
            serverClosePromise = new Promise<void>(resolveClosed => {
              server.close(() => resolveClosed());
            });
            rejectListening(new Error('MCP_FIXTURE_STARTUP_STOPPED'));
            return;
          }
          resolveListening();
        });
      });
      if (shutdownRequested) throw new Error('MCP_FIXTURE_STARTUP_STOPPED');
      const address = server.address();
      if (
        !address ||
        typeof address === 'string' ||
        address.address !== '127.0.0.1' ||
        address.port === 0
      ) {
        throw new Error('MCP_FIXTURE_LOOPBACK_REQUIRED');
      }
      port = address.port;
      host = `127.0.0.1:${port}`;
      admissionOpen = true;
    } finally {
      // This is actual startup settlement, not a timeout/cancellation marker.
      startupSettled = true;
    }
  })();
  try {
    await startupPromise;
  } catch {
    await close().catch(() => {});
    throw new Error('MCP_FIXTURE_STARTUP_FAILED');
  }

  // Observes the real owner's flags; polling does not settle or detach its work.
  const tick = () => {
    for (const run of live) sync(run);
    notify();
    if (!closed) schedule(tick, 5);
  };
  schedule(tick, 5);

  return {
    port,
    host,
    origin: `http://${host}`,
    get events() {
      return retained.slice();
    },
    get state() {
      return snapshot();
    },
    snapshot,
    enqueue(options) {
      if (!admissionOpen || !modes.has(options.mode) || runs.size >= ceilings.events) {
        throw new Error('MCP_FIXTURE_PLAN_REJECTED');
      }
      const alias = `case-${++nextAlias}`;
      runs.set(alias, emptyRun());
      plans.push({
        alias,
        options: {
          mode: options.mode,
          workBarrier: options.workBarrier,
          cleanupBarrier: options.cleanupBarrier,
        },
      });
      return alias;
    },
    waitFor(predicate) {
      return new Promise<NativeTransportSnapshot>((resolveWait, rejectWait) => {
        let settled = false;
        let timer: Timer | undefined;
        const check = () => {
          if (settled) return;
          try {
            const state = snapshot();
            if (predicate(state)) {
              settled = true;
              waiters.delete(check);
              clear(timer);
              resolveWait(state);
            } else if (closed) {
              settled = true;
              waiters.delete(check);
              clear(timer);
              rejectWait(new Error('MCP_FIXTURE_WAIT_CLOSED'));
            }
          } catch {
            settled = true;
            waiters.delete(check);
            clear(timer);
            rejectWait(new Error('MCP_FIXTURE_WAIT_PREDICATE_FAILED'));
          }
        };
        waiters.add(check);
        timer = schedule(() => {
          if (settled) return;
          settled = true;
          waiters.delete(check);
          rejectWait(new Error('MCP_FIXTURE_WAIT_TIMEOUT'));
        }, ceilings.caseMs);
        check();
      });
    },
    async runCase<T>(alias: string, fn: () => Promise<T>): Promise<T> {
      if (!/^[\x20-\x7E]{1,64}$/.test(alias) || caseActive || closed)
        throw new Error('MCP_FIXTURE_CASE_REJECTED');
      caseActive = true;
      let expired = false;
      const timer = schedule(() => {
        expired = true;
        watchdog(alias, 'CASE_DEADLINE');
      }, ceilings.caseMs);
      activeCaseTimer = timer;
      try {
        const value = await fn();
        if (expired) throw new Error('MCP_FIXTURE_CASE_DEADLINE');
        return value;
      } finally {
        caseActive = false;
        activeCaseTimer = undefined;
        clear(timer);
        if (startupSettled && closed && counts.active === 0 && operations.size === 0)
          clear(hardExitTimer);
      }
    },
    close,
  };
}
