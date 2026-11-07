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

export function closeMutationInputSchema(root: ToolSchema): void {
  const visited = new Set<ToolSchema>();
  function visit(schema: ToolSchema): void {
    if (!schema || typeof schema !== 'object' || visited.has(schema)) return;
    visited.add(schema);
    if (schema.$ref) {
      const ref = schema.$ref as string;
      const key = ref.slice('#/components/schemas/'.length).replace(/~1/g, '/').replace(/~0/g, '~');
      visit(root.components?.schemas?.[key]);
    }
    if (schema.properties && schema.additionalProperties === undefined) {
      schema.additionalProperties = false;
    }
    for (const map of [
      schema.properties,
      schema.patternProperties,
      schema.$defs,
      schema.definitions,
    ]) {
      for (const child of Object.values(map ?? {})) visit(child as ToolSchema);
    }
    for (const key of [
      'items',
      'additionalProperties',
      'additionalItems',
      'contains',
      'not',
      'if',
      'then',
      'else',
    ]) {
      const child = schema[key];
      if (Array.isArray(child)) child.forEach(visit);
      else visit(child);
    }
    // Split allOf object fragments cannot safely be closed independently.
    for (const key of ['anyOf', 'oneOf', 'prefixItems']) {
      for (const child of schema[key] ?? []) visit(child);
    }
  }
  visit(root);
}

function resolveTransportSchema(
  schema: ToolSchema,
  schemas: Record<string, ToolSchema>,
  refs = new Set<string>(),
): ToolSchema | undefined {
  if (!schema || typeof schema !== 'object') return undefined;
  let current = schema;
  while (typeof current.$ref === 'string') {
    const ref = current.$ref as string;
    if (!ref.startsWith('#/components/schemas/') || refs.has(ref)) return undefined;
    const key = ref.slice('#/components/schemas/'.length).replace(/~1/g, '/').replace(/~0/g, '~');
    const target = schemas[key];
    if (!target) return undefined;
    refs.add(ref);
    const { $ref: _ref, ...siblings } = current;
    current = { ...target, ...siblings };
  }
  return current;
}

/** Convert JSON date transport only where the OpenAPI request schema declares it. */
export function normalizeDateTransport(
  value: unknown,
  schema: ToolSchema,
  schemas: Record<string, ToolSchema>,
): unknown {
  function visit(
    currentValue: unknown,
    currentSchema: ToolSchema,
    refs = new Set<string>(),
  ): unknown {
    const resolved = resolveTransportSchema(currentSchema, schemas, refs);
    if (!resolved || currentValue === null || currentValue === undefined) return currentValue;
    if (
      (resolved.format === 'date' || resolved.format === 'date-time') &&
      (resolved.type === undefined ||
        resolved.type === 'string' ||
        (Array.isArray(resolved.type) && resolved.type.includes('string')))
    ) {
      if (currentValue instanceof Date || typeof currentValue !== 'string') return currentValue;
      const date = new Date(currentValue);
      if (Number.isNaN(date.getTime())) return currentValue;
      return date;
    }
    let result: unknown = currentValue;
    if (Array.isArray(result) && resolved.items) {
      result = result.map(item => visit(item, resolved.items, new Set(refs)));
    } else if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
      const source = result as Record<string, unknown>;
      const copy = { ...source };
      for (const [key, propertySchema] of Object.entries(resolved.properties ?? {})) {
        if (Object.hasOwn(source, key)) {
          copy[key] = visit(source[key], propertySchema as ToolSchema, new Set(refs));
        }
      }
      if (resolved.additionalProperties && typeof resolved.additionalProperties === 'object') {
        for (const key of Object.keys(source)) {
          if (!Object.hasOwn(resolved.properties ?? {}, key)) {
            copy[key] = visit(source[key], resolved.additionalProperties, new Set(refs));
          }
        }
      }
      result = copy;
    }
    for (const key of ['anyOf', 'oneOf', 'allOf']) {
      for (const branch of resolved[key] ?? []) {
        result = visit(result, branch as ToolSchema, new Set(refs));
      }
    }
    return result;
  }
  return visit(value, schema);
}

/** Convert native Dates back to JSON transport only for protocol-side validation. */
export function serializeDateTransport(
  value: unknown,
  schema: ToolSchema,
  schemas: Record<string, ToolSchema>,
): unknown {
  function visit(
    currentValue: unknown,
    currentSchema: ToolSchema,
    refs = new Set<string>(),
  ): unknown {
    const resolved = resolveTransportSchema(currentSchema, schemas, refs);
    if (!resolved || currentValue === null || currentValue === undefined) return currentValue;
    if (
      (resolved.format === 'date' || resolved.format === 'date-time') &&
      currentValue instanceof Date
    ) {
      if (Number.isNaN(currentValue.getTime())) return currentValue;
      const iso = currentValue.toISOString();
      return resolved.format === 'date' ? iso.slice(0, 10) : iso;
    }
    if (Array.isArray(currentValue) && resolved.items) {
      return currentValue.map(item => visit(item, resolved.items, new Set(refs)));
    }
    if (typeof currentValue === 'object' && !Array.isArray(currentValue)) {
      const source = currentValue as Record<string, unknown>;
      const copy = { ...source };
      for (const [key, propertySchema] of Object.entries(resolved.properties ?? {})) {
        if (Object.hasOwn(source, key)) {
          copy[key] = visit(source[key], propertySchema as ToolSchema, new Set(refs));
        }
      }
      if (resolved.additionalProperties && typeof resolved.additionalProperties === 'object') {
        for (const key of Object.keys(source)) {
          if (!Object.hasOwn(resolved.properties ?? {}, key)) {
            copy[key] = visit(source[key], resolved.additionalProperties, new Set(refs));
          }
        }
      }
      return copy;
    }
    return currentValue;
  }
  return visit(value, schema);
}

export function isPrimitiveSchema(
  schema: ToolSchema,
  schemas: Record<string, ToolSchema>,
  visited = new Set<ToolSchema | string>(),
): boolean {
  if (!schema || typeof schema !== 'object' || visited.has(schema)) return false;
  const next = new Set(visited).add(schema);
  if (schema.$ref) {
    if (next.has(schema.$ref)) return false;
    next.add(schema.$ref);
    try {
      return isPrimitiveSchema(resolveSchema(schema, schemas), schemas, next);
    } catch {
      return false;
    }
  }
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (
    types.length &&
    types.every(type => ['string', 'number', 'integer', 'boolean', 'null'].includes(type))
  ) {
    return true;
  }
  const scalar = (value: unknown) =>
    value === null || ['string', 'number', 'boolean'].includes(typeof value);
  if (Object.hasOwn(schema, 'const') && scalar(schema.const)) return true;
  if (Array.isArray(schema.enum) && schema.enum.length && schema.enum.every(scalar)) return true;
  return ['anyOf', 'oneOf'].some(
    key =>
      Array.isArray(schema[key]) &&
      schema[key].length > 0 &&
      schema[key].every((child: ToolSchema) => isPrimitiveSchema(child, schemas, next)),
  );
}

export function strictInputSchema(
  schema: ToolSchema,
  schemas: Record<string, ToolSchema>,
): ToolSchema {
  const root = resolveSchema(schema, schemas);
  if (root.type !== 'object') throw new UnsupportedActionContract('Object input required');
  return { ...root, additionalProperties: false };
}
