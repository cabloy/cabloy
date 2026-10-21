import type { JSONRPCMessage, JSONRPCRequest, Server } from '@modelcontextprotocol/server';

import { InMemoryTransport } from '@modelcontextprotocol/server';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';
import { $schema } from 'vona-module-a-openapiutils';
import { DtoProductPublicDetail, DtoProductPublicSelectRes } from 'vona-module-commerce-catalog';

import { createBusinessToolServer } from '../src/lib/businessTools.ts';

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

describe('businessTools.test.ts', { concurrency: false, timeout: 60000 }, () => {
  let release: (() => void) | undefined;
  before(async () => {
    release = await acquireTestLock('a-commerce');
  });
  after(() => release?.());

  it('discovers both DTO-backed tools and queries the real public controller anonymously', async () => {
    await app.bean.executor.mockCtx(async () => {
      const client = await connect(await createBusinessToolServer(app));
      try {
        const listed = await client.request('tools/list');
        assert.deepEqual(
          listed.result.tools.map((tool: any) => tool.name),
          [toolName, detailToolName],
        );
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
        const direct = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/public',
          { query: args, innerAccess: false },
        );
        assert.deepEqual(output, await $schema(DtoProductPublicSelectRes).parseAsync(direct));
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
          '/commerce/catalog/product/public/:id',
          { params: { id }, innerAccess: false },
        );
        assert.deepEqual(output, await $schema(DtoProductPublicDetail).parseAsync(direct));
        assert.equal(output.id, id);
        assert.equal(output.title, 'Wireless Headphones');
        assert.equal(output.descriptionHtml, undefined);
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
          { id, route: '/commerce/catalog/product' },
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
        assert.equal(
          await app.scope('commerce-catalog').model.product.getById(absentId),
          undefined,
        );
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
          { route: '/commerce/catalog/product' },
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
