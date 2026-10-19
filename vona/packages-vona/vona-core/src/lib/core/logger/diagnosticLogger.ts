import type * as Winston from 'winston';

import { captureRequestBoundary, getRequestBoundary } from '../requestBoundary.ts';

const loggingMethods = new Set([
  'log',
  'error',
  'warn',
  'info',
  'http',
  'verbose',
  'debug',
  'silly',
]);

function completeWrite(args: unknown[]) {
  const callback = typeof args[1] === 'function' ? args[1] : args[2];
  if (typeof callback === 'function') {
    try {
      callback();
    } catch {
      captureRequestBoundary()?.reportFailure('diagnostic_failed');
    }
  }
  return true;
}

const suppressedLogger = createFacade();

export function getSuppressedDiagnosticLogger(): Winston.Logger {
  return suppressedLogger;
}

export function createDiagnosticLogger(raw: Winston.Logger): Winston.Logger {
  if (getRequestBoundary()) return getSuppressedDiagnosticLogger();
  return createFacade(raw);
}

function createFacade(raw?: Winston.Logger): Winston.Logger {
  const methods = new Map<PropertyKey, (...args: any[]) => any>();
  const handlers = new WeakMap<object, Winston.ExceptionHandler | Winston.RejectionHandler>();
  const inertProfiler = Object.freeze({
    get logger() {
      return getSuppressedDiagnosticLogger();
    },
    done: () => getSuppressedDiagnosticLogger(),
  });
  const facade = new Proxy({} as Winston.Logger, {
    get(_target, key) {
      if (
        loggingMethods.has(key as string) ||
        ['write', 'child', 'startTimer', 'profile'].includes(key as string)
      ) {
        if (!methods.has(key)) {
          methods.set(key, (...args: any[]) => {
            if (!raw || getRequestBoundary()) {
              if (key === 'write') return completeWrite(args);
              if (key === 'child') return getSuppressedDiagnosticLogger();
              if (key === 'startTimer') return inertProfiler;
              return facade;
            }
            const result = Reflect.apply(Reflect.get(raw, key, raw), raw, args);
            if (key === 'child') return createFacade(result as Winston.Logger);
            if (key === 'startTimer') return wrapProfiler(result as Winston.Profiler, facade);
            return result === raw ? facade : result;
          });
        }
        return methods.get(key);
      }
      if (!raw) return undefined;
      const value = Reflect.get(raw, key, raw);
      if ((key === 'exceptions' || key === 'rejections') && value) {
        if (!handlers.has(value)) handlers.set(value, wrapHandler(value, raw, facade));
        return handlers.get(value);
      }
      if (typeof value !== 'function') return value;
      if (!methods.has(key)) {
        methods.set(key, (...args: any[]) => {
          const result = Reflect.apply(value, raw, args);
          return result === raw ? facade : result;
        });
      }
      return methods.get(key);
    },
    set(_target, key, value) {
      return raw ? Reflect.set(raw, key, value, raw) : true;
    },
  });
  return facade;
}

function wrapHandler<T extends Winston.ExceptionHandler | Winston.RejectionHandler>(
  raw: T,
  rawLogger: Winston.Logger,
  logger: Winston.Logger,
): T {
  const methods = new Map<PropertyKey, (...args: any[]) => any>();
  const handler = new Proxy({} as T, {
    get(_target, key) {
      if (key === 'logger') return logger;
      const value = Reflect.get(raw, key, raw);
      if (typeof value !== 'function') return value;
      if (!methods.has(key)) {
        methods.set(key, (...args: any[]) => {
          const result = Reflect.apply(value, raw, args);
          if (result === raw) return handler;
          return result === rawLogger ? logger : result;
        });
      }
      return methods.get(key);
    },
    set(_target, key, value) {
      if (key === 'logger') return false;
      return Reflect.set(raw, key, value, raw);
    },
  });
  return handler;
}

function wrapProfiler(raw: Winston.Profiler, logger: Winston.Logger): Winston.Profiler {
  return new Proxy({} as Winston.Profiler, {
    get(_target, key) {
      if (key === 'logger') return logger;
      if (key === 'done') {
        return (...args: any[]) => {
          if (getRequestBoundary()) return logger;
          const result = Reflect.apply(raw.done, raw, args);
          return result === raw.logger ? logger : result;
        };
      }
      return Reflect.get(raw, key, raw);
    },
    set(_target, key, value) {
      if (key === 'logger') return false;
      return Reflect.set(raw, key, value, raw);
    },
  });
}
