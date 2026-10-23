import type { OutgoingHttpHeaders } from 'node:http';

import assert from 'node:assert/strict';
import { request } from 'node:http';
import { after, before, describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { acquireTestLock, app } from 'vona-mock';
import { fixtureIngressLimits } from 'vona-module-cabloy-mcp';

import { closeDevTransport, devTransportSnapshot } from '../src/lib/mcpTransport.ts';
import { ServiceCatalog } from '../src/service/catalog.ts';

const version = '2026-07-28';
const categoriesName = 'commerce_categories_list';
const searchName = 'commerce_products_search';
const detailName = 'commerce_product_detail';
let port: number;

function openHttp(
  options: {
    target?: string;
    method?: string;
    headers?: OutgoingHttpHeaders;
    body?: string;
    partial?: boolean;
  } = {},
) {
  const body = options.body ?? '';
  const req = request({
    hostname: '127.0.0.1',
    port,
    path: options.target ?? '/mcp',
    method: options.method ?? 'POST',
    agent: false,
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json, text/event-stream',
      'connection': 'close',
      'content-length': Buffer.byteLength(body),
      ...options.headers,
    },
  });
  const response = new Promise<{ status: number; body: any }>((resolve, reject) => {
    const timer = setTimeout(() => req.destroy(new Error('Dev MCP HTTP timeout')), 15000);
    req.once('error', error => {
      clearTimeout(timer);
      reject(error);
    });
    req.once('response', res => {
      const chunks: Buffer[] = [];
      let size = 0;
      res.on('data', (chunk: Buffer) => {
        size += chunk.length;
        if (size > 1024 * 1024) res.destroy(new Error('Dev MCP response limit'));
        else chunks.push(chunk);
      });
      res.once('error', error => {
        clearTimeout(timer);
        reject(error);
      });
      res.once('end', () => {
        clearTimeout(timer);
        try {
          const text = Buffer.concat(chunks).toString('utf8');
          resolve({ status: res.statusCode!, body: text ? JSON.parse(text) : undefined });
        } catch (error) {
          reject(error);
        }
      });
    });
  });
  void response.catch(() => {});
  if (options.partial) req.write(body);
  else req.end(body);
  return { req, response };
}

async function waitFor(predicate: () => boolean) {
  const deadline = Date.now() + 5000;
  while (!predicate()) {
    assert.ok(Date.now() < deadline, 'dev exchange actually settled');
    await delay(5);
  }
}

async function send(
  method: string,
  params: Record<string, unknown> = {},
  options: { target?: string; headers?: OutgoingHttpHeaders; legacy?: boolean } = {},
) {
  const response = await openHttp({
    target: options.target,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params: options.legacy
        ? params
        : {
            ...params,
            _meta: {
              'io.modelcontextprotocol/protocolVersion': version,
              'io.modelcontextprotocol/clientCapabilities': {},
            },
          },
    }),
    headers: {
      ...(options.legacy
        ? method === 'initialize'
          ? {}
          : {
              'mcp-protocol-version': '2025-11-25',
            }
        : {
            'mcp-protocol-version': version,
            'mcp-method': method,
            ...(typeof params.name === 'string' ? { 'mcp-name': params.name } : {}),
          }),
      ...options.headers,
    },
  }).response;
  if (response.status !== 429) await waitFor(() => !devTransportSnapshot(app)?.active);
  return response;
}

function output(response: Awaited<ReturnType<typeof send>>) {
  assert.equal(response.status, 200);
  assert.equal(response.body.error, undefined);
  assert.notEqual(response.body.result.isError, true);
  const result = response.body.result;
  assert.deepEqual(result.content, [
    { type: 'text', text: JSON.stringify(result.structuredContent) },
  ]);
  return result.structuredContent;
}

// The root managed test runner owns this listener and disposable instance state.
// No test creates another application/listener or changes global origin configuration.
describe('devHttp.test.ts', { concurrency: false, timeout: 60000 }, () => {
  let release: (() => void) | undefined;
  before(async () => {
    assert.ok(app.server?.listening, 'managed application listener must be enabled');
    const address = app.server.address();
    assert.ok(address && typeof address === 'object');
    port = address.port;
    release = await acquireTestLock('mcp-test');
  });
  after(() => release?.());

  it('shares discovery, modern/legacy three-tool flows and ordinary catalog routes on one listener', async () => {
    const server = app.server;
    const discovered = await send('server/discover');
    assert.equal(discovered.status, 200);
    assert.deepEqual(discovered.body.result.supportedVersions, [version]);
    for (const legacy of [false, true]) {
      if (legacy) {
        const initialized = await send(
          'initialize',
          {
            protocolVersion: '2025-11-25',
            capabilities: {},
            clientInfo: { name: 'dev-http-test', version: '1' },
          },
          { legacy },
        );
        assert.equal(initialized.status, 200);
        assert.equal(initialized.body.result.protocolVersion, '2025-11-25');
      }
      const listed = await send('tools/list', {}, { legacy });
      assert.equal(listed.status, 200);
      assert.deepEqual(
        listed.body.result.tools.map((tool: any) => tool.name),
        [searchName, detailName, categoriesName],
      );
      const call = async (name: string, args: Record<string, unknown>) =>
        output(await send('tools/call', { name, arguments: args }, { legacy }));
      const categories = await call(categoriesName, {});
      const electronics = categories.list.find((item: any) => item.name === 'Electronics');
      assert.ok(electronics);
      const search = await call(searchName, {
        categoryId: electronics.id,
        title: 'Wireless Headphones',
      });
      assert.equal(search.list.length, 1);
      const detail = await call(detailName, { id: search.list[0].id });
      assert.equal(detail.id, search.list[0].id);
      assert.equal(detail.categoryId, electronics.id);
      assert.equal(detail.priceCents, 9999);
      assert.equal(detail.available, 11);
    }
    const ordinary = await openHttp({
      method: 'GET',
      target: `${app.config.server.globalPrefix}/mcp/test/catalog/categories`,
    }).response;
    assert.equal(ordinary.status, 200);
    assert.ok(
      JSON.stringify(ordinary.body).includes('Electronics'),
      'ordinary router remains active',
    );
    assert.equal(app.server, server);
    assert.ok(app.server?.listening, 'per-request cleanup does not close shared server');
  });

  it('uses optional instanceName and framework query/header fallback without leaking default fixture data', async () => {
    const params = { name: categoriesName, arguments: {} };
    for (const target of ['/mcp', '/mcp?instanceName=']) {
      assert.ok(output(await send('tools/call', params, { target })).list.length > 0);
    }
    const queryField = app.config.instance.queryField!;
    const headerField = app.config.instance.headerField!;
    for (const options of [
      { target: '/mcp?instanceName=shareTest' },
      { target: `/mcp?${encodeURIComponent(queryField)}=shareTest` },
      { headers: { [headerField]: 'shareTest' } },
      { target: '/mcp?instanceName=', headers: { [headerField]: 'shareTest' } },
    ]) {
      const categories = output(await send('tools/call', params, options));
      assert.deepEqual(categories.list, []);
      assert.equal(categories.total, '0');
    }
    const products = output(await send('tools/call', { name: searchName, arguments: {} }));
    const absent = await send(
      'tools/call',
      {
        name: detailName,
        arguments: { id: products.list[0].id },
      },
      { target: '/mcp?instanceName=shareTest' },
    );
    assert.equal(absent.status, 200);
    assert.equal(absent.body.result.isError, true);
    assert.equal(absent.body.result.structuredContent, undefined);
    assert.deepEqual(absent.body.result.content, [{ type: 'text', text: 'Product not found' }]);
    assert.equal(
      (await send('tools/call', params, { target: '/mcp?instanceName=unconfigured' })).status,
      423,
    );
    assert.equal(
      (await send('tools/call', params, { headers: { [headerField]: 'null' } })).status,
      403,
    );
    assert.ok(output(await send('tools/call', params)).list.length > 0);
  });

  it('allows nonlocal authority while retaining protocol guards and cancellation ownership', async () => {
    for (const headers of [
      { host: `dev.example.test:${port}` },
      { origin: 'https://client.example.test' },
      { host: 'dev.example.test', origin: 'https://client.example.test' },
    ]) {
      // Explicit scope isolates ingress policy from normal host-based instance resolution.
      assert.equal(
        (await send('tools/list', {}, { headers, target: '/mcp?instanceName=shareTest' })).status,
        200,
      );
    }
    for (const [options, status] of [
      [{ headers: { forwarded: 'for=192.0.2.1' } }, 403],
      [{ headers: { authorization: 'synthetic-forbidden' } }, 403],
      [{ target: '/mcp?instanceName=shareTest&instanceName=' }, 400],
      [{ target: '/mcp?unexpected=1' }, 400],
    ] as const) {
      assert.equal((await send('tools/list', {}, options)).status, status);
    }
    const instanceHeader = app.config.instance.headerField;
    assert.ok(instanceHeader);
    assert.equal(
      (await send('tools/list', {}, { headers: { [instanceHeader]: ['shareTest', 'shareTest'] } }))
        .status,
      400,
    );
    assert.equal(
      (
        await send(
          'tools/list',
          {},
          {
            headers: { [instanceHeader]: 'x'.repeat(fixtureIngressLimits.headerValueBytes + 1) },
          },
        )
      ).status,
      431,
    );
    const pending = openHttp({ body: '{', partial: true, headers: { 'content-length': '100' } });
    try {
      await waitFor(() => devTransportSnapshot(app)?.active === 1);
      assert.equal((await send('tools/list')).status, 429);
    } finally {
      pending.req.destroy();
      await waitFor(() => !devTransportSnapshot(app)?.active);
    }
    assert.equal((await send('tools/list')).status, 200);
    assert.ok(app.server?.listening);
  });

  it('drains actual app-owned tool work without closing the shared listener', async t => {
    let resume!: () => void;
    const barrier = new Promise<void>(resolve => {
      resume = resolve;
    });
    let entered = false;
    let workFinished = false;
    const original = ServiceCatalog.prototype.selectPublic;
    const held = t.mock.method(
      ServiceCatalog.prototype,
      'selectPublic',
      async function (this: ServiceCatalog, ...args: Parameters<ServiceCatalog['selectPublic']>) {
        entered = true;
        await barrier;
        try {
          return await original.apply(this, args);
        } finally {
          workFinished = true;
        }
      },
    );
    const pending = send('tools/call', {
      name: searchName,
      arguments: { title: 'Wireless Headphones' },
    });
    try {
      await waitFor(() => entered);
      let closed = false;
      const closure = closeDevTransport(app).then(() => {
        closed = true;
      });
      await delay(25);
      assert.equal(closed, false, 'transport cancellation is not actual work settlement');
      assert.equal(workFinished, false);
      assert.equal(devTransportSnapshot(app)?.active, 1);
      resume();
      await closure;
      assert.equal(workFinished, true);
      assert.equal((await pending).status, 503);
      assert.equal(devTransportSnapshot(app)?.active, 0);
      assert.equal(devTransportSnapshot(app)?.closing, true);
      assert.equal((await send('tools/list')).status, 503);
      assert.ok(app.server?.listening);
      assert.equal(
        (
          await openHttp({
            method: 'GET',
            target: `${app.config.server.globalPrefix}/mcp/test/catalog/categories`,
          }).response
        ).status,
        200,
      );
    } finally {
      resume();
      try {
        await closeDevTransport(app);
        await pending;
      } finally {
        held.mock.restore();
      }
    }
  });
});
