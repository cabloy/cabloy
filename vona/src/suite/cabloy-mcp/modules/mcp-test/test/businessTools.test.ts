import type { JSONRPCMessage, JSONRPCRequest, Server } from '@modelcontextprotocol/server';
import type { IMcpToolOptions } from 'vona-module-a-openapiutils';

import { InMemoryTransport } from '@modelcontextprotocol/server';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { appMetadata, appResource, runWithZodQueryCoercion } from 'vona';
import { acquireTestLock, app } from 'vona-mock';
import { $schema, mcp, SymbolMcpOptions } from 'vona-module-a-openapiutils';

import { ControllerCatalog } from '../src/controller/catalog.ts';
import { ControllerToolFixture, toolFixtureState } from '../src/controller/toolFixture.ts';
import { DtoCategoryPublic } from '../src/dto/categoryPublic.tsx';
import { DtoCategoryPublicSelectReq } from '../src/dto/categoryPublicSelectReq.tsx';
import { DtoCategoryPublicSelectRes } from '../src/dto/categoryPublicSelectRes.tsx';
import { DtoProductPublicDetail } from '../src/dto/productPublicDetail.tsx';
import { DtoProductPublicSelectRes } from '../src/dto/productPublicSelectRes.tsx';
import { createBusinessToolServer } from '../src/lib/businessTools.ts';
import { createSharedBusinessToolServer } from '../src/lib/sharedBusinessTools.ts';
import { ServiceCatalog } from '../src/service/catalog.ts';

async function connect(server: Server) {
  const [client, transport] = InMemoryTransport.createLinkedPair();
  let id = 0;
  const pending = new Map<number, (message: any) => void>();
  client.onmessage = (message: JSONRPCMessage) => {
    if ('id' in message && typeof message.id === 'number') {
      const resolve = pending.get(message.id);
      pending.delete(message.id);
      resolve?.(message);
    }
  };
  await client.start();
  await server.connect(transport);
  const request = async (method: string, params?: Record<string, unknown>): Promise<any> => {
    const requestId = ++id;
    const response = new Promise(resolve => pending.set(requestId, resolve));
    await client.send({ jsonrpc: '2.0', id: requestId, method, params } as JSONRPCRequest);
    return await response;
  };
  await request('initialize', {
    protocolVersion: '2025-11-25',
    capabilities: {},
    clientInfo: { name: 'business-tool-test', version: '1.0.0' },
  });
  await client.send({ jsonrpc: '2.0', method: 'notifications/initialized' });
  return { request, close: () => server.close() };
}

const toolName = 'commerce_products_search';
const detailToolName = 'commerce_product_detail';
const categoryToolName = 'commerce_categories_list';
const statusToolName = 'mcp_test_action_status';
const effectToolName = 'mcp_test_action_effect';
const scalarToolName = 'mcp_test_action_scalar';
const arrayToolName = 'mcp_test_action_array';

describe('businessTools.test.ts', { concurrency: false, timeout: 60000 }, () => {
  let release: (() => void) | undefined;
  before(async () => {
    assert.ok(app.meta.modules['mcp-test'], 'fixture module is loaded');
    assert.ok(app.meta.modules['cabloy-mcp'], 'core module is loaded');
    if ((process.env.PROJECT_DISABLED_SUITES ?? '').split(',').includes('a-training')) {
      assert.equal(app.meta.modules['training-student'], undefined);
    }
    if ((process.env.PROJECT_DISABLED_SUITES ?? '').split(',').includes('a-commerce')) {
      assert.deepEqual(
        Object.keys(app.meta.modules).filter(
          name => name.startsWith('commerce-') || name === 'test-pay',
        ),
        [],
        'disabled Commerce modules are absent from the actual runtime composition',
      );
    }
    release = await acquireTestLock('mcp-test');
  });
  after(() => release?.());

  it('keeps the student tool out of the default composition and validates its shared contract', async () => {
    await app.bean.executor.mockCtx(async () => {
      const standalone = await connect(await createBusinessToolServer(app));
      try {
        const rejected = await standalone.request('tools/call', {
          name: 'training_student_summary',
          arguments: { id: '1' },
        });
        assert.equal(rejected.error.code, -32602);
      } finally {
        await standalone.close();
      }
      const shared = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
      try {
        const listed = await shared.request('tools/list');
        assert.deepEqual(
          listed.result.tools.map((tool: any) => tool.name).sort(),
          [
            categoryToolName,
            toolName,
            detailToolName,
            statusToolName,
            effectToolName,
            scalarToolName,
            arrayToolName,
            ...(app.meta.modules['training-student'] ? ['training_student_summary'] : []),
          ].sort(),
        );
        const student = listed.result.tools.find(
          (tool: any) => tool.name === 'training_student_summary',
        );
        if (!app.meta.modules['training-student']) {
          assert.equal(student, undefined);
          return;
        }
        assert.ok(student);
        assert.deepEqual(Object.keys(student.inputSchema.properties), ['id']);
        assert.deepEqual(student.inputSchema.required, ['id']);
        assert.equal(student.inputSchema.additionalProperties, false);
        assert.deepEqual(Object.keys(student.outputSchema.properties).sort(), [
          'descriptionLength',
          'id',
          'level',
          'levelTitle',
          'name',
          'summaryText',
        ]);
        for (const field of ['mobile', 'descriptionMarkdown', 'descriptionHtml']) {
          assert.equal(JSON.stringify(student).includes(`\"${field}\"`), false);
        }
        assert.equal(student.annotations.readOnlyHint, true);
        for (const args of [
          {},
          { id: null },
          { id: true },
          { id: [] },
          { id: {} },
          { id: '' },
          ...['route', 'method', 'headers', 'innerAccess', 'instanceName', 'userId'].map(key => ({
            id: '1',
            [key]: 'injected',
          })),
        ]) {
          const rejected = await shared.request('tools/call', {
            name: student.name,
            arguments: args,
          });
          assert.equal(rejected.error?.code, -32602, JSON.stringify(args));
        }
      } finally {
        await shared.close();
      }
    });
  });

  it('requires an explicit authorization scope and blocks write tools before ordinary Action dispatch', async () => {
    await app.bean.executor.mockCtx(async () => {
      await assert.rejects(
        () => createSharedBusinessToolServer(app),
        /MCP authorization scope required/,
      );
      const initial = toolFixtureState.count;
      const read = await connect(await createSharedBusinessToolServer(app, 'mcp:read'));
      const all = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
      try {
        const readTools = (await read.request('tools/list')).result.tools;
        const allTools = (await all.request('tools/list')).result.tools;
        assert.equal(
          readTools.some((tool: any) => tool.name === effectToolName),
          false,
        );
        assert.equal(
          allTools.some((tool: any) => tool.name === effectToolName),
          true,
        );
        const status = readTools.find((tool: any) => tool.name === statusToolName);
        assert.ok(status);
        assert.equal(status.annotations.readOnlyHint, true);
        assert.deepEqual(status.inputSchema.properties, {});
        const effect = allTools.find((tool: any) => tool.name === effectToolName);
        assert.equal(effect.annotations.readOnlyHint, false);
        assert.deepEqual(Object.keys(effect.inputSchema.properties).sort(), ['body', 'params']);
        assert.deepEqual(effect.inputSchema.required.toSorted(), ['body', 'params']);
        assert.equal(effect.inputSchema.additionalProperties, false);
        const args = { params: { label: 'scope-proof' }, body: { amount: 2 } };
        const denied = await read.request('tools/call', { name: effectToolName, arguments: args });
        assert.equal(denied.error?.code, -32602);
        assert.equal(toolFixtureState.count, initial, 'denied calls do not reach the controller');
        const closed = await all.request('tools/call', {
          name: 'mcp-test_toolFixture_closed',
          arguments: {},
        });
        assert.equal(closed.error?.code, -32602, 'unannotated sibling Actions remain closed');
        for (const arguments_ of [
          { label: 'scope-proof', amount: 2 },
          { params: { label: 'scope-proof', innerAccess: true }, body: { amount: 2 } },
          { params: { label: 'scope-proof' }, body: { amount: 4 } },
          { ...args, innerAccess: true },
        ]) {
          const rejected = await all.request('tools/call', {
            name: effectToolName,
            arguments: arguments_,
          });
          assert.equal(rejected.error?.code, -32602);
          assert.equal(toolFixtureState.count, initial);
        }
        // The fixture is public, not an RBAC proof; devHttp retains real student-role checks.
        const accepted = await all.request('tools/call', { name: effectToolName, arguments: args });
        assert.equal(accepted.error, undefined);
        assert.notEqual(accepted.result.isError, true);
        assert.deepEqual(accepted.result.structuredContent, {
          count: initial + 2,
          label: 'scope-proof',
        });
        const current = await read.request('tools/call', { name: statusToolName });
        assert.deepEqual(current.result.structuredContent, { count: initial + 2 });
      } finally {
        toolFixtureState.count = initial;
        await read.close();
        await all.close();
      }
    });
  });

  it('inherits class opt-in defaults, retains local names and rejects invalid exposure configuration', async t => {
    await app.bean.executor.mockCtx(async () => {
      const original = appMetadata.getMetadata;
      let configuration:
        | 'defaults'
        | 'override'
        | 'pick-replacement'
        | 'invalid-name'
        | 'duplicate'
        | 'invalid-pick' = 'defaults';
      const metadata = t.mock.method(
        appMetadata,
        'getMetadata',
        function (...args: Parameters<typeof original>) {
          const [key, target, action] = args;
          const value = original.apply(appMetadata, args) as IMcpToolOptions | undefined;
          if (key !== SymbolMcpOptions) return value;
          if (target === ControllerToolFixture && action === undefined) {
            if (configuration === 'defaults' || configuration === 'override') {
              return { description: 'Fixture class default', readOnly: false };
            }
            if (configuration === 'pick-replacement') return { output: { pick: ['count'] } };
          }
          if (target === ControllerToolFixture.prototype && configuration === 'pick-replacement') {
            if (action === 'effect') return { ...value, output: { pick: ['label'] } };
            if (action === 'scalar' || action === 'array') return { ...value, output: undefined };
          }
          if (target === ControllerToolFixture.prototype && action === 'status') {
            if (configuration === 'defaults') return { ...value, readOnly: true };
            if (configuration === 'override') {
              return {
                ...value,
                name: 'mcp_test_overridden_status',
                description: 'Local description',
                readOnly: true,
              };
            }
            if (configuration === 'invalid-name') return { ...value, name: 'invalid tool name' };
            if (configuration === 'duplicate') return { ...value, name: categoryToolName };
            if (configuration === 'invalid-pick')
              return { ...value, output: { pick: ['missing'] } };
          }
          return value;
        },
      );
      try {
        assert.deepEqual(appMetadata.getMetadata(SymbolMcpOptions, ControllerCatalog), {});
        const client = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
        try {
          const tools = (await client.request('tools/list')).result.tools;
          const status = tools.find((tool: any) => tool.name === statusToolName);
          assert.equal(status.description, 'Fixture class default');
          assert.equal(
            status.annotations.readOnlyHint,
            true,
            'local options override class defaults',
          );
          const closed = tools.find((tool: any) => tool.name === 'mcp-test_toolFixture_closed');
          assert.ok(closed, 'class opt-in exposes representable sibling Actions');
          assert.equal(closed.description, 'Fixture class default');
          assert.equal(closed.annotations.readOnlyHint, false);
        } finally {
          await client.close();
        }
        configuration = 'override';
        const overridden = await connect(await createSharedBusinessToolServer(app, 'mcp:read'));
        try {
          const tools = (await overridden.request('tools/list')).result.tools;
          assert.equal(
            tools.some((tool: any) => tool.name === statusToolName),
            false,
          );
          const status = tools.find((tool: any) => tool.name === 'mcp_test_overridden_status');
          assert.ok(status);
          assert.equal(status.description, 'Local description');
          assert.equal(status.annotations.readOnlyHint, true);
        } finally {
          await overridden.close();
        }
        configuration = 'pick-replacement';
        const projected = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
        const initial = toolFixtureState.count;
        try {
          const tool = (await projected.request('tools/list')).result.tools.find(
            (tool: any) => tool.name === effectToolName,
          );
          assert.deepEqual(Object.keys(tool.outputSchema.properties), ['label']);
          const response = await projected.request('tools/call', {
            name: effectToolName,
            arguments: { params: { label: 'pick-replacement' }, body: { amount: 1 } },
          });
          assert.deepEqual(response.result.structuredContent, { label: 'pick-replacement' });
          assert.deepEqual(JSON.parse(response.result.content[0].text), {
            label: 'pick-replacement',
          });
        } finally {
          toolFixtureState.count = initial;
          await projected.close();
        }
        for (const [mode, expected] of [
          ['invalid-name', /Invalid or duplicate MCP tool name/],
          ['duplicate', /Invalid or duplicate MCP tool name/],
          ['invalid-pick', /Invalid MCP output.pick/],
        ] as const) {
          configuration = mode;
          await assert.rejects(() => createSharedBusinessToolServer(app, 'mcp:all'), expected);
        }
        assert.throws(
          () => (mcp.tool as any)({ name: 'class-name-is-not-valid' })(class {}),
          /name is only valid on a controller action/,
        );
      } finally {
        metadata.mock.restore();
      }
    });
  });

  it('keeps excluded Action contracts out of public caches, wraps scalar/array output and diagnoses unsupported Actions', async () => {
    await app.bean.executor.mockCtx(async () => {
      const publicBefore = await app.bean.openapi.generateJsonOfControllerAction(
        ControllerToolFixture,
        'scalar',
        'V31',
      );
      assert.deepEqual(Object.keys(publicBefore.paths ?? {}), []);
      const contract = await app.bean.openapi.generateJsonOfControllerAction(
        ControllerToolFixture,
        'scalar',
        'V31',
        { includeExcluded: true },
      );
      assert.equal(Object.keys(contract.paths ?? {}).length, 1);
      const server = await createSharedBusinessToolServer(app, 'mcp:read');
      const client = await connect(server);
      try {
        assert.ok(
          server.diagnostics.some(
            item =>
              item.controller === 'mcp-test.controller.toolFixture' &&
              item.action === 'unsupported' &&
              item.reason.includes('Only JSON/200 Actions'),
          ),
        );
        const tools = (await client.request('tools/list')).result.tools;
        assert.equal(
          tools.some((tool: any) => tool.name === 'mcp_test_action_unsupported'),
          false,
        );
        for (const [name, expected] of [
          [scalarToolName, 7],
          [arrayToolName, ['safe', 'array']],
        ] as const) {
          const tool = tools.find((tool: any) => tool.name === name);
          assert.deepEqual(Object.keys(tool.outputSchema.properties), ['result']);
          const response = await client.request('tools/call', { name });
          assert.equal(response.error, undefined);
          assert.notEqual(response.result.isError, true);
          assert.deepEqual(response.result.structuredContent, { result: expected });
          assert.deepEqual(JSON.parse(response.result.content[0].text), { result: expected });
        }
        const rejected = await client.request('tools/call', {
          name: 'mcp_test_action_unsupported',
        });
        assert.equal(rejected.error?.code, -32602);
      } finally {
        await client.close();
      }
      const publicAfter = await app.bean.openapi.generateJsonOfControllerAction(
        ControllerToolFixture,
        'scalar',
        'V31',
      );
      assert.deepEqual(
        publicAfter,
        publicBefore,
        'includeExcluded does not poison the public cache',
      );
    });
  });

  it('projects student output and fails closed on invalid retained fields', async t => {
    if (!app.meta.modules['training-student']) return;
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createSharedBusinessToolServer(app, 'mcp:all'));
      const executor = app.bean.executor;
      const raw = {
        id: '123',
        name: '__MCP projection__',
        level: 2,
        levelTitle: '2',
        descriptionLength: 7,
        summaryText: 'A safe summary',
        mobile: 'private-mobile',
        descriptionMarkdown: 'private-notes',
        descriptionHtml: '<p>private-notes</p>',
        extra: 'private-extra',
      };
      // Isolate output parsing only; guarded real controller behavior is covered by devHttp.
      const action = t.mock.method(executor, 'performAction', async () => raw);
      try {
        const call = () =>
          client.request('tools/call', {
            name: 'training_student_summary',
            arguments: { id: '123' },
          });
        const response = await call();
        assert.equal(response.error, undefined);
        assert.notEqual(response.result.isError, true);
        assert.deepEqual(response.result.structuredContent, {
          id: raw.id,
          name: raw.name,
          level: raw.level,
          levelTitle: raw.levelTitle,
          descriptionLength: raw.descriptionLength,
          summaryText: raw.summaryText,
        });
        assert.deepEqual(
          JSON.parse(response.result.content[0].text),
          response.result.structuredContent,
        );
        action.mock.mockImplementation(async () => ({ ...raw, summaryText: undefined }));
        const invalid = await call();
        assert.equal(invalid.result.isError, true);
        assert.equal(invalid.result.structuredContent, undefined);
        assert.deepEqual(invalid.result.content, [{ type: 'text', text: 'Action failed' }]);
      } finally {
        action.mock.restore();
        await client.close();
      }
    });
  });

  it('restores business query semantics beneath native protocol parsing for all three DTO-backed tools', async () => {
    await app.bean.executor.mockCtx(() =>
      runWithZodQueryCoercion(false, async () => {
        const client = await connect(await createBusinessToolServer(app));
        try {
          const listed = await client.request('tools/list');
          assert.deepEqual(
            listed.result.tools.map((tool: any) => tool.name),
            [toolName, detailToolName, categoryToolName],
          );
          const categoryTool = listed.result.tools[2];
          const document = await runWithZodQueryCoercion(true, () =>
            app.bean.openapi.generateJsonOfClasses(
              [DtoCategoryPublicSelectReq, DtoCategoryPublicSelectRes, DtoCategoryPublic],
              'V31',
            ),
          );
          const schemas = document.components!.schemas!;
          assert.deepEqual(categoryTool.inputSchema, {
            ...schemas[appResource.getBeanFullName(DtoCategoryPublicSelectReq)!],
            additionalProperties: false,
          });
          const responseSchema = schemas[appResource.getBeanFullName(DtoCategoryPublicSelectRes)!];
          assert.ok('properties' in responseSchema);
          assert.deepEqual(categoryTool.outputSchema.properties, responseSchema.properties);
          assert.deepEqual(
            categoryTool.outputSchema.components.schemas[
              appResource.getBeanFullName(DtoCategoryPublic)!
            ],
            schemas[appResource.getBeanFullName(DtoCategoryPublic)!],
          );
          assert.deepEqual(Object.keys(categoryTool.inputSchema.properties).sort(), [
            'pageNo',
            'pageSize',
          ]);
          assert.equal(categoryTool.inputSchema.properties.pageNo.type, 'integer');
          assert.equal(categoryTool.inputSchema.properties.pageNo.minimum, 1);
          assert.equal(categoryTool.inputSchema.properties.pageNo.default, 1);
          assert.equal(categoryTool.inputSchema.properties.pageSize.type, 'integer');
          assert.equal(categoryTool.inputSchema.properties.pageSize.minimum, 1);
          assert.equal(categoryTool.inputSchema.properties.pageSize.default, 20);
          assert.equal(categoryTool.inputSchema.properties.pageSize.maximum, 100);
          assert.equal(categoryTool.annotations.readOnlyHint, true);
          const tool = listed.result.tools[0];
          assert.equal(tool.annotations.readOnlyHint, true);
          assert.equal(tool.inputSchema.properties.pageSize.maximum, 100);
          assert.equal(tool.inputSchema.additionalProperties, false);
          assert.equal(tool.outputSchema.properties.total.type, 'string');
          assert.ok(tool.outputSchema.components.schemas);
          const args = { title: 'Wireless Headphones', pageNo: 1, pageSize: 1 };
          const response = await client.request('tools/call', { name: toolName, arguments: args });
          assert.equal(response.error, undefined);
          assert.notEqual(response.result.isError, true);
          const output = response.result.structuredContent;
          const direct = await runWithZodQueryCoercion(true, () =>
            app.bean.executor.performAction('get', '/mcp/test/catalog/products', {
              query: args,
              innerAccess: false,
            }),
          );
          assert.deepEqual(
            output,
            await runWithZodQueryCoercion(true, () =>
              $schema(DtoProductPublicSelectRes).parseAsync(direct),
            ),
          );
          assert.equal(output.list.length, 1);
          assert.equal(output.list[0].title, 'Wireless Headphones');
          assert.equal(typeof output.total, 'string');
          assert.deepEqual(Object.keys(output).sort(), [
            'list',
            'pageCount',
            'pageNo',
            'pageSize',
            'total',
          ]);
          assert.deepEqual(Object.keys(output.list[0]).sort(), [
            'available',
            'categoryId',
            'categoryName',
            'description',
            'id',
            'priceCents',
            'skuAvailables',
            'title',
          ]);
          assert.deepEqual(Object.keys(output.list[0].skuAvailables[0]).sort(), [
            'available',
            'code',
            'id',
            'priceCents',
          ]);
          assert.deepEqual(JSON.parse(response.result.content[0].text), output);
          // The existing optional DTO normalizes an empty title to an omitted filter.
          const emptyTitle = await client.request('tools/call', {
            name: toolName,
            arguments: { title: '', pageSize: 1 },
          });
          const omittedTitle = await client.request('tools/call', {
            name: toolName,
            arguments: { pageSize: 1 },
          });
          assert.equal(emptyTitle.error, undefined);
          assert.notEqual(emptyTitle.result.isError, true);
          assert.deepEqual(
            emptyTitle.result.structuredContent,
            omittedTitle.result.structuredContent,
          );
        } finally {
          await client.close();
        }
      }),
    );
  });

  it('lists public categories then searches and reads a product using returned identities', async () => {
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const response = await client.request('tools/call', { name: categoryToolName });
        assert.equal(response.error, undefined);
        assert.notEqual(response.result.isError, true);
        const output = response.result.structuredContent;
        const direct = await app.bean.executor.performAction(
          'get',
          '/mcp/test/catalog/categories',
          { query: { pageNo: 1, pageSize: 20 }, innerAccess: false },
        );
        assert.deepEqual(output, await $schema(DtoCategoryPublicSelectRes).parseAsync(direct));
        assert.equal(output.pageNo, 1);
        assert.equal(output.pageSize, 20);
        assert.equal(typeof output.total, 'string');
        assert.deepEqual(Object.keys(output).sort(), [
          'list',
          'pageCount',
          'pageNo',
          'pageSize',
          'total',
        ]);
        for (const category of output.list) {
          assert.deepEqual(category, await $schema(DtoCategoryPublic).parseAsync(category));
          assert.deepEqual(
            Object.keys(JSON.parse(JSON.stringify(category))).sort(),
            category.description === undefined ? ['id', 'name'] : ['description', 'id', 'name'],
          );
        }
        // In-memory results retain undefined optional fields; text uses JSON wire semantics.
        assert.deepEqual(
          JSON.parse(response.result.content[0].text),
          JSON.parse(JSON.stringify(output)),
        );
        const explicitDefaults = await client.request('tools/call', {
          name: categoryToolName,
          arguments: { pageNo: 1, pageSize: 20 },
        });
        assert.equal(explicitDefaults.error, undefined);
        assert.notEqual(explicitDefaults.result.isError, true);
        assert.deepEqual(explicitDefaults.result.structuredContent, output);
        assert.ok(output.list.some((category: any) => category.name === 'Empty'));
        const electronics = output.list.find((category: any) => category.name === 'Electronics');
        assert.ok(electronics, 'read-only static fixture provides the stocked category');
        const search = await client.request('tools/call', {
          name: toolName,
          arguments: { categoryId: electronics.id, pageSize: 1 },
        });
        assert.equal(search.error, undefined);
        assert.notEqual(search.result.isError, true);
        assert.equal(search.result.structuredContent.list.length, 1);
        const product = search.result.structuredContent.list[0];
        assert.equal(product.categoryId, electronics.id);
        const detail = await client.request('tools/call', {
          name: detailToolName,
          arguments: { id: product.id },
        });
        assert.equal(detail.error, undefined);
        assert.notEqual(detail.result.isError, true);
        assert.equal(detail.result.structuredContent.id, product.id);
        assert.equal(detail.result.structuredContent.categoryId, electronics.id);
        for (const args of [
          { pageNo: 0 },
          { pageSize: 0 },
          { pageNo: 1.5 },
          { pageSize: 1.5 },
          { pageSize: 101 },
          { pageNo: '1' },
          { pageSize: true },
          { unknown: true },
          { title: 'Electronics' },
          { iid: 1 },
          { instanceName: 'shareTest' },
          { route: '/mcp/test/catalog/categories' },
          { innerAccess: true },
          { headers: { authorization: 'synthetic-forbidden' } },
        ]) {
          const rejected = await client.request('tools/call', {
            name: categoryToolName,
            arguments: args,
          });
          assert.deepEqual(
            rejected.error,
            { code: -32602, message: 'Invalid tool arguments' },
            JSON.stringify(args),
          );
        }
      } finally {
        await client.close();
      }
    });
  });

  it('reads public detail from a searched product identity with DTO-projected output', async () => {
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const listed = await client.request('tools/list');
        const tool = listed.result.tools.find((tool: any) => tool.name === detailToolName);
        assert.equal(tool.annotations.readOnlyHint, true);
        assert.deepEqual(Object.keys(tool.inputSchema.properties), ['id']);
        assert.deepEqual(tool.inputSchema.required, ['id']);
        assert.equal(tool.inputSchema.additionalProperties, false);
        assert.ok(tool.outputSchema.properties.descriptionHtml);
        assert.ok(tool.outputSchema.components.schemas);
        const search = await client.request('tools/call', {
          name: toolName,
          arguments: { title: 'Wireless Headphones', pageSize: 1 },
        });
        const id = search.result.structuredContent.list[0].id;
        const response = await client.request('tools/call', {
          name: detailToolName,
          arguments: { id },
        });
        assert.equal(response.error, undefined);
        assert.notEqual(response.result.isError, true);
        const output = response.result.structuredContent;
        const direct = await app.bean.executor.performAction(
          'get',
          '/mcp/test/catalog/products/:id',
          { params: { id }, innerAccess: false },
        );
        assert.deepEqual(output, await $schema(DtoProductPublicDetail).parseAsync(direct));
        assert.equal(output.id, id);
        assert.equal(output.title, 'Wireless Headphones');
        assert.equal(output.descriptionHtml, '<p>Synthetic wireless audio</p>');
        assert.deepEqual(Object.keys(output).sort(), [
          'available',
          'categoryId',
          'categoryName',
          'description',
          'descriptionHtml',
          'id',
          'priceCents',
          'skuAvailables',
          'title',
        ]);
        assert.ok(output.skuAvailables.length > 0);
        for (const sku of output.skuAvailables) {
          assert.deepEqual(Object.keys(sku).sort(), ['available', 'code', 'id', 'priceCents']);
        }
        // The in-memory transport retains undefined; JSON wire output omits optional fields.
        assert.deepEqual(
          JSON.parse(response.result.content[0].text),
          JSON.parse(JSON.stringify(output)),
        );
      } finally {
        await client.close();
      }
    });
  });

  it('rejects missing or malformed detail identities and execution-control arguments', async () => {
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const search = await client.request('tools/call', {
          name: toolName,
          arguments: { title: 'Wireless Headphones', pageSize: 1 },
        });
        const id = search.result.structuredContent.list[0].id;
        for (const args of [
          undefined,
          {},
          { id: null },
          { id: true },
          { id: {} },
          { id: [] },
          { id, iid: 1 },
          { id, instanceName: 'shareTest' },
          { id, route: '/mcp/test/catalog/products' },
          { id, innerAccess: true },
          { id, headers: { authorization: 'synthetic-forbidden' } },
        ]) {
          const response = await client.request('tools/call', {
            name: detailToolName,
            arguments: args,
          });
          assert.deepEqual(
            response.error,
            { code: -32602, message: 'Invalid tool arguments' },
            JSON.stringify(args),
          );
        }
      } finally {
        await client.close();
      }
    });
  });

  it('returns the same not-found result for absent and foreign-instance products and requires context', async () => {
    let id: unknown;
    const notFound = {
      isError: true,
      content: [{ type: 'text', text: 'Product not found' }],
    };
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const search = await client.request('tools/call', {
          name: toolName,
          arguments: { title: 'Wireless Headphones', pageSize: 1 },
        });
        id = search.result.structuredContent.list[0].id;
        const absentId = String(Number.MAX_SAFE_INTEGER);
        assert.equal(await app.bean._getBean(ServiceCatalog).findPublicById(absentId), undefined);
        const response = await client.request('tools/call', {
          name: detailToolName,
          arguments: { id: absentId },
        });
        assert.equal(response.error, undefined);
        assert.deepEqual(response.result, notFound);
      } finally {
        await client.close();
      }
    });
    let client!: Awaited<ReturnType<typeof connect>>;
    await app.bean.executor.mockCtx(
      async () => {
        client = await connect(await createBusinessToolServer(app));
        try {
          const response = await client.request('tools/call', {
            name: detailToolName,
            arguments: { id },
          });
          assert.equal(response.error, undefined);
          assert.deepEqual(response.result, notFound);
        } catch (error) {
          await client.close();
          throw error;
        }
      },
      { instanceName: 'shareTest' as any },
    );
    try {
      const response = await client.request('tools/call', {
        name: detailToolName,
        arguments: { id },
      });
      assert.deepEqual(response.error, { code: -32603, message: 'Request context required' });
    } finally {
      await client.close();
    }
  });

  it('rejects unknown tools, DTO violations and client-controlled execution options', async () => {
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const unknown = await client.request('tools/call', { name: 'commerce_products_delete' });
        assert.equal(unknown.error.code, -32602);
        for (const args of [
          { pageSize: 101 },
          { title: 'x'.repeat(201) },
          { pageNo: 0 },
          { iid: 1 },
          { instanceName: 'shareTest' },
          { route: '/mcp/test/catalog/products' },
          { innerAccess: true },
          { headers: { authorization: 'synthetic-forbidden' } },
        ]) {
          const response = await client.request('tools/call', { name: toolName, arguments: args });
          assert.deepEqual(
            response.error,
            { code: -32602, message: 'Invalid tool arguments' },
            JSON.stringify(args),
          );
        }
      } finally {
        await client.close();
      }
    });
  });

  it('retains the current instance scope and requires a caller-owned request context', async () => {
    let categoryId: unknown;
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const response = await client.request('tools/call', {
          name: toolName,
          arguments: { title: 'Wireless Headphones' },
        });
        categoryId = response.result.structuredContent.list[0].categoryId;
      } finally {
        await client.close();
      }
    });
    let client!: Awaited<ReturnType<typeof connect>>;
    await app.bean.executor.mockCtx(
      async () => {
        client = await connect(await createBusinessToolServer(app));
        try {
          const response = await client.request('tools/call', {
            name: toolName,
            arguments: { categoryId },
          });
          assert.equal(response.error, undefined);
          assert.deepEqual(response.result.structuredContent.list, []);
          assert.equal(response.result.structuredContent.total, '0');
        } catch (error) {
          await client.close();
          throw error;
        }
      },
      { instanceName: 'shareTest' as any },
    );
    try {
      const response = await client.request('tools/call', { name: toolName });
      assert.deepEqual(response.error, { code: -32603, message: 'Request context required' });
    } finally {
      await client.close();
    }
  });
});
