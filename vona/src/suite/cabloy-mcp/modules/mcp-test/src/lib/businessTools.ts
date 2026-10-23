import type { CallToolResult, Tool } from '@modelcontextprotocol/server';
import type { VonaApplication } from 'vona';

import { ProtocolError, Server } from '@modelcontextprotocol/server';
import { appResource, runWithZodQueryCoercion } from 'vona';
import { $schema } from 'vona-module-a-openapiutils';
import z from 'zod';

import { DtoCategoryPublic } from '../dto/categoryPublic.tsx';
import { DtoCategoryPublicSelectReq } from '../dto/categoryPublicSelectReq.tsx';
import { DtoCategoryPublicSelectRes } from '../dto/categoryPublicSelectRes.tsx';
import { DtoProductPublic } from '../dto/productPublic.tsx';
import { DtoProductPublicDetail } from '../dto/productPublicDetail.tsx';
import { DtoProductPublicSelectReq } from '../dto/productPublicSelectReq.tsx';
import { DtoProductPublicSelectRes } from '../dto/productPublicSelectRes.tsx';

// Composition for integration tests and the explicit local verification entry.
// Each message must run inside its caller-owned ordinary Vona request context.
export async function createBusinessToolServer(
  app: VonaApplication,
): Promise<Server & { settleWork(): Promise<void> }> {
  return runWithZodQueryCoercion(true, async () => {
    const work = new Set<Promise<unknown>>();
    function track<T>(fn: () => Promise<T>): Promise<T> {
      const pending = Promise.resolve().then(() => runWithZodQueryCoercion(true, fn));
      work.add(pending);
      void pending.then(
        () => work.delete(pending),
        () => work.delete(pending),
      );
      return pending;
    }
    const document = await app.bean.openapi.generateJsonOfClasses(
      [
        DtoCategoryPublic,
        DtoCategoryPublicSelectReq,
        DtoCategoryPublicSelectRes,
        DtoProductPublicSelectReq,
        DtoProductPublicSelectRes,
        DtoProductPublic,
        DtoProductPublicDetail,
      ],
      'V31',
    );
    const schemas = document.components!.schemas!;
    const searchTool: Tool = {
      name: 'commerce_products_search',
      description: 'Search published, available products using the synthetic MCP test catalog.',
      inputSchema: {
        ...schemas[appResource.getBeanFullName(DtoProductPublicSelectReq)!],
        additionalProperties: false,
      } as Tool['inputSchema'],
      outputSchema: {
        ...schemas[appResource.getBeanFullName(DtoProductPublicSelectRes)!],
        // Retain document-local references to the existing public product/SKU DTOs.
        components: { schemas },
      } as Tool['outputSchema'],
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    };
    const categoriesTool: Tool = {
      name: 'commerce_categories_list',
      description:
        'List published categories in the synthetic MCP test directory, including categories without available products.',
      inputSchema: {
        ...schemas[appResource.getBeanFullName(DtoCategoryPublicSelectReq)!],
        additionalProperties: false,
      } as Tool['inputSchema'],
      outputSchema: {
        ...schemas[appResource.getBeanFullName(DtoCategoryPublicSelectRes)!],
        components: { schemas },
      } as Tool['outputSchema'],
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    };
    const publicSchema = schemas[appResource.getBeanFullName(DtoProductPublic)!];
    const publicValidator = $schema(DtoProductPublic);
    if (
      !('properties' in publicSchema) ||
      !publicSchema.properties?.id ||
      !(publicValidator instanceof z.ZodObject)
    ) {
      throw new Error('Public product schema unavailable');
    }
    const detailTool: Tool = {
      name: 'commerce_product_detail',
      description: 'View one published, available product using the synthetic MCP test catalog.',
      inputSchema: {
        type: 'object',
        properties: { id: publicSchema.properties.id },
        required: ['id'],
        additionalProperties: false,
        components: { schemas },
      } as unknown as Tool['inputSchema'],
      outputSchema: {
        ...schemas[appResource.getBeanFullName(DtoProductPublicDetail)!],
        components: { schemas },
      } as Tool['outputSchema'],
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    };
    const detailInput = z.strictObject({
      // Vona's query coercion must not turn a JSON boolean/object into an identity.
      id: z
        .custom<string | number>(value => typeof value === 'string' || typeof value === 'number')
        .pipe(publicValidator.shape.id),
    });
    const server = new Server(
      { name: 'cabloy-mcp-business', version: '0.1.0' },
      { capabilities: { tools: {} } },
    );

    server.setRequestHandler('tools/list', () =>
      track(async () => {
        if (!app.ctx) throw new ProtocolError(-32603, 'Request context required');
        return { tools: [searchTool, detailTool, categoriesTool] };
      }),
    );
    server.setRequestHandler('tools/call', request =>
      track(async () => {
        if (
          request.params.name !== searchTool.name &&
          request.params.name !== detailTool.name &&
          request.params.name !== categoriesTool.name
        ) {
          throw new ProtocolError(-32602, 'Unknown tool');
        }
        if (!app.ctx) throw new ProtocolError(-32603, 'Request context required');
        if (request.params.name === categoriesTool.name) {
          const args = request.params.arguments ?? {};
          // Vona enhances even z.number() with query coercion; check raw JSON types first.
          if (
            ['pageNo', 'pageSize'].some(
              key => args[key] !== undefined && typeof args[key] !== 'number',
            )
          ) {
            throw new ProtocolError(-32602, 'Invalid tool arguments');
          }
          const input = await $schema(DtoCategoryPublicSelectReq, { strict: true }).safeParseAsync(
            args,
          );
          if (!input.success) throw new ProtocolError(-32602, 'Invalid tool arguments');
          try {
            const result = await app.bean.executor.performAction(
              'get',
              '/mcp/test/catalog/categories',
              { query: input.data, innerAccess: false },
            );
            const output = await $schema(DtoCategoryPublicSelectRes).parseAsync(result);
            return {
              content: [{ type: 'text', text: JSON.stringify(output) }],
              structuredContent: output,
            } as CallToolResult;
          } catch {
            return {
              isError: true,
              content: [{ type: 'text', text: 'Category listing failed' }],
            };
          }
        }
        if (request.params.name === detailTool.name) {
          const input = await detailInput.safeParseAsync(request.params.arguments ?? {});
          if (!input.success) throw new ProtocolError(-32602, 'Invalid tool arguments');
          try {
            const result = await app.bean.executor.performAction(
              'get',
              '/mcp/test/catalog/products/:id',
              { params: { id: input.data.id }, innerAccess: false },
            );
            if (result === null || result === undefined) {
              return {
                isError: true,
                content: [{ type: 'text', text: 'Product not found' }],
              };
            }
            const output = await $schema(DtoProductPublicDetail).parseAsync(result);
            return {
              content: [{ type: 'text', text: JSON.stringify(output) }],
              structuredContent: output,
            } as CallToolResult;
          } catch {
            return {
              isError: true,
              content: [{ type: 'text', text: 'Product detail failed' }],
            };
          }
        }
        const input = await $schema(DtoProductPublicSelectReq, { strict: true }).safeParseAsync(
          request.params.arguments ?? {},
        );
        if (!input.success) throw new ProtocolError(-32602, 'Invalid tool arguments');
        try {
          const result = await app.bean.executor.performAction(
            'get',
            '/mcp/test/catalog/products',
            { query: input.data, innerAccess: false },
          );
          // DTO parsing projects every declared object (including nested SKUs) and validates it.
          // Never fall back to the unfiltered executor value on a validation failure.
          const output = await $schema(DtoProductPublicSelectRes).parseAsync(result);
          return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output,
          } as CallToolResult;
        } catch {
          return {
            isError: true,
            content: [{ type: 'text', text: 'Product search failed' }],
          };
        }
      }),
    );
    return Object.assign(server, {
      async settleWork() {
        while (work.size) await Promise.allSettled([...work]);
      },
    });
  });
}
