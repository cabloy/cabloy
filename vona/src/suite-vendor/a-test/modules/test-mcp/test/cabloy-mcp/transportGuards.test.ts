import type { ServerResponse } from 'node:http';

import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { Readable } from 'node:stream';
import { describe, it } from 'node:test';
import {
  createFixtureResponseGate,
  readFixtureBody,
  checkFixtureIngress,
  checkProtocolIngress,
} from 'vona-module-cabloy-mcp';

const version = '2026-07-28';
const meta = {
  'io.modelcontextprotocol/protocolVersion': version,
  'io.modelcontextprotocol/clientCapabilities': {},
};

function rpc(method = 'fixture/probe', params: Record<string, unknown> = {}) {
  return { jsonrpc: '2.0', id: 1, method, params: { ...params, _meta: meta } };
}

function ingress(overrides: Partial<Parameters<typeof checkFixtureIngress>[0]> = {}) {
  return checkFixtureIngress({
    peer: '127.0.0.1',
    host: '127.0.0.1:12345',
    target: '/mcp',
    method: 'POST',
    instanceHeaders: ['x-fixture-instance'],
    rawHeaders: [
      'Host',
      '127.0.0.1:12345',
      'Content-Type',
      'application/json',
      'Accept',
      'application/json, text/event-stream',
    ],
    ...overrides,
  });
}

async function parseBody(bytes: Buffer) {
  // Reader-only tests never create a Vona request context or listener.
  const req = Readable.from([bytes]);
  Object.assign(req, { headers: { 'content-length': String(bytes.length) } });
  return await readFixtureBody(
    req as Parameters<typeof readFixtureBody>[0],
    new AbortController().signal,
  );
}

async function rejectsBody(value: unknown) {
  let rejected = false;
  try {
    await parseBody(Buffer.from(JSON.stringify(value)));
  } catch {
    rejected = true;
  }
  assert.equal(rejected, true, 'bounded_body_rejected');
}

// A response-instance double exercises the writer's exact bounds and native
// drain handshake without replacing Node/Vona prototypes or opening a listener.
class ResponseProbe extends EventEmitter {
  destroyed = false;
  writableEnded = false;
  writableFinished = false;
  writableNeedDrain = false;
  headersSent = false;
  sendDate = false;
  status = 0;
  chunks: Buffer[] = [];
  headers: Record<string, string> = {};
  block = false;

  getHeaderNames() {
    return Object.keys(this.headers);
  }

  removeHeader(name: string) {
    delete this.headers[name];
  }

  writeHead(status: number, headers: Record<string, string>) {
    this.status = status;
    this.headers = headers;
    this.headersSent = true;
    return this;
  }

  write(bytes: Uint8Array) {
    this.chunks.push(Buffer.from(bytes));
    this.writableNeedDrain = this.block;
    return !this.block;
  }

  end(bytes?: Uint8Array) {
    if (bytes) this.chunks.push(Buffer.from(bytes));
    this.writableEnded = true;
    this.writableFinished = true;
    this.emit('finish');
    return this;
  }

  destroy() {
    if (!this.destroyed) {
      this.destroyed = true;
      this.emit('close');
    }
    return this;
  }
}

function responseGate() {
  const native = new ResponseProbe();
  const owner = createFixtureResponseGate(
    native as unknown as ServerResponse,
    new AbortController().signal,
  );
  return { native, ...owner };
}

function boundedResult(size: number) {
  const base = { jsonrpc: '2.0', id: 1, result: { value: '' } };
  base.result.value = 'x'.repeat(size - Buffer.byteLength(JSON.stringify(base)));
  return JSON.stringify(base);
}

describe('MCP transport guards', { concurrency: false }, () => {
  it('shares protocol checks without the standalone local authority policy', () => {
    const rawHeaders = [
      'Host',
      'dev.example.test:7102',
      'Origin',
      'https://client.example.test',
      'Content-Type',
      'application/json',
      'Accept',
      'application/json, text/event-stream',
      'X-Vona-Instance-Name',
      'shareTest',
    ];
    const input = {
      rawHeaders,
      target: '/mcp/web',
      method: 'POST',
      instanceHeader: 'x-vona-instance-name',
    };
    assert.equal(checkProtocolIngress(input), undefined);
    assert.equal(ingress({ rawHeaders, peer: '192.0.2.1' })?.status, 403);
    for (const [extra, status] of [
      [['Authorization', 'synthetic'], 403],
      [['Forwarded', 'for=192.0.2.1'], 403],
      [['X-Vona-Instance-Name', 'shareTest'], 400],
      [['X-HTTP-Method-Override', 'GET'], 400],
      [['X-Large', 'x'.repeat(2049)], 431],
    ] as const) {
      assert.equal(
        checkProtocolIngress({ ...input, rawHeaders: [...rawHeaders, ...extra] })?.status,
        status,
      );
    }
    assert.equal(checkProtocolIngress({ ...input, method: 'GET' })?.status, 405);
  });
  it('admits exactly one bearer only in the protected shared-listener profile', () => {
    const rawHeaders = [
      'Host',
      'resource.example.test',
      'Content-Type',
      'application/json',
      'Accept',
      'application/json, text/event-stream',
    ];
    const input = {
      target: '/mcp/web',
      method: 'POST',
      rawHeaders,
      authentication: 'bearer' as const,
    };
    assert.equal(checkProtocolIngress(input)?.status, 401);
    const bearer = [...rawHeaders, 'Authorization', 'Bearer opaque-token_1'];
    assert.equal(checkProtocolIngress({ ...input, rawHeaders: bearer }), undefined);
    assert.equal(
      ingress({ rawHeaders: [...bearer.slice(2), 'Host', '127.0.0.1:12345'] })?.status,
      403,
    );
    for (const credential of ['', 'Basic abc', 'Bearer', 'Bearer a b', 'Bearer a, Bearer b']) {
      assert.equal(
        checkProtocolIngress({ ...input, rawHeaders: [...rawHeaders, 'Authorization', credential] })
          ?.status,
        401,
      );
    }
    assert.equal(
      checkProtocolIngress({ ...input, rawHeaders: [...bearer, 'authorization', 'Bearer other'] })
        ?.status,
      401,
    );
    for (const name of [
      'Cookie',
      'Proxy-Authorization',
      'Forwarded',
      'X-Forwarded-Authorization',
    ]) {
      assert.equal(
        checkProtocolIngress({ ...input, rawHeaders: [...bearer, name, 'credential'] })?.status,
        403,
      );
    }
    assert.equal(
      checkProtocolIngress({
        ...input,
        rawHeaders: [...bearer, 'Content-Length', '1', 'Transfer-Encoding', 'chunked'],
      })?.status,
      400,
    );
    assert.equal(
      checkProtocolIngress({ ...input, rawHeaders: [...bearer, 'X-Large', 'x'.repeat(2049)] })
        ?.status,
      431,
    );
    assert.equal(
      checkProtocolIngress({ ...input, rawHeaders: bearer, target: '/mcp?access_token=opaque' })
        ?.status,
      404,
    );
  });

  it('enforces pure ingress security and fixed denial precedence', () => {
    assert.equal(ingress(), undefined);
    const base = [
      'Host',
      '127.0.0.1:12345',
      'Content-Type',
      'application/json',
      'Accept',
      'application/json, text/event-stream',
    ];
    for (const [name, value] of [
      ['Origin', 'null'],
      ['Origin', ''],
      ['Host', 'localhost:12345'],
      ['Forwarded', 'for=127.0.0.1'],
      ['X-Forwarded-Anything', 'synthetic'],
      ['Authorization', 'synthetic'],
      ['Cookie', 'synthetic'],
      ['Proxy-Authorization', 'synthetic'],
      ['x-fixture-instance', 'synthetic'],
      ['x-vona-instance-name', 'synthetic'],
    ])
      assert.equal(ingress({ rawHeaders: [...base, name!, value!] })?.status, 403);
    assert.equal(ingress({ peer: '::1' })?.status, 403);
    assert.equal(
      ingress({ rawHeaders: [...base, 'Origin', 'null'], target: '/wrong' })?.status,
      403,
    );
    assert.equal(ingress({ target: '/mcp?synthetic=1' })?.status, 404);
    assert.equal(ingress({ target: '/'.repeat(257) })?.status, 414);
    assert.equal(ingress({ method: 'GET' })?.status, 405);
    for (const fields of [
      ['X-HTTP-Method-Override', 'GET'],
      ['Content-Length', '1', 'Content-Length', '1'],
      ['Content-Length', '1', 'Transfer-Encoding', 'chunked'],
      ['Mcp-Method', 'a', 'Mcp-Method', 'b'],
    ])
      assert.equal(ingress({ rawHeaders: [...base, ...fields] })?.status, 400);
    assert.equal(
      ingress({
        rawHeaders: [
          'Host',
          '127.0.0.1:12345',
          'Content-Type',
          'text/plain',
          'Accept',
          'application/json, text/event-stream',
        ],
      })?.status,
      415,
    );
    assert.equal(
      ingress({
        rawHeaders: [
          'Host',
          '127.0.0.1:12345',
          'Content-Type',
          'application/json',
          'Accept',
          'application/json',
        ],
      })?.status,
      406,
    );
    assert.equal(ingress({ rawHeaders: [...base, 'X-Synthetic', 'a'.repeat(2049)] })?.status, 431);
  });

  it('bounds JSON bytes, fatal UTF-8 and collection structure before SDK dispatch', async () => {
    assert.equal((await parseBody(Buffer.from(JSON.stringify(rpc())))) !== undefined, true);
    await rejectsBody([]);
    await rejectsBody({ jsonrpc: '2.0', id: 1, result: {} });
    await rejectsBody({ ...rpc(), _method: 'GET' });
    await rejectsBody(rpc('fixture/probe', { text: 'a'.repeat(2049) }));
    await rejectsBody(rpc('fixture/probe', { items: Array.from({ length: 33 }).fill(0) }));
    await rejectsBody(
      rpc(
        'fixture/probe',
        Object.fromEntries(Array.from({ length: 33 }, (_, index) => [`k${index}`, 0])),
      ),
    );
    let deep: unknown = 0;
    for (let index = 0; index < 9; index++) deep = { nested: deep };
    await rejectsBody(rpc('fixture/probe', { deep }));
    for (const bytes of [Buffer.from([0xff]), Buffer.from('{'), Buffer.alloc(16 * 1024 + 1, 32)]) {
      let rejected = false;
      try {
        await parseBody(bytes);
      } catch {
        rejected = true;
      }
      assert.equal(rejected, true, 'invalid_body_rejected');
    }
  });

  it('accepts exact JSON structural and byte ceilings and rejects one beyond', async () => {
    const atBytes = Buffer.from(JSON.stringify(rpc()).padEnd(16384, ' '));
    assert.equal((await parseBody(atBytes)) !== undefined, true);
    await rejectsBody(rpc('fixture/probe', { text: 'x'.repeat(2048 + 1) }));
    assert.equal(
      (await parseBody(
        Buffer.from(JSON.stringify(rpc('fixture/probe', { text: 'x'.repeat(2048) }))),
      )) !== undefined,
      true,
    );
    const body: Record<string, unknown> = { jsonrpc: '2.0', method: 'fixture/probe', items: [] };
    // Root plus two scalar properties, one array, eight child arrays and 244
    // scalars totals exactly 256 value nodes (member names are not value nodes).
    body.items = Array.from({ length: 8 }, (_, index) =>
      Array.from({ length: index === 7 ? 27 : 31 }).fill(0),
    );
    assert.equal((await parseBody(Buffer.from(JSON.stringify(body)))) !== undefined, true);
    (body.items as number[][])[7]!.push(0);
    await rejectsBody(body);
    const shallow = { jsonrpc: '2.0', method: 'fixture/probe' };
    let exact: unknown = 0;
    // Eight containers including the root; the leaf scalar is at value depth nine.
    for (let depth = 0; depth < 7; depth++) exact = { child: exact };
    assert.equal(
      (await parseBody(Buffer.from(JSON.stringify({ ...shallow, nested: exact })))) !== undefined,
      true,
    );
    await rejectsBody({ ...shallow, nested: { child: exact } });
    // An empty ninth container still rejects, even without a depth-ten scalar.
    let emptyContainer: unknown = {};
    for (let depth = 0; depth < 7; depth++) emptyContainer = { child: emptyContainer };
    await rejectsBody({ ...shallow, nested: emptyContainer });
    const keys = Object.fromEntries(Array.from({ length: 32 }, (_, index) => [`k${index}`, 0]));
    assert.equal(
      (await parseBody(Buffer.from(JSON.stringify({ ...shallow, keys })))) !== undefined,
      true,
    );
    const arrayBoundary = { ...shallow, items: Array.from({ length: 32 }).fill(0) };
    assert.equal((await parseBody(Buffer.from(JSON.stringify(arrayBoundary)))) !== undefined, true);
    const key = 'x'.repeat(2048);
    assert.equal(
      (await parseBody(Buffer.from(JSON.stringify({ ...shallow, [key]: 0 })))) !== undefined,
      true,
    );
    await rejectsBody({ ...shallow, [`${key}x`]: 0 });
    for (const bytes of [
      Buffer.from('{"jsonrpc":"2.0","method":"a","method":"b"}'),
      Buffer.concat([atBytes, Buffer.from(' ')]),
    ]) {
      await assert.rejects(() => parseBody(bytes), 'body_boundary_rejected');
    }
  });

  it('enforces exact ingress field, value, aggregate and target ceilings', () => {
    const base = [
      'Host',
      '127.0.0.1:12345',
      'Content-Type',
      'application/json',
      'Accept',
      'application/json, text/event-stream',
    ];
    const fields = [...base];
    for (let index = 0; index < 29; index++) fields.push(`X-${index}`, 'x');
    assert.equal(ingress({ rawHeaders: fields }), undefined);
    assert.equal(ingress({ rawHeaders: [...fields, 'X-Extra', 'x'] })?.status, 431);
    assert.equal(ingress({ rawHeaders: [...base, 'X-Value', 'x'.repeat(2048)] }), undefined);
    const aggregate = [
      ...base,
      'X-A',
      'x'.repeat(2000),
      'X-B',
      'x'.repeat(2000),
      'X-C',
      'x'.repeat(2000),
      'X-D',
      'x'.repeat(2000),
      'X-E',
      '',
    ];
    const bytes =
      2 +
      aggregate.reduce((total, item) => total + Buffer.byteLength(item), 0) +
      aggregate.length * 2;
    aggregate[aggregate.length - 1] = 'x'.repeat(8192 - bytes);
    assert.equal(ingress({ rawHeaders: aggregate }), undefined);
    aggregate[aggregate.length - 1] += 'x';
    assert.equal(ingress({ rawHeaders: aggregate })?.status, 431);
    assert.equal(ingress({ target: '/'.repeat(256) })?.status, 404);
    assert.equal(ingress({ target: '/'.repeat(257) })?.status, 414);
  });

  it('bounds JSON output and fixed header staging before commitment', async () => {
    for (const size of [16384, 16385]) {
      const gate = responseGate();
      try {
        gate.response.writeHead(200, { 'content-type': 'application/json' });
        gate.response.write(boundedResult(size));
        gate.response.end();
        await gate.settle();
        assert.equal(gate.native.status, size === 16384 ? 200 : 500);
        assert.equal(Buffer.concat(gate.native.chunks).length <= 16384, true);
      } finally {
        gate.dispose();
      }
    }
    for (const count of [32, 33]) {
      const gate = responseGate();
      try {
        const headers = Object.fromEntries(
          Array.from({ length: count - 1 }, (_, index) => [`x-${index}`, 'x']),
        );
        gate.response.writeHead(200, { ...headers, 'content-type': 'application/json' });
        gate.response.end(boundedResult(100));
        await gate.settle();
        assert.equal(gate.native.status, count === 32 ? 200 : 500);
      } finally {
        gate.dispose();
      }
    }
    for (const size of [2048, 2049]) {
      const gate = responseGate();
      try {
        gate.response.writeHead(200, {
          'content-type': 'application/json',
          'x-value': 'x'.repeat(size),
        });
        gate.response.end(boundedResult(100));
        await gate.settle();
        assert.equal(gate.native.status, size === 2048 ? 200 : 500);
      } finally {
        gate.dispose();
      }
    }
    for (const size of [8192, 8193]) {
      const gate = responseGate();
      try {
        const headers = {
          'content-type': 'application/json',
          'x-a': 'x'.repeat(2000),
          'x-b': 'x'.repeat(2000),
          'x-c': 'x'.repeat(2000),
          'x-d': 'x'.repeat(2000),
          'x-e': '',
        };
        const base =
          Buffer.byteLength('HTTP/1.1 200 OK\r\n') +
          2 +
          Object.entries(headers).reduce(
            (total, [key, value]) => total + Buffer.byteLength(key) + Buffer.byteLength(value) + 4,
            0,
          );
        headers['x-e'] = 'x'.repeat(size - base);
        gate.response.writeHead(200, headers);
        gate.response.end(boundedResult(100));
        await gate.settle();
        assert.equal(gate.native.status, size === 8192 ? 200 : 500);
      } finally {
        gate.dispose();
      }
    }
  });

  it('bounds SSE frames and incomplete buffers and observes native drain', async () => {
    const prefix = 'event: message\ndata: ';
    for (const count of [8, 9]) {
      const gate = responseGate();
      try {
        gate.response.writeHead(200, { 'content-type': 'text/event-stream' });
        const frame = `${prefix}${boundedResult(2048 - Buffer.byteLength(prefix) - 2)}\n\n`;
        for (let index = 0; index < count; index++) {
          gate.response.write(frame);
          await gate.settle();
        }
        gate.response.end();
        assert.equal(gate.native.chunks.length, 8);
        assert.equal(Buffer.concat(gate.native.chunks).length, 16384);
        assert.equal(gate.native.destroyed, count === 9);
      } finally {
        gate.dispose();
      }
    }
    const incomplete = responseGate();
    try {
      incomplete.response.writeHead(200, { 'content-type': 'text/event-stream' });
      incomplete.response.write('x'.repeat(2048));
      await incomplete.settle();
      assert.equal(incomplete.native.headersSent, false);
      incomplete.response.write('x');
      await incomplete.settle();
      assert.equal(incomplete.native.status, 500);
    } finally {
      incomplete.dispose();
    }
    for (const drain of [true, false]) {
      const gate = responseGate();
      try {
        gate.native.block = true;
        gate.response.writeHead(200, { 'content-type': 'text/event-stream' });
        gate.response.write(`${prefix}${boundedResult(100)}\n\n`);
        let settled = false;
        const task = gate.settle().then(() => {
          settled = true;
        });
        await new Promise<void>(resolve => setImmediate(resolve));
        assert.equal(settled, false, 'native_drain_is_awaited');
        if (drain) {
          gate.native.writableNeedDrain = false;
          gate.native.emit('drain');
        }
        await task;
        assert.equal(gate.native.destroyed, !drain);
      } finally {
        gate.dispose();
      }
    }
  });
});
