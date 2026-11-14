import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'node:http';
import type { IMiddlewareSystemOptionsAggregate } from 'vona-module-a-ratelimit';

import assert from 'node:assert/strict';
import { request } from 'node:http';
import { after, before, describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { acquireTestLock, app } from 'vona-mock';
import { $schema } from 'vona-module-a-openapiutils';
import { ServiceRateLimit } from 'vona-module-a-ratelimit';

import { AopMethodLog } from '../../../../../suite-vendor/a-vona/modules/a-logger/src/bean/aopMethod.log.ts';
import { DtoCategoryPublicSelectRes } from '../src/dto/categoryPublicSelectRes.tsx';
import { DtoProductPublicDetail } from '../src/dto/productPublicDetail.tsx';
import { DtoProductPublicSelectRes } from '../src/dto/productPublicSelectRes.tsx';
import { startLocalTransport } from '../src/lib/localTransport.ts';
import { ServiceCatalog } from '../src/service/catalog.ts';

const version = '2026-07-28';
const searchName = 'commerce_products_search';
const detailName = 'commerce_product_detail';
const categoryName = 'commerce_categories_list';
type LocalTransport = Awaited<ReturnType<typeof startLocalTransport>>;
type HttpResult = { status: number; headers: IncomingHttpHeaders; text: string };

// Native HTTP preserves the exact target and permits a deliberately unfinished body.
// Both time and accumulated response bytes are bounded; no pooled sockets survive.
function openHttp(
  url: string,
  options: {
    method?: string;
    target?: string;
    headers?: OutgoingHttpHeaders;
    body?: string;
    partial?: boolean;
  } = {},
) {
  const endpoint = new URL(url);
  const body = options.body ?? '';
  const headers: OutgoingHttpHeaders = {
    'content-type': 'application/json',
    'accept': 'application/json, text/event-stream',
    'connection': 'close',
    'content-length': Buffer.byteLength(body),
    ...options.headers,
  };
  for (const name of Object.keys(headers)) {
    if (headers[name] === undefined) delete headers[name];
  }
  const req = request({
    hostname: endpoint.hostname,
    port: endpoint.port,
    path: options.target ?? endpoint.pathname,
    method: options.method ?? 'POST',
    agent: false,
    headers,
  });
  const response = new Promise<HttpResult>((resolve, reject) => {
    const timer = setTimeout(() => req.destroy(new Error('HTTP test response timeout')), 15000);
    let receivedResponse = false;
    req.once('error', error => {
      clearTimeout(timer);
      reject(error);
    });
    req.once('close', () => {
      if (!receivedResponse) {
        clearTimeout(timer);
        reject(new Error('HTTP test request closed before response'));
      }
    });
    req.once('response', res => {
      receivedResponse = true;
      const chunks: Buffer[] = [];
      let size = 0;
      res.on('data', (chunk: Buffer) => {
        size += chunk.byteLength;
        if (size > 1024 * 1024) {
          res.destroy(new Error('HTTP test response byte limit'));
          req.destroy();
        } else {
          chunks.push(chunk);
        }
      });
      res.once('error', error => {
        clearTimeout(timer);
        reject(error);
      });
      res.once('end', () => {
        clearTimeout(timer);
        resolve({
          status: res.statusCode!,
          headers: res.headers,
          text: Buffer.concat(chunks).toString('utf8'),
        });
      });
    });
  });
  // A cancellation test may destroy the request before awaiting its response.
  void response.catch(() => {});
  if (options.partial) req.write(body);
  else req.end(body);
  return { req, response };
}

function rpc(method: string, params: Record<string, unknown> = {}, id = 1) {
  return {
    body: JSON.stringify({
      jsonrpc: '2.0',
      id,
      method,
      params: {
        ...params,
        _meta: {
          'io.modelcontextprotocol/protocolVersion': version,
          'io.modelcontextprotocol/clientCapabilities': {},
        },
      },
    }),
    headers: {
      'mcp-protocol-version': version,
      'mcp-method': method,
      ...(typeof params.name === 'string' ? { 'mcp-name': params.name } : {}),
    },
  };
}

async function waitFor(predicate: () => boolean, message: string) {
  const deadline = Date.now() + 5000;
  while (!predicate()) {
    assert.ok(Date.now() < deadline, message);
    await delay(5);
  }
}

function legacyRpc(method: string, params: Record<string, unknown> = {}, id = 1) {
  return {
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
    headers: method === 'initialize' ? {} : { 'mcp-protocol-version': '2025-11-25' },
  };
}

async function send(
  local: LocalTransport,
  method: string,
  params?: Record<string, unknown>,
  legacy = false,
) {
  const response = await openHttp(local.url, (legacy ? legacyRpc : rpc)(method, params)).response;
  // Native response end can precede executor/SDK cleanup and slot release.
  await waitFor(() => local.snapshot().active === 0, 'HTTP request actually settled');
  assert.equal(response.headers['content-type'], 'application/json');
  assert.equal(response.headers['cache-control'], 'no-store');
  return { ...response, body: JSON.parse(response.text) };
}

function jsonWire(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}

function toolOutput(response: Awaited<ReturnType<typeof send>>, legacy = false) {
  assert.equal(response.status, 200);
  assert.equal(response.body.error, undefined);
  assert.equal(response.headers['mcp-session-id'], undefined);
  assert.equal(response.body.result.resultType, legacy ? undefined : 'complete');
  assert.notEqual(response.body.result.isError, true);
  assert.deepEqual(response.body.result.content, [
    { type: 'text', text: JSON.stringify(response.body.result.structuredContent) },
  ]);
  return response.body.result.structuredContent;
}

describe('localHttp.test.ts', { concurrency: false, timeout: 60000 }, () => {
  let release: (() => void) | undefined;
  before(async () => {
    assert.ok(app.meta.modules['test-mcp'], 'fixture module is loaded');
    assert.ok(app.meta.modules['cabloy-mcp'], 'core module is loaded');
    if ((process.env.PROJECT_DISABLED_SUITES ?? '').split(',').includes('a-commerce')) {
      assert.deepEqual(
        Object.keys(app.meta.modules).filter(
          name => name.startsWith('commerce-') || name === 'test-pay',
        ),
        [],
        'disabled Commerce modules are absent from the actual runtime composition',
      );
    }
    release = await acquireTestLock('test-mcp');
  });
  after(() => release?.());

  it('discovers the modern server and all three DTO-backed tools without the default app listener', async () => {
    assert.equal(app.config.server.listen.disable, true);
    assert.equal(app.server === undefined, true);
    const local = await startLocalTransport(app);
    try {
      assert.deepEqual(local.snapshot(), {
        active: 0,
        contexts: 0,
        settled: 0,
        closing: false,
      });
      const discovered = await send(local, 'server/discover');
      assert.equal(discovered.status, 200);
      assert.equal(discovered.body.error, undefined);
      assert.deepEqual(discovered.body.result.supportedVersions, [version]);
      assert.deepEqual(discovered.body.result.capabilities, { tools: {} });
      const listed = await send(local, 'tools/list');
      assert.equal(listed.status, 200);
      assert.equal(listed.body.error, undefined);
      for (const response of [discovered, listed]) {
        assert.equal(response.body.result.resultType, 'complete');
        // SDK defaults, not an application-level public-cache policy.
        assert.equal(response.body.result.cacheScope, 'private');
        assert.equal(response.body.result.ttlMs, 0);
        assert.deepEqual(response.body.result._meta['io.modelcontextprotocol/serverInfo'], {
          name: 'cabloy-mcp-business',
          version: '0.1.0',
        });
        assert.equal(response.headers['mcp-session-id'], undefined);
      }
      const [search, detail, categories] = listed.body.result.tools;
      assert.deepEqual(
        listed.body.result.tools.map((tool: any) => tool.name),
        [searchName, detailName, categoryName],
      );
      assert.equal(search.inputSchema.additionalProperties, false);
      assert.equal(search.inputSchema.properties.pageSize.maximum, 100);
      assert.equal(search.outputSchema.properties.total.type, 'string');
      assert.deepEqual(Object.keys(detail.inputSchema.properties), ['id']);
      assert.deepEqual(detail.inputSchema.required, ['id']);
      assert.equal(detail.inputSchema.additionalProperties, false);
      assert.ok(detail.outputSchema.properties.descriptionHtml);
      assert.deepEqual(Object.keys(categories.inputSchema.properties).sort(), [
        'pageNo',
        'pageSize',
      ]);
      assert.equal(categories.inputSchema.additionalProperties, false);
      assert.equal(categories.inputSchema.properties.pageNo.type, 'integer');
      assert.equal(categories.inputSchema.properties.pageNo.minimum, 1);
      assert.equal(categories.inputSchema.properties.pageNo.default, 1);
      assert.equal(categories.inputSchema.properties.pageSize.type, 'integer');
      assert.equal(categories.inputSchema.properties.pageSize.minimum, 1);
      assert.equal(categories.inputSchema.properties.pageSize.default, 20);
      assert.equal(categories.inputSchema.properties.pageSize.maximum, 100);
      assert.equal(categories.outputSchema.properties.total.type, 'string');
      for (const tool of [search, detail, categories]) {
        assert.equal(tool.annotations.readOnlyHint, true);
        assert.ok(tool.outputSchema.$defs);
      }
      assert.deepEqual(local.snapshot(), {
        active: 0,
        contexts: 2,
        settled: 2,
        closing: false,
      });
      assert.equal(app.server === undefined, true);
    } finally {
      await local.close();
    }
  });

  it('applies configured aggregate admission once per local HTTP request before tool dispatch, preserving disabled defaults and observe behavior', async t => {
    const local = await startLocalTransport(app);
    const host = new URL(local.url).host;
    const ownsRequest = () => app.ctx?.req.headers.host === host;
    const middlewareSystem = app.bean.onion.middlewareSystem;
    const originalOptions = middlewareSystem.getOnionOptions;
    const originalAdmission = ServiceRateLimit.prototype.admitAggregate;
    const executor = app.bean.executor;
    const originalAction = executor.performAction;
    let options: IMiddlewareSystemOptionsAggregate | undefined;
    let admissions = 0;
    let commands = 0;
    let dispatched = 0;
    let unavailable = false;
    const paths: string[] = [];
    const keys: string[] = [];
    // Reuse the real service's validation, aggregate key and result calculation.
    // Only this listener's Redis command is deterministic; other callers stay real.
    const service = app.bean._newBean(ServiceRateLimit);
    Object.defineProperty(service, 'bean', {
      value: {
        redis: {
          get: () => ({
            async rateLimitAdmit(key: string, windowMs: string) {
              commands++;
              keys.push(key);
              assert.equal(windowMs, '1000');
              if (unavailable) throw new Error('LOCAL_AGGREGATE_REDIS_DIAGNOSTIC');
              return [commands, 1250];
            },
          }),
        },
      },
    });
    const configured = t.mock.method(
      middlewareSystem,
      'getOnionOptions',
      function (...args: Parameters<typeof originalOptions>) {
        if (ownsRequest() && app.ctx.path === '/mcp' && args[0] === 'a-ratelimit:aggregate') {
          return options ?? originalOptions.apply(middlewareSystem, args);
        }
        return originalOptions.apply(middlewareSystem, args);
      },
    );
    const admitted = t.mock.method(
      ServiceRateLimit.prototype,
      'admitAggregate',
      function (this: ServiceRateLimit, ...args: Parameters<ServiceRateLimit['admitAggregate']>) {
        if (!ownsRequest()) return originalAdmission.apply(this, args);
        admissions++;
        paths.push(app.ctx.path);
        assert.equal(args[0], options?.rateLimit, 'one configured shared policy, not a tool quota');
        return originalAdmission.apply(service, args);
      },
    );
    const action = t.mock.method(
      executor,
      'performAction',
      function (...args: Parameters<typeof originalAction>) {
        if (ownsRequest()) dispatched++;
        return originalAction.apply(executor, args);
      },
    );
    try {
      assert.equal(originalOptions.call(middlewareSystem, 'a-ratelimit:aggregate')?.enable, false);
      assert.equal(
        app.bean.onion.interceptor.getOnionOptions('a-ratelimit:rateLimit')?.enable,
        false,
        'identity/tool quotas are not implicitly enabled by aggregate admission',
      );
      toolOutput(
        await send(local, 'tools/call', {
          name: searchName,
          arguments: { title: 'Wireless Headphones', pageSize: 1 },
        }),
      );
      assert.equal(admissions, 0, 'disabled aggregate does not contact its service');
      assert.equal(commands, 0);
      assert.equal(dispatched, 1);
      for (const selector of [{ match: '/not-mcp' }, { ignore: '/mcp' }]) {
        options = { enable: true, ...selector, rateLimit: { mode: 'enforce', limit: 4 } };
        assert.equal((await send(local, 'tools/list')).status, 200);
        assert.equal(
          admissions,
          0,
          'configured path selectors also apply to the dedicated listener',
        );
      }

      options = { enable: true, rateLimit: { mode: 'enforce', limit: 4 } };
      assert.equal((await send(local, 'server/discover')).status, 200);
      assert.equal(admissions, 1);
      assert.equal((await send(local, 'tools/list')).status, 200);
      assert.equal(admissions, 2);
      toolOutput(
        await send(local, 'tools/call', { name: categoryName, arguments: { pageSize: 1 } }),
      );
      assert.equal(admissions, 3);
      toolOutput(
        await send(local, 'tools/call', {
          name: searchName,
          arguments: { title: 'Wireless Headphones', pageSize: 1 },
        }),
      );
      assert.equal(admissions, 4, 'controller dispatch does not admit the accepted request twice');
      assert.equal(dispatched, 3);
      for (const legacy of [false, true]) {
        const denied = await send(
          local,
          'tools/call',
          {
            name: legacy ? categoryName : searchName,
            arguments: { pageSize: 1 },
          },
          legacy,
        );
        assert.equal(denied.status, 429);
        assert.equal(denied.headers['retry-after'], '2');
        assert.equal(denied.headers['ratelimit-limit'], undefined);
        assert.equal(denied.headers['mcp-session-id'], undefined);
        assert.deepEqual(denied.body, {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32000,
            message: 'Too Many Requests',
            data: { kind: 'rate_limit', status: 429, limit: 4, retryAfterSeconds: 2 },
          },
        });
        assert.equal(dispatched, 3, 'aggregate rejection never reaches a controller action');
      }
      assert.equal(admissions, 6, 'discovery, list and different tools consume the same budget');

      options = { enable: true, rateLimit: { mode: 'observe', limit: 1 } };
      toolOutput(
        await send(local, 'tools/call', { name: categoryName, arguments: { pageSize: 1 } }),
      );
      assert.equal(admissions, 7, 'observe still counts an over-budget request');
      assert.equal(dispatched, 4, 'observe does not reject an exhausted budget');
      unavailable = true;
      const observed = await send(local, 'tools/call', {
        name: searchName,
        arguments: { title: 'Wireless Headphones', pageSize: 1 },
      });
      toolOutput(observed);
      assert.equal(observed.headers['retry-after'], undefined);
      assert.equal(admissions, 8);
      assert.equal(dispatched, 5, 'observe fails open on Redis unavailability');

      options = { enable: true, rateLimit: { mode: 'enforce', limit: 4 } };
      for (const legacy of [false, true]) {
        const denied = await send(
          local,
          'tools/call',
          {
            name: searchName,
            arguments: { pageSize: 1 },
          },
          legacy,
        );
        assert.equal(denied.status, 503);
        assert.equal(denied.headers['retry-after'], undefined);
        assert.equal(denied.headers['mcp-session-id'], undefined);
        assert.deepEqual(denied.body, {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32000,
            message: 'Service Unavailable',
            data: { kind: 'rate_limit_unavailable', status: 503 },
          },
        });
        assert.equal(denied.text.includes('LOCAL_AGGREGATE_REDIS_DIAGNOSTIC'), false);
        assert.equal(dispatched, 5, 'unavailable admission never dispatches a tool');
      }
      assert.equal(admissions, 10);
      assert.equal(commands, admissions, 'exactly one Redis admission command per enabled request');
      assert.equal(paths.length, admissions);
      assert.ok(paths.every(path => path === '/mcp'));
      assert.ok(keys.every(key => /^rate-limit:aggregate:v1:\d+$/.test(key)));
      assert.deepEqual(local.snapshot(), {
        active: 0,
        contexts: 13,
        settled: 13,
        closing: false,
      });
    } finally {
      try {
        await local.close();
      } finally {
        action.mock.restore();
        admitted.mock.restore();
        configured.mock.restore();
      }
    }
  });

  it('accepts nonempty native capabilities and continuous initialize/acknowledge/list without retries', async () => {
    const local = await startLocalTransport(app);
    try {
      const initialized = await openHttp(
        local.url,
        legacyRpc(
          'initialize',
          {
            protocolVersion: '2025-11-25',
            capabilities: { roots: { listChanged: true }, sampling: {}, elicitation: {} },
            clientInfo: { name: 'native-capability-test', version: '1' },
          },
          0,
        ),
      ).response;
      assert.equal(initialized.status, 200);
      assert.equal(JSON.parse(initialized.text).id, 0);
      assert.equal(JSON.parse(initialized.text).error, undefined);
      assert.equal(initialized.headers['mcp-session-id'], undefined);
      const notification = await openHttp(local.url, {
        body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
        headers: { 'mcp-protocol-version': '2025-11-25' },
      }).response;
      assert.equal(notification.status, 202);
      assert.equal(notification.text, '');
      const listed = await openHttp(local.url, legacyRpc('tools/list')).response;
      assert.equal(listed.status, 200);
      assert.deepEqual(
        JSON.parse(listed.text).result.tools.map((tool: any) => tool.name),
        [searchName, detailName, categoryName],
      );
      assert.equal(listed.headers['mcp-session-id'], undefined);
      const malformed = await openHttp(
        local.url,
        legacyRpc(
          'initialize',
          {
            protocolVersion: '2025-11-25',
            capabilities: { roots: { listChanged: 'true' } },
            clientInfo: { name: 'native-capability-test', version: '1' },
          },
          0,
        ),
      ).response;
      // Native spec-handler validation throws a plain Error, mapped by the SDK
      // to -32603; the local boundary removes its validation diagnostics.
      assert.equal(malformed.status, 200);
      assert.deepEqual(JSON.parse(malformed.text), {
        jsonrpc: '2.0',
        id: 0,
        error: { code: -32603, message: 'Internal error' },
      });
    } finally {
      await local.close();
    }
  });

  for (const legacy of [false, true]) {
    it(`${legacy ? 'legacy' : 'modern'}: categories → returned IDs → search/detail with DTO/text projection, strict inputs and scoped absence`, async t => {
      const warnings = t.mock.method(console, 'warn');
      const local = await startLocalTransport(app);
      const exchange = (method: string, params?: Record<string, unknown>) =>
        send(local, method, params, legacy);
      const output = (response: Awaited<ReturnType<typeof send>>) => toolOutput(response, legacy);
      try {
        if (legacy) {
          const initialized = await exchange('initialize', {
            protocolVersion: '2025-11-25',
            capabilities: {},
            clientInfo: { name: 'local-http-test', version: '1' },
          });
          assert.equal(initialized.status, 200);
          assert.equal(initialized.body.error, undefined);
          assert.equal(initialized.body.result.protocolVersion, '2025-11-25');
          assert.deepEqual(initialized.body.result.capabilities, { tools: {} });
          assert.deepEqual(initialized.body.result.serverInfo, {
            name: 'cabloy-mcp-business',
            version: '0.1.0',
          });
          assert.equal(initialized.headers['mcp-session-id'], undefined);
          const notification = await openHttp(local.url, {
            body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
            headers: { 'mcp-protocol-version': '2025-11-25' },
          }).response;
          await waitFor(() => local.snapshot().active === 0, 'initialized acknowledgement settled');
          assert.equal(notification.status, 202);
          assert.equal(notification.text, '');
          assert.equal(notification.headers['cache-control'], 'no-store');
          assert.equal(notification.headers['mcp-session-id'], undefined);
          assert.equal(notification.headers['content-type'], undefined);
          const listed = await exchange('tools/list');
          assert.equal(listed.status, 200);
          assert.deepEqual(
            listed.body.result.tools.map((tool: any) => tool.name),
            [searchName, detailName, categoryName],
          );
          assert.equal(listed.headers['mcp-session-id'], undefined);
          const contexts = local.snapshot().contexts;
          for (const headers of [
            { authorization: 'synthetic-forbidden' },
            { 'x-vona-instance-name': 'shareTest' },
          ]) {
            const denied = await openHttp(local.url, {
              ...legacyRpc('tools/list'),
              headers,
            }).response;
            assert.equal(denied.status, 403);
            assert.equal(local.snapshot().contexts, contexts);
          }
        }
        const categoryArgs = { pageNo: 1, pageSize: 20 };
        const categories = output(
          await exchange('tools/call', { name: categoryName, arguments: categoryArgs }),
        );
        assert.equal(categories.pageNo, categoryArgs.pageNo);
        assert.equal(categories.pageSize, categoryArgs.pageSize);
        assert.equal(typeof categories.total, 'string');
        for (const category of categories.list) {
          assert.deepEqual(
            Object.keys(category).sort(),
            category.description === undefined ? ['id', 'name'] : ['description', 'id', 'name'],
          );
        }
        assert.ok(categories.list.some((category: any) => category.name === 'Empty'));
        const electronics = categories.list.find(
          (category: any) => category.name === 'Electronics',
        );
        assert.ok(electronics, 'read-only static fixture provides the stocked category');
        const args = {
          title: 'Wireless Headphones',
          categoryId: electronics.id,
          pageNo: 1,
          pageSize: 1,
        };
        const search = output(await exchange('tools/call', { name: searchName, arguments: args }));
        assert.equal(search.list.length, 1);
        assert.equal(search.list[0].title, args.title);
        assert.equal(search.list[0].categoryId, electronics.id);
        assert.equal(typeof search.total, 'string');
        const id = search.list[0].id;
        const detail = output(
          await exchange('tools/call', { name: detailName, arguments: { id } }),
        );
        assert.equal(detail.id, id);
        assert.equal(detail.categoryId, electronics.id);
        assert.equal(detail.title, args.title);
        const absentId = String(Number.MAX_SAFE_INTEGER);
        // Direct expectations and service reads own their ordinary scoped context.
        await app.bean.executor.mockCtx(
          async () => {
            const directCategories = await app.bean.executor.performAction(
              'get',
              '/mcp/test/catalog/categories',
              { query: categoryArgs, innerAccess: false },
            );
            assert.deepEqual(
              categories,
              jsonWire(await $schema(DtoCategoryPublicSelectRes).parseAsync(directCategories)),
            );
            const directSearch = await app.bean.executor.performAction(
              'get',
              '/mcp/test/catalog/products',
              { query: args, innerAccess: false },
            );
            const directDetail = await app.bean.executor.performAction(
              'get',
              '/mcp/test/catalog/products/:id',
              { params: { id }, innerAccess: false },
            );
            assert.deepEqual(
              search,
              jsonWire(await $schema(DtoProductPublicSelectRes).parseAsync(directSearch)),
            );
            assert.deepEqual(
              detail,
              jsonWire(await $schema(DtoProductPublicDetail).parseAsync(directDetail)),
            );
            assert.equal(
              await app.bean._getBean(ServiceCatalog).findPublicById(absentId),
              undefined,
            );
          },
          { instanceName: '', dbInfo: { level: 0 } },
        );
        assert.deepEqual(Object.keys(search).sort(), [
          'list',
          'pageCount',
          'pageNo',
          'pageSize',
          'total',
        ]);
        assert.deepEqual(Object.keys(search.list[0]).sort(), [
          'available',
          'categoryId',
          'categoryName',
          'description',
          'id',
          'priceCents',
          'skuAvailables',
          'title',
        ]);
        assert.equal(detail.descriptionHtml, '<p>Synthetic wireless audio</p>');
        assert.ok(detail.skuAvailables.length > 0);
        for (const product of [search.list[0], detail]) {
          assert.equal(product.iid, undefined);
          assert.equal(product.published, undefined);
          assert.equal(product.productContentForm, undefined);
          for (const sku of product.skuAvailables) {
            assert.deepEqual(Object.keys(sku).sort(), ['available', 'code', 'id', 'priceCents']);
          }
        }
        for (const [name, arguments_] of [
          [categoryName, { pageNo: '1' }],
          [categoryName, { pageSize: true }],
          [categoryName, { pageNo: 1.5 }],
          [categoryName, { pageSize: 1.5 }],
          [categoryName, { pageNo: 0 }],
          [categoryName, { pageSize: 101 }],
          [categoryName, { unknown: true }],
          [categoryName, { instanceName: 'shareTest' }],
          [categoryName, { innerAccess: true }],
          [searchName, { pageSize: 101 }],
          [searchName, { instanceName: 'shareTest' }],
          [detailName, { id: true }],
          [detailName, { id, innerAccess: true }],
          [detailName, { id, route: '/mcp/test/catalog/products' }],
        ] as const) {
          const rejected = await exchange('tools/call', { name, arguments: arguments_ });
          // Valid RPC dispatched to the tool: handler validation stays in-band.
          assert.equal(rejected.status, 200);
          assert.deepEqual(rejected.body, {
            jsonrpc: '2.0',
            id: 1,
            error: { code: -32602, message: 'Invalid params' },
          });
        }
        const unknown = await exchange('tools/call', { name: 'commerce_products_delete' });
        assert.equal(unknown.status, 200);
        assert.equal(unknown.body.error.code, -32602);
        const missing = await exchange('tools/call', {
          name: detailName,
          arguments: { id: absentId },
        });
        assert.equal(missing.status, 200);
        assert.equal(missing.body.error, undefined);
        assert.equal(missing.body.result.resultType, legacy ? undefined : 'complete');
        assert.equal(missing.body.result.isError, true);
        assert.deepEqual(missing.body.result.content, [
          { type: 'text', text: 'Product not found' },
        ]);
        assert.equal(missing.body.result.structuredContent, undefined);
        assert.equal(
          warnings.mock.calls.some(call =>
            String(call.arguments[0]).startsWith(
              "responseMode: 'json' drops mid-call notifications.",
            ),
          ),
          false,
          'JSON tool exchanges do not emit the SDK lossy-response-mode warning',
        );
      } finally {
        try {
          await local.close();
        } finally {
          warnings.mock.restore();
        }
      }
    });
  }

  it('rejects critical ingress/body ambiguity before context entry and retains strict modern validation', async () => {
    const local = await startLocalTransport(app);
    try {
      const valid = rpc('tools/list');
      const instanceHeader = app.config.instance.headerField;
      const cases = [
        { method: 'GET', body: '', status: 405 },
        { method: 'DELETE', body: '', status: 405 },
        { headers: { host: 'localhost:1' }, status: 403 },
        { headers: { origin: 'null' }, status: 403 },
        { headers: { authorization: 'synthetic-forbidden' }, status: 403 },
        { headers: { cookie: 'synthetic=forbidden' }, status: 403 },
        { headers: { 'x-vona-instance-name': 'shareTest' }, status: 403 },
        ...(typeof instanceHeader === 'string' &&
        instanceHeader.toLowerCase() !== 'x-vona-instance-name'
          ? [{ headers: { [instanceHeader]: 'shareTest' }, status: 403 }]
          : []),
        { target: '/mcp?instanceName=shareTest', status: 404 },
        { target: '/%6dcp', status: 404 },
        { headers: { 'content-length': 16 * 1024 + 1 }, body: '', status: 413 },
        // Chunked receipt, not just the declared Content-Length fast rejection.
        {
          headers: { 'content-length': undefined, 'transfer-encoding': 'chunked' },
          body: ' '.repeat(16 * 1024 + 1),
          status: 413,
        },
        { body: '{', status: 400, code: -32700 },
        ...[
          { jsonrpc: '2.0', method: 'notifications/initialized', id: null },
          { jsonrpc: '2.0', method: 'notifications/initialized', params: [] },
          { jsonrpc: '2.0', method: 'notifications/initialized', extra: true },
          { jsonrpc: '2.0', method: 'notifications/cancelled' },
          { jsonrpc: '2.0', method: 'tools/list' },
          [{ jsonrpc: '2.0', id: 1, method: 'tools/list' }],
        ].map(body => ({ body: JSON.stringify(body), status: 400, code: -32600 })),
        {
          body: '{"jsonrpc":"2.0","id":1,"method":"tools/list","method":"tools/call"}',
          status: 400,
          code: -32600,
        },
      ];
      for (const { status, code = -32000, ...options } of cases) {
        const response = await openHttp(local.url, {
          ...valid,
          ...options,
          headers: { ...valid.headers, ...options.headers },
        }).response;
        await waitFor(() => local.snapshot().active === 0, 'denial reader settled');
        assert.equal(response.status, status);
        if (status === 405) assert.equal(response.headers.allow, 'POST');
        assert.equal(response.headers['cache-control'], 'no-store');
        assert.deepEqual(JSON.parse(response.text), {
          jsonrpc: '2.0',
          id: null,
          error: {
            code,
            message:
              code === -32700
                ? 'Parse error'
                : code === -32600
                  ? 'Invalid request'
                  : 'Request rejected',
          },
        });
        assert.equal(local.snapshot().contexts, 0, 'denial never entered Vona context');
      }
      const malformedModern = rpc('tools/list');
      const missingEnvelope = await openHttp(local.url, {
        ...malformedModern,
        body: JSON.stringify({ jsonrpc: '2.0', id: 9, method: 'tools/list' }),
      }).response;
      await waitFor(() => local.snapshot().active === 0, 'modern rejection settled');
      assert.equal(missingEnvelope.status, 400);
      assert.equal(JSON.parse(missingEnvelope.text).error.code, -32602);
      const unsupported = await openHttp(local.url, {
        body: malformedModern.body.replace(version, '2099-01-01'),
        headers: { ...malformedModern.headers, 'mcp-protocol-version': '2099-01-01' },
      }).response;
      await waitFor(() => local.snapshot().active === 0, 'unsupported modern request settled');
      assert.equal(unsupported.status, 400);
      assert.deepEqual(JSON.parse(unsupported.text).error, {
        code: -32022,
        message: 'Unsupported protocol version',
        data: { supported: [version] },
      });
      assert.equal(local.snapshot().contexts, 2);
      const admitted = await openHttp(local.url, {
        ...valid,
        headers: { ...valid.headers, origin: new URL(local.url).origin },
      }).response;
      assert.equal(admitted.status, 200, 'exact local Origin is admitted');
      await waitFor(() => local.snapshot().active === 0, 'admitted request settled');
      assert.equal(local.snapshot().contexts, 3);
    } finally {
      await local.close();
    }
  });

  it('keeps one active/no queue, cancels partial receipt, and drains actual held controller work on close', async t => {
    const receiving = await startLocalTransport(app);
    const partial = () =>
      openHttp(receiving.url, {
        ...rpc('tools/list'),
        body: '{',
        headers: { 'content-length': 100 },
        partial: true,
      });
    let pending = partial();
    try {
      await waitFor(() => receiving.snapshot().active === 1, 'partial body owns slot');
      const busy = await openHttp(receiving.url, rpc('tools/list')).response;
      assert.equal(busy.status, 429);
      assert.deepEqual(receiving.snapshot(), {
        active: 1,
        contexts: 0,
        settled: 0,
        closing: false,
      });
      pending.req.destroy();
      await pending.response.catch(() => {});
      await waitFor(() => receiving.snapshot().active === 0, 'disconnect settles body reader');
      assert.equal(receiving.snapshot().settled, 1);
      pending = partial();
      await waitFor(() => receiving.snapshot().active === 1, 'second partial body owns slot');
      const closure = receiving.close();
      assert.equal(receiving.close(), closure, 'close is idempotent');
      assert.equal((await pending.response).status, 503);
      await closure;
      assert.deepEqual(receiving.snapshot(), { active: 0, contexts: 0, settled: 2, closing: true });
    } finally {
      pending.req.destroy();
      await receiving.close();
      await pending.response.catch(() => {});
    }

    const local = await startLocalTransport(app);
    let resume!: () => void;
    const barrier = new Promise<void>(resolve => {
      resume = resolve;
    });
    let calls = 0;
    let workFinished = false;
    const original = ServiceCatalog.prototype.selectPublic;
    // This is the actual owner called by ControllerCatalog.products, not a
    // replacement executor/adapter. Forward to the real read after releasing it.
    const held = t.mock.method(
      ServiceCatalog.prototype,
      'selectPublic',
      async function (this: ServiceCatalog, ...args: Parameters<ServiceCatalog['selectPublic']>) {
        calls++;
        await barrier;
        try {
          return await original.apply(this, args);
        } finally {
          workFinished = true;
        }
      },
    );
    const pendingWork = openHttp(
      local.url,
      rpc('tools/call', {
        name: searchName,
        arguments: { title: 'Wireless Headphones', pageSize: 1 },
      }),
    );
    try {
      await waitFor(() => calls === 1, 'real public service entered');
      assert.equal((await openHttp(local.url, rpc('tools/list')).response).status, 429);
      pendingWork.req.destroy();
      await pendingWork.response.catch(() => {});
      let closed = false;
      const closure = local.close().then(() => {
        closed = true;
      });
      await delay(25);
      assert.equal(closed, false, 'socket cancellation is not work settlement');
      assert.equal(workFinished, false);
      assert.deepEqual(local.snapshot(), { active: 1, contexts: 1, settled: 0, closing: true });
      resume();
      await closure;
      assert.equal(workFinished, true);
      assert.equal(calls, 1, 'busy request was not queued or dispatched later');
      assert.deepEqual(local.snapshot(), { active: 0, contexts: 1, settled: 1, closing: true });
    } finally {
      resume();
      pendingWork.req.destroy();
      try {
        await local.close();
        await pendingWork.response.catch(() => {});
      } finally {
        held.mock.restore();
      }
    }
  });

  it('legacy deadline retains capacity and close drains actual work without a pending JSON wait', async t => {
    const local = await startLocalTransport(app);
    const original = ServiceCatalog.prototype.selectPublic;
    let resume!: () => void;
    const barrier = new Promise<void>(resolve => {
      resume = resolve;
    });
    let calls = 0;
    let workFinished = false;
    const held = t.mock.method(
      ServiceCatalog.prototype,
      'selectPublic',
      async function (this: ServiceCatalog, ...args: Parameters<ServiceCatalog['selectPublic']>) {
        calls++;
        await barrier;
        try {
          return await original.apply(this, args);
        } finally {
          workFinished = true;
        }
      },
    );
    const started = Date.now();
    const pending = openHttp(
      local.url,
      legacyRpc('tools/call', {
        name: searchName,
        arguments: { title: 'Wireless Headphones', pageSize: 1 },
      }),
    );
    try {
      await waitFor(() => calls === 1, 'legacy real service entered');
      const response = await pending.response;
      assert.ok(Date.now() - started >= 9900, 'actual legacy deadline elapsed');
      assert.equal(response.status, 504);
      assert.deepEqual(JSON.parse(response.text), {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32000, message: 'Request rejected' },
      });
      assert.equal((await openHttp(local.url, legacyRpc('tools/list')).response).status, 429);
      let closed = false;
      const closure = local.close().then(() => {
        closed = true;
      });
      await delay(25);
      assert.equal(closed, false, 'deadline/transport close is not real work settlement');
      assert.equal(workFinished, false);
      assert.deepEqual(local.snapshot(), { active: 1, contexts: 1, settled: 0, closing: true });
      resume();
      await waitFor(() => closed, 'native JSON cancellation permits owned drain to finish');
      await closure;
      assert.equal(workFinished, true);
      assert.equal(calls, 1);
      assert.deepEqual(local.snapshot(), { active: 0, contexts: 1, settled: 1, closing: true });
    } finally {
      resume();
      pending.req.destroy();
      try {
        await local.close();
        await pending.response.catch(() => {});
      } finally {
        held.mock.restore();
      }
    }
  });

  it('enforces actual receive/work deadlines and rejects oversized real-read output before commitment', async t => {
    const receiving = await startLocalTransport(app);
    const receiveStarted = Date.now();
    const stalled = openHttp(receiving.url, {
      body: '{',
      headers: { 'content-length': 100 },
      partial: true,
    });
    try {
      await waitFor(() => receiving.snapshot().active === 1, 'stalled receipt owns slot');
      const response = await stalled.response;
      assert.ok(Date.now() - receiveStarted >= 1900, 'actual two-second receive deadline elapsed');
      assert.equal(response.status, 408);
      assert.deepEqual(JSON.parse(response.text), {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32000, message: 'Request rejected' },
      });
      await waitFor(() => receiving.snapshot().active === 0, 'receive deadline settled reader');
      assert.deepEqual(receiving.snapshot(), {
        active: 0,
        contexts: 0,
        settled: 1,
        closing: false,
      });
    } finally {
      stalled.req.destroy();
      await receiving.close();
      await stalled.response.catch(() => {});
    }

    const local = await startLocalTransport(app);
    const original = ServiceCatalog.prototype.selectPublic;
    let resume!: () => void;
    const barrier = new Promise<void>(resolve => {
      resume = resolve;
    });
    let calls = 0;
    let workFinished = false;
    const held = t.mock.method(
      ServiceCatalog.prototype,
      'selectPublic',
      async function (this: ServiceCatalog, ...args: Parameters<ServiceCatalog['selectPublic']>) {
        calls++;
        await barrier;
        try {
          return await original.apply(this, args);
        } finally {
          workFinished = true;
        }
      },
    );
    const workStarted = Date.now();
    const pendingWork = openHttp(
      local.url,
      rpc('tools/call', {
        name: searchName,
        arguments: { title: 'Wireless Headphones', pageSize: 1 },
      }),
    );
    try {
      await waitFor(() => calls === 1, 'actual service held across execution deadline');
      const response = await pendingWork.response;
      assert.ok(Date.now() - workStarted >= 9900, 'actual ten-second execution deadline elapsed');
      assert.equal(response.status, 504);
      assert.deepEqual(JSON.parse(response.text), {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32000, message: 'Request rejected' },
      });
      assert.equal(workFinished, false, 'deadline did not fabricate real work settlement');
      const busy = await openHttp(local.url, rpc('tools/list')).response;
      assert.equal(busy.status, 429, 'timed-out work still owns capacity');
      assert.deepEqual(local.snapshot(), {
        active: 1,
        contexts: 1,
        settled: 0,
        closing: false,
      });
      resume();
      await waitFor(
        () => local.snapshot().active === 0,
        'real read and executor settled after release',
      );
      assert.equal(workFinished, true);
      assert.equal(calls, 1, 'busy request was not queued');
      assert.deepEqual(local.snapshot(), {
        active: 0,
        contexts: 1,
        settled: 1,
        closing: false,
      });
    } finally {
      resume();
      pendingWork.req.destroy();
      try {
        await local.close();
        await pendingWork.response.catch(() => {});
      } finally {
        held.mock.restore();
      }
    }

    const bounded = await startLocalTransport(app);
    const description = `HTTP_LIMIT_SENTINEL_${'x'.repeat(1024 * 1024)}`;
    let realReadFinished = false;
    const oversized = t.mock.method(
      ServiceCatalog.prototype,
      'selectPublic',
      async function (this: ServiceCatalog, ...args: Parameters<ServiceCatalog['selectPublic']>) {
        const result = await original.apply(this, args);
        assert.equal(result.list.length, 1);
        realReadFinished = true;
        // Change only the returned DTO value, never the static fixture or config.
        return {
          ...result,
          list: result.list.map(product => ({ ...product, description })),
        };
      },
    );
    const originalLogResult = AopMethodLog.prototype._logResult;
    let suppressedResultLogs = 0;
    const resultLog = t.mock.method(
      AopMethodLog.prototype,
      '_logResult',
      function (this: AopMethodLog, ...args: Parameters<AopMethodLog['_logResult']>) {
        // Fail-safe: keep the fixture out of logs if result logging is reintroduced.
        if (args[2]?.list?.[0]?.description === description) {
          suppressedResultLogs++;
          return;
        }
        return originalLogResult.apply(this, args);
      },
    );
    try {
      const response = await send(bounded, 'tools/call', {
        name: searchName,
        arguments: { title: 'Wireless Headphones', pageSize: 1 },
      });
      assert.equal(realReadFinished, true);
      assert.equal(
        suppressedResultLogs,
        0,
        'oversized fixture result never reaches AOP result logging',
      );
      assert.equal(response.status, 500);
      assert.deepEqual(response.body, {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32603, message: 'Internal error' },
      });
      assert.equal(response.text.includes('HTTP_LIMIT_SENTINEL_'), false);
      assert.equal(response.text.includes('Wireless Headphones'), false);
      assert.ok(Buffer.byteLength(response.text) < 1024, 'only the fixed error reached HTTP');
      assert.deepEqual(bounded.snapshot(), {
        active: 0,
        contexts: 1,
        settled: 1,
        closing: false,
      });
    } finally {
      try {
        // Oversized output is a failed operation, not successful shutdown proof.
        await assert.rejects(bounded.close(), { message: 'MCP_LOCAL_OPERATION_FAILED' });
      } finally {
        resultLog.mock.restore();
        oversized.mock.restore();
      }
    }
  });
});
