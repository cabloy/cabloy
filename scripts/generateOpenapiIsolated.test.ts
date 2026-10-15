import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { test } from 'node:test';

import type { GuardianResult, OwnedProcess } from './runIsolatedTest.ts';

import {
  getOpenapiGeneratorCommand,
  getOpenapiSource,
  validateOpenapiSource,
} from './generateOpenapiIsolated.ts';
import { getIsolatedVonaCommand, ROOT_DIR, withIsolatedVona } from './runIsolatedTest.ts';

test('builds the isolated Swagger source from the allocated port', () => {
  assert.equal(getOpenapiSource(7123), 'http://127.0.0.1:7123/swagger/json?version=V31');
});

test('forwards OpenAPI module arguments to the existing Zova generator', () => {
  assert.deepEqual(getOpenapiGeneratorCommand(['training-student', '--nometadata']), {
    command: process.execPath,
    args: [
      './zova/packages-cli/cli/src/bin/zova.ts',
      '--projectPath=zova',
      ':openapi:generate',
      'training-student',
      '--nometadata',
    ],
    cwd: ROOT_DIR,
  });
});

test('rejects project overrides before provisioning isolated resources', () => {
  for (const args of [['--projectPath=other'], ['--projectPath', 'other']]) {
    assert.throws(() => getOpenapiGeneratorCommand(args), /projectPath overrides are unsupported/);
  }
});

test('launches only a loopback single-worker test-mode Vona service', () => {
  const command = getIsolatedVonaCommand(7123, { CUSTOM: 'keep' }, 'test-key');
  assert.equal(command.command, process.execPath);
  assert.deepEqual(command.args, [
    './packages-cli/cli/src/bin/vona.ts',
    ':bin:dev',
    '--workers=1',
    '--flavor=normal',
    '--mode=test',
  ]);
  assert.equal(command.cwd, `${ROOT_DIR}/vona`);
  assert.deepEqual(command.env, {
    CUSTOM: 'keep',
    VONA_TEST_READY_KEY: 'test-key',
    VONA_TEST_SERVER_ORIGIN: 'true',
    SERVER_SERVE_PROTOCOL: 'http',
    SERVER_SERVE_HOST: '127.0.0.1:7123',
  });
});

function lifecycleFixture(options: { readyFailure?: boolean; stopFailure?: boolean } = {}) {
  const events: string[] = [];
  let finish!: (result: GuardianResult) => void;
  const closed = new Promise<GuardianResult>(resolve => {
    finish = resolve;
  });
  const result: GuardianResult = {
    type: 'drained',
    failed: false,
    result: { code: 0, signal: null },
  };
  const server: OwnedProcess = {
    wait: () => closed,
    stop: async () => {
      events.push('stop');
      if (options.stopFailure) throw new Error('shutdown failed');
      finish(result);
      return result;
    },
  };
  return {
    events,
    finish,
    result,
    dependencies: {
      start: async () => {
        events.push('start');
        return server;
      },
      ready: async () => {
        events.push('ready');
        if (options.readyFailure) throw new Error('readiness failed');
      },
    },
  };
}

test('stops Vona after generation succeeds or fails and removes signal handlers', async () => {
  for (const fail of [false, true]) {
    const f = lifecycleFixture();
    const listeners = process.listenerCount('SIGINT');
    const run = withIsolatedVona(
      7123,
      {},
      async () => {
        f.events.push('generate');
        if (fail) throw new Error('generator failed');
        return 'generated';
      },
      f.dependencies,
    );
    if (fail) await assert.rejects(run, /generator failed/);
    else assert.equal(await run, 'generated');
    assert.deepEqual(f.events, ['start', 'ready', 'generate', 'stop']);
    assert.equal(process.listenerCount('SIGINT'), listeners);
  }
});

test('readiness failure stops Vona without invoking the generator', async () => {
  const f = lifecycleFixture({ readyFailure: true });
  await assert.rejects(
    withIsolatedVona(
      7123,
      {},
      async () => {
        f.events.push('generate');
      },
      f.dependencies,
    ),
    /readiness failed/,
  );
  assert.deepEqual(f.events, ['start', 'ready', 'stop']);
});

test('preserves both generation and shutdown errors', async () => {
  const f = lifecycleFixture({ stopFailure: true });
  await assert.rejects(
    withIsolatedVona(
      7123,
      {},
      async () => {
        throw new Error('generator failed');
      },
      f.dependencies,
    ),
    (error: unknown) => {
      assert.ok(error instanceof AggregateError);
      assert.deepEqual(
        error.errors.map(item => item.message),
        ['generator failed', 'shutdown failed'],
      );
      return true;
    },
  );
});

test('an interrupted run or an early server exit cannot succeed', async () => {
  for (const interrupt of [false, true]) {
    const f = lifecycleFixture();
    await assert.rejects(
      withIsolatedVona(
        7123,
        {},
        async () => {
          if (interrupt) {
            process.emit('SIGINT');
          } else {
            f.finish(f.result);
            await Promise.resolve();
          }
        },
        f.dependencies,
      ),
      /exited early, or run was interrupted/,
    );
  }
});

test('preflight distinguishes HTTP, JSON and OpenAPI shape failures', async () => {
  let status = 200;
  let body = JSON.stringify({ openapi: '3.1.0', info: {}, paths: {} });
  const server = createServer((_req, res) => {
    res.writeHead(status, status === 302 ? { location: '/redirect-target' } : {});
    res.end(body);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const source = getOpenapiSource(address.port);
  try {
    await validateOpenapiSource(source);
    status = 302;
    await assert.rejects(validateOpenapiSource(source), /source request failed/);
    status = 503;
    await assert.rejects(validateOpenapiSource(source), /HTTP 503/);
    status = 200;
    body = 'not-json';
    await assert.rejects(validateOpenapiSource(source), /invalid JSON/);
    for (const value of [null, [], {}, { openapi: '3.1.0', paths: [] }]) {
      body = JSON.stringify(value);
      await assert.rejects(validateOpenapiSource(source), /invalid document/);
    }
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close(error => (error ? reject(error) : resolve())),
    );
  }
});
