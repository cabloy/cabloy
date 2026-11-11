import assert from 'node:assert/strict';
import { request } from 'node:http';
import { connect } from 'node:net';
import { after, before, describe, it } from 'node:test';

import { createNativeTransportFixture } from './support/nativeTransportFixture.ts';

const version = '2026-07-28';
const meta = {
  'io.modelcontextprotocol/protocolVersion': version,
  'io.modelcontextprotocol/clientCapabilities': {},
};

function rpc(method = 'fixture/probe', params: Record<string, unknown> = {}) {
  return { jsonrpc: '2.0', id: 1, method, params: { ...params, _meta: meta } };
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

type Fixture = Awaited<ReturnType<typeof createNativeTransportFixture>>;

function exchange(
  fixture: Fixture,
  body: unknown = rpc(),
  overrides: {
    method?: string;
    path?: string;
    headers?: Record<string, string>;
    bytes?: Buffer;
  } = {},
) {
  const bytes = overrides.bytes ?? Buffer.from(JSON.stringify(body));
  let responseBytes = 0;
  const req = request({
    host: '127.0.0.1',
    port: fixture.port,
    agent: false,
    method: overrides.method ?? 'POST',
    path: overrides.path ?? '/mcp',
    headers: {
      'Host': fixture.host,
      'Origin': fixture.origin,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'Content-Length': String(bytes.length),
      'MCP-Protocol-Version': version,
      'Mcp-Method': (body as { method?: string })?.method ?? 'fixture/probe',
      ...overrides.headers,
    },
  });
  const result = new Promise<{ status: number; headers: Record<string, unknown>; text: string }>(
    (resolve, reject) => {
      req.on('error', () => reject(new Error('fixture_client_error')));
      req.on('response', res => {
        const parts: Buffer[] = [];
        res.on('data', (chunk: Buffer) => {
          responseBytes += chunk.length;
          if (responseBytes > 16 * 1024) {
            req.destroy();
            reject(new Error('fixture_client_output_limit'));
          } else {
            parts.push(chunk);
          }
        });
        res.on('aborted', () => reject(new Error('fixture_client_aborted')));
        res.on('error', () => reject(new Error('fixture_client_response_error')));
        res.on('end', () =>
          resolve({
            status: res.statusCode!,
            headers: res.headers,
            text: Buffer.concat(parts).toString('utf8'),
          }),
        );
      });
    },
  );
  // A disconnect case may intentionally reject before the assertion awaits it.
  void result.catch(() => {});
  req.end(bytes);
  return { req, result };
}

function wireProjection(response: { status: number; text: string }) {
  let body: { jsonrpc?: unknown; error?: { code?: unknown }; result?: unknown } = {};
  try {
    body = JSON.parse(response.text);
  } catch {
    /* Never print raw wire on failure. */
  }
  return {
    status: response.status,
    jsonrpc: body.jsonrpc,
    code: body.error?.code,
    resultPresent: Object.hasOwn(body, 'result'),
  };
}

async function settled(fixture: Fixture, alias: string) {
  return await fixture.waitFor(state => state.runs[alias]?.released === true);
}

// Fixed source-local selection for the separately retained expected-failure probe.
// Normal qualification always restores this literal to false; no runtime selector.
const watchdogProbe = false;

(watchdogProbe ? describe : describe.skip)(
  'MCP owned-child watchdog probe',
  { concurrency: false },
  () => {
    it('fails the dedicated managed child instead of detaching an uncooperative case', async () => {
      const fixture = await createNativeTransportFixture();
      await fixture.runCase('owned-child-watchdog', () => new Promise<never>(() => {}));
    });
  },
);

(watchdogProbe ? describe.skip : describe)(
  'MCP bounded native-core qualification',
  { concurrency: false },
  () => {
    let fixture: Fixture;
    before(async () => {
      fixture = await createNativeTransportFixture();
    });
    after(async () => {
      if (!fixture) return;
      try {
        await fixture.close();
        const state = fixture.snapshot();
        assert.equal(state.active, 0, 'all_owned_slots_released');
        assert.equal(state.closed, true, 'owned_listener_closed');
      } finally {
        // Safe event projections are built at their source; no raw SDK/wire objects.
        for (const event of fixture.events) process.stdout.write(`${JSON.stringify(event)}\n`);
      }
    });

    it('returns JSON and actual discovery through raw router/executor without a session', async () => {
      await fixture.runCase('json-and-discovery', async () => {
        for (const method of ['fixture/probe', 'server/discover']) {
          const alias = fixture.enqueue({ mode: 'json' });
          const response = await exchange(fixture, rpc(method), {
            headers: {
              'Mcp-Session-Id': 'synthetic-ignored',
              'Last-Event-ID': 'synthetic-ignored',
            },
          }).result;
          assert.deepEqual(wireProjection(response), {
            status: 200,
            jsonrpc: '2.0',
            code: undefined,
            resultPresent: true,
          });
          assert.equal(response.headers['mcp-session-id'], undefined);
          assert.equal(
            String(response.headers['content-type']).startsWith('application/json'),
            true,
          );
          const state = await settled(fixture, alias);
          const run = state.runs[alias]!;
          assert.equal(
            run.adapterSettled &&
              run.workSettled &&
              run.cleanupSettled &&
              run.scopeDisposed &&
              run.executorSettled,
            true,
          );
        }
      });
    });

    it('preserves modern wire error codes without raw exception reflection', async () => {
      await fixture.runCase('modern-wire-errors', async () => {
        const cases: Array<{
          body: unknown;
          headers: Record<string, string>;
          status: number;
          code: number;
        }> = [
          { body: rpc(), headers: { 'Mcp-Method': '' }, status: 400, code: -32020 },
          { body: rpc(), headers: { 'Mcp-Method': 'different' }, status: 400, code: -32020 },
          { body: rpc('initialize'), headers: {}, status: 404, code: -32601 },
          { body: rpc('fixture/unknown'), headers: {}, status: 404, code: -32601 },
          { body: { ...rpc(), params: {} }, headers: {}, status: 400, code: -32602 },
          {
            body: {
              ...rpc(),
              params: {
                _meta: { ...meta, 'io.modelcontextprotocol/protocolVersion': '2026-99-99' },
              },
            },
            headers: { 'MCP-Protocol-Version': '2026-99-99' },
            status: 400,
            code: -32022,
          },
        ];
        for (const item of cases) {
          const alias = fixture.enqueue({ mode: 'json' });
          const response = await exchange(fixture, item.body, { headers: item.headers }).result;
          const projection = wireProjection(response);
          assert.equal(projection.status, item.status, 'wire_status');
          assert.equal(projection.code, item.code, 'wire_code');
          assert.equal(response.text.includes('stack'), false, 'no_stack_field');
          await settled(fixture, alias);
        }
      });
    });

    it('validates actual name mirrors and capability wire shape without a tool catalog', async () => {
      await fixture.runCase('name-and-capability', async () => {
        for (const name of [
          'synthetic',
          '=?base64?c3ludGhldGlj?=',
          'c3ludGhldGlj',
          '=?base64?%%%?=',
          '=?base64?/w==?=',
          '=?base64?b3RoZXI=?=',
          '',
        ]) {
          const alias = fixture.enqueue({ mode: 'json' });
          const response = await exchange(
            fixture,
            rpc('tools/call', { name: 'synthetic', arguments: {} }),
            { headers: { 'Mcp-Name': name } },
          ).result;
          const valid = name === 'synthetic' || name === '=?base64?c3ludGhldGlj?=';
          assert.equal(wireProjection(response).status, valid ? 404 : 400, 'name_mirror_status');
          assert.equal(wireProjection(response).code, valid ? -32601 : -32020, 'name_mirror_code');
          await settled(fixture, alias);
        }
        const alias = fixture.enqueue({ mode: 'json' });
        const response = await exchange(fixture, rpc('fixture/capability')).result;
        assert.equal(wireProjection(response).status, 400);
        assert.equal(wireProjection(response).code, -32021);
        let roots = false;
        try {
          const parsed = JSON.parse(response.text);
          roots = Object.hasOwn(parsed.error.data.requiredCapabilities, 'roots');
        } catch {
          /* Only the safe boolean is asserted. */
        }
        assert.equal(roots, true, 'required_roots_capability');
        await settled(fixture, alias);
      });
    });

    it('classifies legacy initialize and legacy notification without assuming an error for both', async () => {
      await fixture.runCase('legacy-classification', async () => {
        const initialize = fixture.enqueue({ mode: 'json' });
        const rejected = await exchange(
          fixture,
          {
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: { protocolVersion: '2025-11-25' },
          },
          { headers: { 'MCP-Protocol-Version': '2025-11-25' } },
        ).result;
        assert.equal(wireProjection(rejected).status, 400);
        assert.equal(wireProjection(rejected).code, -32022);
        await settled(fixture, initialize);
        const notification = fixture.enqueue({ mode: 'json' });
        const dropped = await exchange(
          fixture,
          { jsonrpc: '2.0', method: 'notifications/initialized' },
          { headers: { 'MCP-Protocol-Version': '2025-11-25' } },
        ).result;
        assert.equal(dropped.status, 202);
        assert.equal(dropped.text.length, 0);
        await settled(fixture, notification);
      });
    });

    it('keeps invalid Origin and unsupported methods outside executor/router', async () => {
      await fixture.runCase('pre-executor-admission', async () => {
        const before = fixture.snapshot();
        const cases: Array<{ method: string; headers: Record<string, string>; status: number }> = [
          { method: 'POST', headers: { Origin: 'null' }, status: 403 },
          { method: 'GET', headers: {}, status: 405 },
          { method: 'DELETE', headers: {}, status: 405 },
          { method: 'POST', headers: { 'X-HTTP-Method-Override': 'GET' }, status: 400 },
          { method: 'POST', headers: { Authorization: 'synthetic' }, status: 403 },
        ];
        for (const item of cases) {
          const response = await exchange(fixture, rpc(), item).result;
          assert.equal(response.status, item.status, 'admission_status');
          assert.equal(response.text.length, 0, 'empty_admission_denial');
          if (item.status === 405) assert.equal(response.headers.allow, 'POST');
        }
        const after = fixture.snapshot();
        assert.equal(after.executorEntries, before.executorEntries);
        assert.equal(after.routerEntries, before.routerEntries);
      });
    });

    it('emits bounded request-scoped SSE and sanitized precommit failure', async () => {
      await fixture.runCase('sse-and-safe-error', async () => {
        const alias = fixture.enqueue({ mode: 'sse' });
        const response = await exchange(fixture).result;
        assert.equal(response.status, 200);
        assert.equal(
          String(response.headers['content-type']).startsWith('text/event-stream'),
          true,
        );
        const frames = response.text.split('\n\n').filter(Boolean);
        assert.equal(frames.length > 1 && frames.length <= 8, true);
        assert.equal(
          frames.every(frame => Buffer.byteLength(`${frame}\n\n`) <= 2048),
          true,
        );
        await settled(fixture, alias);
        const failure = fixture.enqueue({ mode: 'throw' });
        const failed = await exchange(fixture).result;
        assert.equal(wireProjection(failed).code, -32603);
        assert.equal(failed.text.includes('synthetic_failure_private'), false);
        await settled(fixture, failure);
      });
    });

    it('terminates postcommit failures without appending a second error envelope', async () => {
      await fixture.runCase('postcommit-no-envelope', async () => {
        const alias = fixture.enqueue({ mode: 'postcommit' });
        let reflected = false;
        let bytes = 0;
        const client = request({
          host: '127.0.0.1',
          port: fixture.port,
          agent: false,
          method: 'POST',
          path: '/mcp',
          headers: {
            'Host': fixture.host,
            'Origin': fixture.origin,
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
            'MCP-Protocol-Version': version,
            'Mcp-Method': 'fixture/probe',
          },
        });
        try {
          await new Promise<void>(resolve => {
            client.on('error', () => resolve());
            client.on('response', response => {
              response.on('data', (chunk: Buffer) => {
                bytes += chunk.length;
                const text = chunk.toString('utf8');
                reflected ||=
                  text.includes('Internal error') ||
                  text.includes('Synthetic fixture failure') ||
                  text.includes('"error"');
                if (bytes > 16384) client.destroy();
              });
              response.on('end', resolve);
              response.on('error', () => resolve());
              response.on('aborted', resolve);
            });
            client.end(JSON.stringify(rpc()));
          });
          const state = await settled(fixture, alias);
          assert.equal(reflected, false, 'no_postcommit_error_envelope');
          assert.equal(state.runs[alias]!.prematureClose, true);
          assert.equal(bytes <= 16384, true);
        } finally {
          client.destroy();
        }
      });
    });

    it('bounds real incomplete body receipt before executor entry', async () => {
      await fixture.runCase('body-receive-timeout', async () => {
        const before = fixture.snapshot().executorEntries;
        const alias = fixture.enqueue({ mode: 'json' });
        const client = request({
          host: '127.0.0.1',
          port: fixture.port,
          agent: false,
          method: 'POST',
          path: '/mcp',
          headers: {
            'Host': fixture.host,
            'Origin': fixture.origin,
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
            'Content-Length': '100',
          },
        });
        try {
          const status = await new Promise<number>(resolve => {
            client.on('error', () => resolve(0));
            client.on('response', response => {
              response.resume();
              response.on('end', () => resolve(response.statusCode!));
            });
            client.write('{');
          });
          assert.equal(status, 408);
          await settled(fixture, alias);
          assert.equal(fixture.snapshot().executorEntries, before);
        } finally {
          client.destroy();
        }
      });
    });

    it('does not release a disconnected slot or dispose scope while cleanup is held', async () => {
      await fixture.runCase('cleanup-held-overlap', async () => {
        const cleanup = deferred();
        const work = deferred();
        const one = fixture.enqueue({ mode: 'hold', cleanupBarrier: cleanup.promise });
        const first = exchange(fixture);
        const two = fixture.enqueue({ mode: 'hold', workBarrier: work.promise });
        const second = exchange(fixture);
        try {
          await fixture.waitFor(
            state =>
              state.active === 2 &&
              state.runs[one]?.routerEntered === true &&
              state.runs[two]?.routerEntered === true,
          );
          first.req.destroy();
          await fixture.waitFor(state => state.runs[one]?.cancelObserved === true);
          const held = fixture.snapshot();
          assert.equal(held.active, 2);
          assert.equal(held.runs[one]!.scopeDisposed, false);
          assert.equal(held.runs[one]!.released, false);
          const before = held.executorEntries;
          const third = await exchange(fixture).result;
          assert.equal(third.status, 429);
          assert.equal(fixture.snapshot().executorEntries, before);
        } finally {
          cleanup.resolve();
          work.resolve();
          await Promise.allSettled([first.result, second.result]);
          await settled(fixture, one);
          await settled(fixture, two);
        }
        const state = fixture.snapshot();
        assert.equal(
          state.runs[one]!.scopeDisposed &&
            state.runs[one]!.executorSettled &&
            state.runs[one]!.released,
          true,
        );
        assert.equal(state.active, 0);
      });
    });

    it('uses execution deadline for cancellation but waits for real settlement', async () => {
      await fixture.runCase('deadline-settlement', async () => {
        const alias = fixture.enqueue({ mode: 'hold' });
        const response = await exchange(fixture).result;
        assert.equal(response.status, 504);
        assert.equal(response.text.length, 0);
        const state = await settled(fixture, alias);
        assert.equal(
          state.runs[alias]!.cancelObserved &&
            state.runs[alias]!.workSettled &&
            state.runs[alias]!.scopeDisposed,
          true,
        );
      });
    });

    it('bounds slow incomplete headers without executor admission', async () => {
      await fixture.runCase('header-receive-timeout', async () => {
        const before = fixture.snapshot().executorEntries;
        const socket = connect({ host: '127.0.0.1', port: fixture.port });
        try {
          await new Promise<void>((resolve, reject) => {
            socket.on('error', () => reject(new Error('fixture_socket_error')));
            socket.on('connect', () => socket.write('POST /mcp HTTP/1.1\r\nHost: '));
            socket.on('data', () => {});
            socket.on('close', () => resolve());
          });
          assert.equal(fixture.snapshot().executorEntries, before);
        } finally {
          socket.destroy();
        }
      });
    });
  },
);
