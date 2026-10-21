import type { CallToolResult, Tool } from '@modelcontextprotocol/server';
import type { VonaApplication } from 'vona';

import { ProtocolError, Server } from '@modelcontextprotocol/server';
import { appResource } from 'vona';
import { $schema } from 'vona-module-a-openapiutils';
import {
  DtoProductPublic,
  DtoProductPublicDetail,
  DtoProductPublicSelectReq,
  DtoProductPublicSelectRes,
} from 'vona-module-commerce-catalog';
import z from 'zod';

// In-process business composition only; no route, listener or production admission.
// Each message must run inside its caller-owned ordinary Vona request context.
export async function createBusinessToolServer(app: VonaApplication): Promise<Server> {
  const document = await app.bean.openapi.generateJsonOfClasses(
    [
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
    description: 'Search published, available products using the public commerce catalog.',
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
    description: 'View one published, available product using the public commerce catalog.',
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

  server.setRequestHandler('tools/list', async () => {
    if (!app.ctx) throw new ProtocolError(-32603, 'Request context required');
    return { tools: [searchTool, detailTool] };
  });
  server.setRequestHandler('tools/call', async request => {
    if (request.params.name !== searchTool.name && request.params.name !== detailTool.name) {
      throw new ProtocolError(-32602, 'Unknown tool');
    }
    if (!app.ctx) throw new ProtocolError(-32603, 'Request context required');
    if (request.params.name === detailTool.name) {
      const input = await detailInput.safeParseAsync(request.params.arguments ?? {});
      if (!input.success) throw new ProtocolError(-32602, 'Invalid tool arguments');
      try {
        const result = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/public/:id',
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
        '/commerce/catalog/product/public',
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
  });
  return server;
}
