import type { IncomingMessage, ServerResponse } from 'node:http';

// Explicit wiring only: no route, bean, SDK, body reader or listener registration.
export const productionOwnerLimits = Object.freeze({
  reservations: 2,
  executionMs: 5_000,
  cleanupMs: 1_000,
});

export type ProductionBinding =
  | { outcome: 'admitted'; instanceName: string }
  | { outcome: 'denied' | 'missing' | 'ambiguous' | 'unavailable' };

export interface ProductionOwnerContext {
  respond?: boolean;
  onerror(error: unknown): void;
}

export interface ProductionExecutorOptions {
  instanceName: string;
  innerAccess: false;
  dbInfo: { level: 0 };
  req: IncomingMessage;
  res: ServerResponse;
}

export interface ProductionOwnerPorts<C extends ProductionOwnerContext> {
  binding: (signal: AbortSignal) => Promise<ProductionBinding | undefined>;
  // The integration must observe normal scope disposal independently of rejection.
  execute: (
    callback: (ctx: C) => Promise<void>,
    options: ProductionExecutorOptions,
    scopeDisposed: () => void,
  ) => Promise<void>;
  work: (ctx: C, signal: AbortSignal) => Promise<void>;
  cleanup: (signal: AbortSignal) => Promise<void>;
}

export interface ProductionRequestState {
  status: number;
  providerCalls: number;
  executorCalls: number;
  callbackCalls: number;
  cancelled: boolean;
  providerSettled: boolean;
  workSettled: boolean;
  cleanupSettled: boolean;
  scopeDisposed: boolean;
  executorSettled: boolean;
  terminal: boolean;
  released: boolean;
  fault: boolean;
}

export function createProductionRequestOwner(limits: typeof productionOwnerLimits) {
  let healthy =
    limits?.reservations === 2 && limits?.executionMs === 5_000 && limits?.cleanupMs === 1_000;
  let open = healthy;
  let active = 0;
  let reservations = 0;
  let releases = 0;
  const cancellations = new Set<() => void>();

  function unhealthy() {
    healthy = false;
    open = false;
    for (const cancel of cancellations) cancel();
  }

  async function run<C extends ProductionOwnerContext>(
    req: IncomingMessage,
    res: ServerResponse,
    ports: ProductionOwnerPorts<C>,
  ): Promise<Readonly<ProductionRequestState>> {
    const state: ProductionRequestState = {
      status: 0,
      providerCalls: 0,
      executorCalls: 0,
      callbackCalls: 0,
      cancelled: false,
      providerSettled: false,
      workSettled: false,
      cleanupSettled: false,
      scopeDisposed: false,
      executorSettled: false,
      terminal: res.writableFinished || res.destroyed,
      released: false,
      fault: false,
    };
    let terminalResolve: () => void;
    const terminal = new Promise<void>(resolve => {
      terminalResolve = resolve;
    });
    if (state.terminal) terminalResolve!();
    const abort = new AbortController();
    let cleanupTimer: ReturnType<typeof setTimeout> | undefined;
    let executionTimer: ReturnType<typeof setTimeout> | undefined;
    let reserved = false;
    let failed = false;
    let completed = false;
    let callbackDone: Promise<void> | undefined;

    function observeCleanup() {
      if (!cleanupTimer) {
        cleanupTimer = setTimeout(() => {
          state.fault = true;
          unhealthy();
          fail(500);
        }, productionOwnerLimits.cleanupMs);
      }
    }
    function cancel() {
      if (state.cancelled) return;
      state.cancelled = true;
      abort.abort();
      if (reserved) observeCleanup();
    }
    function fail(status: number) {
      if (completed) return;
      cancel();
      if (failed) return;
      failed = true;
      state.status = status;
      try {
        if (!res.headersSent && !res.writableEnded && !res.destroyed && !state.terminal) {
          res.statusCode = status;
          res.end();
        } else if (!state.terminal && !res.destroyed) {
          res.destroy();
        }
      } catch {
        state.fault = true;
        unhealthy();
        try {
          res.destroy();
        } catch {
          /* No raw exception sink. */
        }
      }
    }
    function finish() {
      state.terminal = true;
      terminalResolve();
    }
    function close() {
      finish();
      if (!res.writableFinished) cancel();
    }
    function disconnect() {
      cancel();
      fail(503);
    }
    function responseError() {
      fail(500);
    }
    res.once('finish', finish);
    res.once('close', close);
    res.on('error', responseError);
    req.once('aborted', disconnect);

    try {
      if (!open || !healthy) {
        fail(503);
        await terminal;
        return Object.freeze({ ...state });
      }
      if (active >= productionOwnerLimits.reservations) {
        fail(429);
        await terminal;
        return Object.freeze({ ...state });
      }
      reserved = true;
      active++;
      reservations++;
      cancellations.add(cancel);
      executionTimer = setTimeout(fail, productionOwnerLimits.executionMs, 504);
      if (req.aborted || state.terminal) cancel();
      if (!state.cancelled) {
        let binding: ProductionBinding | undefined;
        state.providerCalls++;
        try {
          binding = await ports.binding(abort.signal);
        } catch {
          fail(500);
        } finally {
          state.providerSettled = true;
        }
        if (!state.cancelled) {
          if (binding?.outcome === 'denied') {
            fail(403);
          } else if (binding?.outcome !== 'admitted' || typeof binding.instanceName !== 'string') {
            fail(503);
          } else {
            state.executorCalls++;
            try {
              await ports.execute(
                ctx => {
                  state.callbackCalls++;
                  if (state.callbackCalls !== 1) {
                    state.fault = true;
                    unhealthy();
                    fail(500);
                    return Promise.resolve();
                  }
                  callbackDone = (async () => {
                    try {
                      ctx.respond = false;
                      ctx.onerror = responseError;
                      if (!state.cancelled) await ports.work(ctx, abort.signal);
                    } catch {
                      fail(500);
                    } finally {
                      state.workSettled = true;
                      observeCleanup();
                      try {
                        await ports.cleanup(abort.signal);
                        state.cleanupSettled = true;
                      } catch {
                        state.fault = true;
                        unhealthy();
                        fail(500);
                      }
                    }
                  })();
                  return callbackDone;
                },
                {
                  instanceName: binding.instanceName,
                  innerAccess: false,
                  dbInfo: { level: 0 },
                  req,
                  res,
                },
                () => {
                  state.scopeDisposed = true;
                },
              );
            } catch {
              // Rejection alone never proves scope cleanup or permits slot reuse.
              state.fault = true;
              unhealthy();
              fail(500);
            } finally {
              state.executorSettled = true;
              await callbackDone;
            }
            if (!state.scopeDisposed || state.callbackCalls !== 1 || !state.cleanupSettled) {
              state.fault = true;
              unhealthy();
              fail(500);
            }
          }
        }
      }
      if (!state.executorCalls) {
        state.providerSettled = true;
        state.workSettled = true;
        state.cleanupSettled = true;
      }
      if (cleanupTimer) {
        clearTimeout(cleanupTimer);
        cleanupTimer = undefined;
      }
      await terminal;
      if (
        !state.fault &&
        state.providerSettled &&
        state.workSettled &&
        state.cleanupSettled &&
        (!state.executorCalls || (state.executorSettled && state.scopeDisposed))
      ) {
        active--;
        releases++;
        state.released = true;
      }
      return Object.freeze({ ...state });
    } finally {
      completed = true;
      if (executionTimer) clearTimeout(executionTimer);
      if (cleanupTimer) clearTimeout(cleanupTimer);
      cancellations.delete(cancel);
      req.off('aborted', disconnect);
      res.off('finish', finish);
      res.off('close', close);
      res.off('error', responseError);
    }
  }

  return {
    run,
    close() {
      open = false;
      for (const cancel of cancellations) cancel();
    },
    snapshot() {
      return Object.freeze({ healthy, open, active, reservations, releases });
    },
  };
}
