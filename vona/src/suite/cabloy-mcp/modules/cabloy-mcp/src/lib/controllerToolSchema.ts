import type { Tool } from '@modelcontextprotocol/server';

export type ToolSchema = Record<string, any>;

export class UnsupportedActionContract extends Error {}

export function resolveSchema(schema: ToolSchema, schemas: Record<string, ToolSchema>): ToolSchema {
  const visited = new Set<string>();
  while (schema.$ref) {
    const ref = schema.$ref as string;
    if (!ref.startsWith('#/components/schemas/') || visited.has(ref)) {
      throw new UnsupportedActionContract('Unsupported schema reference');
    }
    visited.add(ref);
    const key = ref.slice('#/components/schemas/'.length).replace(/~1/g, '/').replace(/~0/g, '~');
    const target = schemas[key];
    if (!target) throw new Error('Unresolved action schema reference');
    const { $ref: _ref, ...siblings } = schema;
    schema = { ...target, ...siblings };
  }
  return schema;
}

// Keep only reachable definitions, so projections cannot publish the original private DTO.
export function toolSchema(
  schema: ToolSchema,
  schemas: Record<string, ToolSchema>,
): Tool['inputSchema'] {
  const root = JSON.parse(JSON.stringify(schema));
  const definitions: Record<string, ToolSchema> = {};
  function visit(value: any): void {
    if (!value || typeof value !== 'object') return;
    if (typeof value.$ref === 'string') {
      const ref = value.$ref as string;
      if (!ref.startsWith('#/components/schemas/')) {
        throw new UnsupportedActionContract('Unsupported schema reference');
      }
      const key = ref.slice('#/components/schemas/'.length).replace(/~1/g, '/').replace(/~0/g, '~');
      if (!schemas[key]) throw new Error('Unresolved action schema reference');
      if (!definitions[key]) {
        definitions[key] = JSON.parse(JSON.stringify(schemas[key]));
        visit(definitions[key]);
      }
    }
    for (const child of Object.values(value)) visit(child);
  }
  visit(root);
  if (Object.keys(definitions).length) root.components = { schemas: definitions };
  return root as Tool['inputSchema'];
}

export function strictInputSchema(
  schema: ToolSchema,
  schemas: Record<string, ToolSchema>,
): ToolSchema {
  const root = resolveSchema(schema, schemas);
  if (root.type !== 'object') throw new UnsupportedActionContract('Object input required');
  return { ...root, additionalProperties: false };
}
