import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import * as Winston from 'winston';
import Transport from 'winston-transport';

import { createRequestBoundary, runWithRequestBoundary } from '../requestBoundary.ts';
import { requiresFreshTestResources, TEST_REQUIRE_FRESH_RESOURCES_ENV } from '../testStrictMode.ts';
import { AppLogger } from './appLogger.ts';
import { getSuppressedDiagnosticLogger } from './diagnosticLogger.ts';

let previousStrictFlag: string | undefined;
beforeEach(() => {
  previousStrictFlag = process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
  delete process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
});
afterEach(() => {
  if (previousStrictFlag === undefined) delete process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
  else process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = previousStrictFlag;
});

class MemoryTransport extends Transport {
  count = 0;

  override log(_info: unknown, callback: () => void) {
    this.count++;
    callback();
  }
}

// No boundary formatter: only the facade can prevent Winston from reading input.
function fixture() {
  const sink = new MemoryTransport();
  const raw = Winston.createLogger({ transports: [sink] });
  const factory = new AppLogger();
  let creations = 0;
  Object.defineProperty(factory, '_createClient', {
    value() {
      creations++;
      return raw;
    },
  });
  const logger = factory.get();
  return {
    raw,
    logger,
    sink,
    factory,
    creations: () => creations,
    async close() {
      try {
        await factory.dispose();
      } finally {
        raw.close();
        sink.close?.();
      }
    },
  };
}

function payloadProbe() {
  let reads = 0;
  return {
    payload: {
      get message() {
        reads++;
        return 'local';
      },
    },
    reads: () => reads,
  };
}

function throwingProbe() {
  let reads = 0;
  const read = () => {
    reads++;
    throw new Error('Synthetic logger input must not be evaluated');
  };
  return {
    value: new Proxy({}, { get: read, ownKeys: read }),
    read,
    reads: () => reads,
  };
}

test(
  'cached diagnostic handlers never expose raw Winston to a request boundary',
  { concurrency: false },
  async () => {
    const local = fixture();
    const { raw, logger, sink } = local;
    const exceptions = logger.exceptions;
    const rejections = logger.rejections;
    const probe = payloadProbe();
    try {
      assert.equal(local.factory.get(), logger);
      assert.equal(local.creations(), 1);
      assert.equal(logger.exceptions, exceptions);
      assert.equal(logger.rejections, rejections);
      for (const handler of [exceptions, rejections]) {
        assert.equal(handler.logger, logger);
        assert.equal(Reflect.set(handler, 'logger', raw), false);
      }
      assert.equal(raw.exceptions.logger, raw);
      assert.equal(raw.rejections.logger, raw);
      runWithRequestBoundary(createRequestBoundary(), () => {
        assert.equal(local.factory.get(), getSuppressedDiagnosticLogger());
        assert.equal(local.factory.get('unconfigured' as any), getSuppressedDiagnosticLogger());
        assert.equal(local.factory.child('synthetic' as any), getSuppressedDiagnosticLogger());
        logger.error(probe.payload);
        logger.exceptions.logger.error(probe.payload);
        logger.rejections.logger.error(probe.payload);
        exceptions.logger.error(probe.payload);
        rejections.logger.error(probe.payload);
      });
      assert.equal(probe.reads(), 0);
      assert.equal(sink.count, 0);
      for (const handler of [exceptions, rejections]) {
        const before = probe.reads();
        handler.logger.error(probe.payload);
        assert.ok(probe.reads() > before);
      }
      assert.equal(sink.count, 2);
      const before = probe.reads();
      raw.error(probe.payload);
      assert.ok(probe.reads() > before);
      assert.equal(sink.count, 3);
    } finally {
      await local.close();
    }
  },
);

test(
  'diagnostic handler methods keep their raw receiver and map fluent returns',
  { concurrency: false },
  async () => {
    const local = fixture();
    try {
      for (const key of ['exceptions', 'rejections'] as const) {
        const rawHandler = local.raw[key];
        const handler = local.logger[key];
        const marker = {};
        const original = rawHandler.getAllInfo;
        Object.defineProperty(rawHandler, 'getAllInfo', {
          configurable: true,
          value(this: typeof rawHandler, value: unknown) {
            assert.equal(this, rawHandler);
            assert.equal(value, marker);
            return this;
          },
        });
        try {
          assert.equal(handler.handlers, rawHandler.handlers);
          assert.equal(handler.getAllInfo(marker as any), handler);
          assert.equal(handler.logger, local.logger);
        } finally {
          Object.defineProperty(rawHandler, 'getAllInfo', {
            configurable: true,
            value: original,
          });
        }
      }
      const exceptions = local.logger.exceptions;
      const rejections = local.logger.rejections;
      local.logger.configure({ transports: [local.sink] });
      assert.notEqual(local.logger.exceptions, exceptions);
      assert.notEqual(local.logger.rejections, rejections);
      assert.equal(local.logger.exceptions.logger, local.logger);
      assert.equal(local.logger.rejections.logger, local.logger);
      assert.equal(exceptions.logger, local.logger);
      assert.equal(rejections.logger, local.logger);
      runWithRequestBoundary(createRequestBoundary(), () => {
        exceptions.logger.error('local');
        rejections.logger.error('local');
      });
      assert.equal(local.sink.count, 0);
    } finally {
      await local.close();
    }
  },
);

test('strict logger bypasses cached clients and payloads', { concurrency: false }, async () => {
  const local = fixture();
  const probe = throwingProbe();
  try {
    process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = 'true';
    const suppressed = getSuppressedDiagnosticLogger();
    assert.equal(local.factory.get(), suppressed);
    assert.equal(local.factory.get('unconfigured' as any), suppressed);
    assert.equal(local.factory.child('synthetic' as any), suppressed);
    assert.equal(local.factory.child('synthetic' as any, 'unconfigured' as any), suppressed);
    assert.notEqual(suppressed, local.logger);
    assert.equal(suppressed.error(probe.value), suppressed);
    assert.equal(suppressed.info(probe.value), suppressed);
    assert.equal(suppressed.log(probe.value as any), suppressed);
    assert.equal(suppressed.child(probe.value), suppressed);
    assert.equal(suppressed.startTimer().done(probe.value), suppressed);
    let completions = 0;
    assert.equal(
      suppressed.write(probe.value, () => completions++),
      true,
    );
    assert.equal(completions, 1);
    assert.equal(probe.reads(), 0);
    assert.equal(local.creations(), 1);
    assert.equal(local.sink.count, 0);
    delete process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
    assert.equal(local.factory.get(), local.logger);
    local.factory.child().info('ordinary logging remains available');
    assert.equal(local.sink.count, 1);
  } finally {
    await local.close();
  }
});

test('strict entry guards precede cache and app access', { concurrency: false }, async () => {
  const local = fixture();
  const probe = throwingProbe();
  const descriptors = Object.getOwnPropertyDescriptors(local.factory);
  const cacheKeys = Object.getOwnPropertySymbols(local.factory);
  try {
    assert.equal(cacheKeys.length, 2);
    for (const key of cacheKeys) {
      Object.defineProperty(local.factory, key, { configurable: true, get: probe.read });
    }
    Object.defineProperty(local.factory, 'app', { configurable: true, get: probe.read });
    process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = 'true';
    assert.equal(local.factory.get(), getSuppressedDiagnosticLogger());
    assert.equal(local.factory.get(probe.value as any), getSuppressedDiagnosticLogger());
    Object.defineProperty(local.factory, 'get', { configurable: true, get: probe.read });
    assert.equal(local.factory.child(), getSuppressedDiagnosticLogger());
    assert.equal(
      local.factory.child(probe.value as any, probe.value as any),
      getSuppressedDiagnosticLogger(),
    );
    assert.equal(local.creations(), 1);
    assert.equal(probe.reads(), 0);
    assert.equal(local.sink.count, 0);
  } finally {
    delete (local.factory as any).get;
    delete (local.factory as any).app;
    Object.defineProperties(local.factory, descriptors);
    await local.close();
  }
});

test('strict logger skips real configuration factories', { concurrency: false }, async () => {
  const factory = new AppLogger();
  const probe = throwingProbe();
  let configurations = 0;
  Object.defineProperty(factory, 'app', {
    value: {
      config: {
        logger: {
          base() {
            configurations++;
            return probe.read();
          },
          clients: {
            default() {
              configurations++;
              return probe.read();
            },
          },
          get baseDir() {
            return probe.read();
          },
          get rotate() {
            return probe.read();
          },
        },
      },
    },
  });
  try {
    process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = 'true';
    assert.equal(factory.get(), getSuppressedDiagnosticLogger());
    assert.equal(factory.child('synthetic' as any), getSuppressedDiagnosticLogger());
    assert.equal(configurations, 0);
    assert.equal(probe.reads(), 0);
  } finally {
    await factory.dispose();
  }
});

test('strict file transport fails before any input access', { concurrency: false }, () => {
  const factory = new AppLogger();
  const probe = throwingProbe();
  const args = [probe.value, probe.value, probe.value] as unknown as Parameters<
    AppLogger['createTransportFile']
  >;
  Object.defineProperty(factory, 'app', { get: probe.read });
  process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = 'true';
  assert.throws(() => factory.createTransportFile(...args), {
    message: 'Strict test file logger transport is disabled',
  });
  runWithRequestBoundary(createRequestBoundary(), () => {
    assert.throws(() => factory.createTransportFile(...args), {
      message: 'Strict test file logger transport is disabled',
    });
  });
  assert.equal(probe.reads(), 0);
});

test('invalid strict flags never fall back to loggers', { concurrency: false }, async () => {
  const local = fixture();
  const probe = throwingProbe();
  Object.defineProperty(local.factory, 'app', { get: probe.read });
  const args = [probe.value, probe.value, probe.value] as unknown as Parameters<
    AppLogger['createTransportFile']
  >;
  try {
    const env: NodeJS.ProcessEnv = { NODE_ENV: 'test', META_FLAVOR: 'normal', META_MODE: 'test' };
    assert.equal(requiresFreshTestResources(), false);
    assert.equal(requiresFreshTestResources(env), false);
    assert.equal(
      requiresFreshTestResources({ ...env, [TEST_REQUIRE_FRESH_RESOURCES_ENV]: 'true' }),
      true,
    );
    for (const flag of ['', 'false', 'TRUE', 'synthetic-invalid-flag']) {
      process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = flag;
      const expected = { message: 'Invalid strict test resource freshness flag' };
      assert.throws(() => requiresFreshTestResources(), expected);
      assert.throws(
        () => requiresFreshTestResources({ ...env, [TEST_REQUIRE_FRESH_RESOURCES_ENV]: flag }),
        expected,
      );
      const calls = [
        () => local.factory.get(),
        () => local.factory.child('synthetic' as any),
        () => local.factory.createTransportFile(...args),
      ];
      for (const call of calls) {
        assert.throws(call, expected);
        runWithRequestBoundary(createRequestBoundary(), () => assert.throws(call, expected));
      }
    }
    assert.equal(probe.reads(), 0);
    assert.equal(local.creations(), 1);
    assert.equal(local.sink.count, 0);
  } finally {
    await local.close();
  }
});
