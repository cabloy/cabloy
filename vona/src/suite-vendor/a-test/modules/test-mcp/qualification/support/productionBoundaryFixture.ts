import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ProductionOwnerContext, ProductionOwnerPorts } from 'vona-module-cabloy-mcp/testing';

import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { setImmediate as nextTurn } from 'node:timers/promises';

import { boundedProof } from './boundedProof.ts';

export function barrier() {
  let release!: () => void;
  const promise = new Promise<void>(resolve => {
    release = resolve;
  });
  return { promise, release };
}

export class BoundaryResponse extends EventEmitter {
  statusCode = 200;
  headersSent = false;
  writableEnded = false;
  writableFinished = false;
  destroyed = false;
  ends = 0;
  destroys = 0;
  bytes = 0;
  autoFinish = true;
  teardown?: () => void;

  override off(...args: Parameters<EventEmitter['off']>): this {
    super.off(...args);
    if (args[0] === 'error') this.teardown?.();
    return this;
  }

  end(payload?: string) {
    assert.equal(this.writableEnded || this.destroyed, false, 'duplicate_end');
    this.ends++;
    this.bytes += Buffer.byteLength(payload ?? '');
    this.headersSent = true;
    this.writableEnded = true;
    if (this.autoFinish) this.finish();
    return this;
  }

  finish() {
    this.writableFinished = true;
    this.emit('finish');
  }

  destroy(error?: Error) {
    assert.equal(error, undefined, 'raw_destroy_error');
    this.destroys++;
    this.destroyed = true;
    this.emit('close');
    return this;
  }
}

export function boundaryIO() {
  const request = Object.assign(new EventEmitter(), {
    aborted: false,
    method: 'POST',
    url: '/mcp',
    headers: { host: '127.0.0.1' },
    socket: { encrypted: false, remoteAddress: '127.0.0.1', remotePort: 7001 },
  });
  const response = new BoundaryResponse();
  return {
    request,
    response,
    req: request as unknown as IncomingMessage,
    res: response as unknown as ServerResponse,
    disconnect() {
      request.aborted = true;
      request.emit('aborted');
      response.destroy();
    },
  };
}

export function controlledPorts(io: ReturnType<typeof boundaryIO>) {
  const ctx: ProductionOwnerContext = {
    respond: true,
    onerror() {
      throw new Error('default_sink_called');
    },
  };
  const counts = { provider: 0, executor: 0, cleanup: 0 };
  const ports: ProductionOwnerPorts<ProductionOwnerContext> = {
    async binding() {
      counts.provider++;
      return { outcome: 'admitted', instanceName: '' };
    },
    async execute(callback, options, lifecycle) {
      counts.executor++;
      assert.deepEqual(Object.keys(options).sort(), [
        'dbInfo',
        'innerAccess',
        'instanceName',
        'req',
        'res',
      ]);
      assert.equal(options.instanceName, '');
      assert.equal(options.innerAccess, false);
      assert.deepEqual(options.dbInfo, { level: 0 });
      assert.equal(options.req === io.req && options.res === io.res, true, 'native_pair');
      lifecycle.initializeContext(ctx);
      await callback(ctx);
      lifecycle.onScopeOutcome('disposed');
    },
    async work() {
      io.response.end();
    },
    async cleanup() {
      counts.cleanup++;
    },
  };
  return { ctx, counts, ports };
}

export async function turns() {
  await nextTurn();
  await nextTurn();
}

export async function waitFor(promise: Promise<unknown>) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      promise,
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => reject(new Error('barrier_observation_failed')), 2_000);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

const serializeEvent = boundedProof();
export function safeEvent(
  alias: string,
  proof: 'real-healthy' | 'controlled-fault' | 'synthetic-boundary' | 'source-scope',
  values: {
    status: number;
    active: number;
    released: boolean;
    healthy: boolean;
    terminal: boolean;
  },
) {
  assert.match(alias, /^[\x20-\x7E]{1,64}$/u, 'case_alias');
  return serializeEvent(seq => ({ alias, proof, outcome: 'observed', seq, ...values }));
}
