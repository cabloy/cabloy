import type { VonaApplication, VonaContext } from 'vona';

import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { setImmediate as nextTurn } from 'node:timers/promises';
import {
  createDiagnosticLogger,
  formatLoggerBoundary,
  formatLoggerConsole,
  formatLoggerErrors,
  formatLoggerFilter,
} from 'vona';
import * as Winston from 'winston';
import Transport from 'winston-transport';

import type { ServiceTelemetry } from '../../../../../a-vona/modules/a-telemetry/src/service/telemetry.ts';

import { VonaAsyncLocalStorage } from '../../../../../../../packages-vona/vona-core/src/lib/core/asyncLocalStorage.ts';
import { BeanExecutor } from '../../../../../a-vona/modules/a-executor/src/bean/bean.executor.ts';
import { ServiceTransactionAsyncLocalStorage } from '../../../../../a-vona/modules/a-orm/src/service/transactionAsyncLocalStorage_.ts';

type Span = ReturnType<ServiceTelemetry['startSpan']>;

export function barrier() {
  let release!: () => void;
  const promise = new Promise<void>(resolve => {
    release = resolve;
  });
  return { promise, release };
}

// Expiry observes a budget violation; it does not settle or release the held work.
export function heldBarrier() {
  const held = barrier();
  let expired = false;
  const timer = setTimeout(() => {
    expired = true;
  }, 5_000);
  return {
    promise: held.promise,
    release() {
      clearTimeout(timer);
      held.release();
    },
    get expired() {
      return expired;
    },
  };
}

// Callers still release and join the original continuation in finally.
export function observe<T>(promise: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('foundation_observation_expired')), 1_000);
    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function turns() {
  await nextTurn();
  await nextTurn();
}

let retainedEvents = 0;
let retainedBytes = 0;
export function projection(
  t: { diagnostic(message: string): void },
  alias:
    | 'capability'
    | 'initializer'
    | 'overlap'
    | 'winston'
    | 'factory'
    | 'http-seam'
    | 'action-seam'
    | 'telemetry'
    | 'healthy-disposal'
    | 'controlled-als'
    | 'late-terminal'
    | 'ordinary',
  counters: Record<string, number | boolean>,
) {
  for (const [key, value] of Object.entries(counters)) {
    assert.match(key, /^[a-z][a-z0-9]{0,63}$/i);
    assert.equal(
      typeof value === 'boolean' || (Number.isSafeInteger(value) && Number(value) >= 0),
      true,
    );
  }
  const event = JSON.stringify({ alias, ...counters });
  const bytes = Buffer.byteLength(event);
  assert.equal(
    alias.length <= 64 &&
      bytes <= 512 &&
      retainedEvents < 512 &&
      retainedBytes + bytes <= 256 * 1024,
    true,
    'projection_budget',
  );
  retainedEvents++;
  retainedBytes += bytes;
  t.diagnostic(event);
}

export async function rejectsIdentity(promise: Promise<unknown>, expected: unknown) {
  await assert.rejects(promise, error => error === expected);
}

export function getterProbe() {
  const counts = { reads: 0, lazy: 0, sql: 0, string: 0 };
  const read = () => {
    counts.reads++;
    return 'local';
  };
  const payload: Record<PropertyKey, any> = {};
  for (const key of [
    'message',
    'stack',
    'cause',
    'name',
    'isAxiosError',
    'config',
    'request',
    'response',
    'context',
    'metadata',
    'level',
  ]) {
    Object.defineProperty(payload, key, { enumerable: true, get: read });
  }
  Object.defineProperty(payload, Symbol.toPrimitive, {
    value() {
      counts.string++;
      return 'local';
    },
  });
  const error = new Error();
  for (const key of ['stack', 'message', 'cause']) {
    Object.defineProperty(error, key, { configurable: true, enumerable: true, get: read });
  }
  const axios = Object.create(error);
  Object.defineProperty(axios, 'isAxiosError', {
    enumerable: true,
    get() {
      counts.reads++;
      return true;
    },
  });
  Object.defineProperty(axios, 'config', {
    enumerable: true,
    get() {
      counts.reads++;
      return { url: 'local' };
    },
  });
  const sql = {
    toQuery() {
      counts.sql++;
      return 'local';
    },
  };
  const lazy = () => {
    counts.lazy++;
    return sql.toQuery();
  };
  return { counts, payload, error, axios, lazy };
}

export function spanFixture(throwEnd = false) {
  const counts = { exception: 0, status: 0, attribute: 0, end: 0, name: 0 };
  const span = {
    recordException() {
      counts.exception++;
      return span;
    },
    setStatus() {
      counts.status++;
      return span;
    },
    setAttribute() {
      counts.attribute++;
      return span;
    },
    setAttributes() {
      counts.attribute++;
      return span;
    },
    updateName() {
      counts.name++;
      return span;
    },
    end() {
      counts.end++;
      if (throwEnd) throw new Error();
    },
    isRecording() {
      return true;
    },
    spanContext() {
      return { traceId: '0'.repeat(32), spanId: '0'.repeat(16), traceFlags: 0 };
    },
    addEvent() {
      return span;
    },
    addLink() {
      return span;
    },
    addLinks() {
      return span;
    },
  } as unknown as Span;
  return { span, counts };
}

export class LocalResponse extends EventEmitter {
  statusCode = 200;
  writableEnded = true;
}

class MemoryTransport extends Transport {
  count = 0;
  override log(_info: unknown, callback: () => void) {
    this.count++;
    callback();
  }
}

export function memoryLogger() {
  const levels = ['error', 'warn', 'http'] as const;
  const sinks = levels.map(
    level =>
      new MemoryTransport({
        level: 'silly',
        format: Winston.format.combine(
          formatLoggerBoundary(),
          formatLoggerErrors({ stack: true, cause: true }),
          formatLoggerFilter({ level, strict: true } as any),
          Winston.format.json(),
        ),
      }),
  );
  sinks.push(
    new MemoryTransport({
      level: 'silly',
      format: Winston.format.combine(
        formatLoggerBoundary(),
        formatLoggerErrors({ stack: true, cause: true }),
        formatLoggerFilter({ level: 'silly' } as any),
        Winston.format.splat(),
        Winston.format.timestamp(),
        formatLoggerConsole({ clientName: 'default' } as any),
      ),
    }),
  );
  const raw = Winston.createLogger({
    level: 'silly',
    format: formatLoggerBoundary(),
    transports: sinks,
  });
  const logger = createDiagnosticLogger(raw);
  return {
    raw,
    logger,
    sinks,
    counts() {
      return sinks.map(sink => sink.count);
    },
    async close() {
      try {
        await new Promise<void>(resolve => {
          raw.end(resolve);
        });
      } finally {
        raw.close();
        for (const sink of sinks) sink.close?.();
      }
    },
  };
}

// Only context ALS is real here; transaction run is a passthrough collaborator.
// This fixture makes no transaction-isolation claim and creates no second VonaApplication.
export function controlledScope(options: { failDispose?: boolean; failCreation?: boolean } = {}) {
  const counts = {
    increment: 0,
    decrement: 0,
    dispose: 0,
    remaining: 0,
    setup: 0,
    commits: 0,
    database: 0,
  };
  const creationError = new Error();
  const disposalError = new Error();
  let initialized = false;
  let storage!: VonaAsyncLocalStorage;
  const state: Record<string, any> = { instanceName: null };
  const context: any = {
    state: {},
    request: { headers: {} },
    bean: {
      async dispose() {
        counts.dispose++;
        if (options.failDispose) throw disposalError;
        counts.remaining++;
      },
    },
    async commitsDone() {
      counts.commits++;
    },
  };
  for (const key of ['innerAccess', 'locale', 'tz', 'instanceName']) {
    Object.defineProperty(context, key, {
      get() {
        if (key !== 'instanceName') counts.setup++;
        return state[key];
      },
      set(value) {
        assert.equal(initialized, true, 'initializer_before_setup');
        counts.setup++;
        state[key] = value;
      },
    });
  }
  const app: any = {
    get currentContext() {
      return storage.getStore();
    },
    meta: {
      ctxCounter: {
        increment() {
          counts.increment++;
        },
        decrement() {
          counts.decrement++;
        },
      },
    },
    createAnonymousContext() {
      if (options.failCreation) throw creationError;
      return context;
    },
  };
  storage = new VonaAsyncLocalStorage(app as VonaApplication);
  app.ctxStorage = storage;
  const transactionScope: Pick<ServiceTransactionAsyncLocalStorage, 'run'> = {
    async run(fn, _isolate = false) {
      return fn();
    },
  };
  const executor: any = new BeanExecutor();
  Object.defineProperties(executor, {
    app: { value: app },
    ctx: {
      get() {
        return storage.getStore();
      },
    },
    bean: {
      get() {
        return {
          _getBean(beanClass: typeof ServiceTransactionAsyncLocalStorage) {
            assert.equal(beanClass, ServiceTransactionAsyncLocalStorage);
            return transactionScope;
          },
          database: {
            async switchDb(fn: () => unknown) {
              counts.database++;
              return await fn();
            },
          },
        };
      },
    },
  });
  return {
    storage,
    executor: executor as BeanExecutor,
    context: context as VonaContext,
    counts,
    creationError,
    disposalError,
    initialize() {
      initialized = true;
    },
  };
}
