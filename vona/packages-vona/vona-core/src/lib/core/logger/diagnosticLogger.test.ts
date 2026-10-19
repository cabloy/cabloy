import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as Winston from 'winston';
import Transport from 'winston-transport';

import { createRequestBoundary, runWithRequestBoundary } from '../requestBoundary.ts';
import { AppLogger } from './appLogger.ts';

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

test('cached diagnostic handlers never expose raw Winston to a request boundary', async () => {
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
});

test('diagnostic handler methods keep their raw receiver and map fluent returns', async () => {
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
});
