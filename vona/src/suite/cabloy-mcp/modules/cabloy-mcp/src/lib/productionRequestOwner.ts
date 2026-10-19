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

export type ProductionScopeOutcome = 'not_created' | 'disposed' | 'dispose_failed';

export interface ProductionExecutorLifecycle<C extends ProductionOwnerContext> {
  initializeContext(ctx: C): void;
  onScopeOutcome(outcome: ProductionScopeOutcome): void;
}

export interface ProductionOwnerPorts<C extends ProductionOwnerContext> {
  binding: (signal: AbortSignal) => Promise<ProductionBinding | undefined>;
  // Trusted lifecycle ports, separate from executor options and client input.
  execute: (
    callback: (ctx: C) => Promise<void>,
    options: ProductionExecutorOptions,
    lifecycle: ProductionExecutorLifecycle<C>,
  ) => Promise<void>;
  boundaryFault?: () => boolean;
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
  scopeOutcome: ProductionScopeOutcome | 'pending';
  portFault: boolean;
  executorSettled: boolean;
  terminal: boolean;
  released: boolean;
  fault: boolean;
}

export interface ProductionOwnerDrainReport {
  readonly outcome: 'drained' | 'faulted';
  readonly pendingAdmittedRuns: 0;
  readonly quarantinedReservations: number;
}

export function createProductionRequestOwner(limits: typeof productionOwnerLimits) {
  let healthy =
    limits?.reservations === 2 && limits?.executionMs === 5_000 && limits?.cleanupMs === 1_000;
  let open = healthy;
  let active = 0;
  let reservations = 0;
  let releases = 0;
  let pendingAdmittedRuns = 0;
  let drainPromise: Promise<Readonly<ProductionOwnerDrainReport>> | undefined;
  let drainResolve: ((report: Readonly<ProductionOwnerDrainReport>) => void) | undefined;
  const cancellations = new Set<() => void>();

  function unhealthy() {
    healthy = false;
    open = false;
    for (const cancel of cancellations) cancel();
  }

  function resolveDrain() {
    if (!drainResolve || pendingAdmittedRuns !== 0) return;
    const resolve = drainResolve;
    drainResolve = undefined;
    resolve(
      Object.freeze({
        outcome: healthy && active === 0 ? 'drained' : 'faulted',
        pendingAdmittedRuns: 0,
        quarantinedReservations: active,
      }),
    );
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
      scopeOutcome: 'pending',
      portFault: false,
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
    let initializedContext: C | undefined;

    function portFault() {
      state.portFault = true;
      state.fault = true;
      unhealthy();
      fail(500);
    }
    function checkBoundary() {
      try {
        if (ports.boundaryFault?.()) portFault();
      } catch {
        portFault();
      }
    }
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
        pendingAdmittedRuns++;
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
          checkBoundary();
          if (!state.cancelled) {
            if (binding?.outcome === 'denied') {
              fail(403);
            } else if (
              binding?.outcome !== 'admitted' ||
              typeof binding.instanceName !== 'string'
            ) {
              fail(503);
            } else {
              state.executorCalls++;
              try {
                await ports.execute(
                  ctx => {
                    state.callbackCalls++;
                    if (
                      state.callbackCalls !== 1 ||
                      initializedContext !== ctx ||
                      state.scopeOutcome !== 'pending'
                    ) {
                      portFault();
                      return Promise.resolve();
                    }
                    callbackDone = (async () => {
                      try {
                        checkBoundary();
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
                  {
                    initializeContext(ctx) {
                      if (initializedContext || state.scopeOutcome !== 'pending' || completed) {
                        portFault();
                        throw new Error('Invalid owner context initialization');
                      }
                      initializedContext = ctx;
                      ctx.respond = false;
                      ctx.onerror = responseError;
                    },
                    onScopeOutcome(outcome) {
                      if (
                        completed ||
                        state.scopeOutcome !== 'pending' ||
                        !['not_created', 'disposed', 'dispose_failed'].includes(outcome) ||
                        (outcome === 'not_created' && initializedContext !== undefined)
                      ) {
                        portFault();
                        return;
                      }
                      state.scopeOutcome = outcome;
                      state.scopeDisposed = outcome === 'disposed';
                      if (outcome === 'dispose_failed') {
                        state.fault = true;
                        unhealthy();
                        fail(500);
                      }
                    },
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
              checkBoundary();
              if (state.scopeOutcome === 'pending') portFault();
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
        checkBoundary();
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
    } catch (error) {
      if (reserved) {
        healthy = false;
        open = false;
      }
      throw error;
    } finally {
      // Slot release and cancellation removal precede this complete teardown boundary.
      if (reserved) {
        pendingAdmittedRuns--;
        resolveDrain();
      }
    }
  }

  return {
    run,
    drain(): Promise<Readonly<ProductionOwnerDrainReport>> {
      if (drainPromise) return drainPromise;
      drainPromise = new Promise(resolve => {
        drainResolve = resolve;
      });
      open = false;
      for (const cancel of cancellations) cancel();
      resolveDrain();
      return drainPromise;
    },
    close() {
      open = false;
      for (const cancel of cancellations) cancel();
    },
    snapshot() {
      return Object.freeze({ healthy, open, active, reservations, releases });
    },
  };
}
