import type {
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  SchemaObject,
} from 'openapi3-ts/oas31';

import jsonSchemaToZod from '@cabloy/json-schema-to-zod';
import { evaluateSimple } from '@cabloy/utils';
import { toRaw } from 'vue';
import { z } from 'zod';
import { cast, deepExtend } from 'zova';

import type {
  IQueryCapabilities,
  ISchemaObjectExtensionField,
  TypeSchemaScene,
} from '../types/rest.ts';

import { OrderUnknownBase } from '../types/database.ts';

const __FilterColumnsIgnore = ['columns', 'where', 'orders', 'pageNo', 'pageSize'];

export function loadSchemaProperties(
  schema: SchemaObject | undefined,
  onGetSchema: (schemaName: string) => SchemaObject | undefined,
  schemaScene?: TypeSchemaScene,
): ISchemaObjectExtensionField[] | undefined {
  if (!schema) return;
  const properties = schema.properties!;
  const result: ISchemaObjectExtensionField[] = [];
  // filter
  for (let key in properties) {
    let property = properties[key] as ISchemaObjectExtensionField;
    if (property.$ref) {
      property = onGetSchema(property.$ref)!;
    }
    if (!property) continue;
    const schemaKey = key;
    const propertyRest = deepExtend(
      {},
      property.rest,
      schemaScene && ['form-view', 'form-create', 'filter'].includes(schemaScene)
        ? property.rest?.form
        : undefined,
      schemaScene ? property.rest?.[schemaScene] : undefined,
    );
    const fieldSource = propertyRest?.fieldSource;
    if (fieldSource) {
      const parts = fieldSource.split('.');
      let propertyParent =
        parts[0] === schemaKey
          ? property
          : (properties[parts[0]] as ISchemaObjectExtensionField | undefined);
      if (propertyParent?.$ref) {
        propertyParent = onGetSchema(propertyParent.$ref)!;
      }
      property = propertyParent?.properties?.[parts[1]] as ISchemaObjectExtensionField;
      key = fieldSource;
    }
    if (!property) continue;
    property = deepExtend(
      { key },
      property,
      schemaScene && ['form-view', 'form-create', 'filter'].includes(schemaScene)
        ? { rest: property.rest?.['form'] ?? {} }
        : undefined,
      schemaScene ? { rest: property.rest?.[schemaScene] ?? {} } : undefined,
    );
    if (schemaKey !== key) {
      property.schemaKey = schemaKey;
    }
    const propertyExisting = result.find(item => item.key === key);
    if (propertyExisting) {
      propertyExisting.schemaKeys = [...(propertyExisting.schemaKeys ?? []), schemaKey];
      continue;
    }
    result.push(property);
  }
  // sort
  result.sort((a, b) => {
    return (a.rest?.order ?? OrderUnknownBase) - (b.rest?.order ?? OrderUnknownBase);
  });
  // ok
  return result;
}

export function schemaToZodSchema<T extends z.ZodType = z.ZodType>(
  schema: SchemaObject,
  onGetSchema: (schemaName: string) => SchemaObject | undefined,
): T {
  // Compile each schema once. Only back-edges use lazy: ordinary form roots remain
  // ZodObjects, while recursive predicate refs never degrade to the converter's any.
  const schemas: z.ZodType[] = [];
  const pendingSchema = Symbol('pendingSchema');
  const formEntries = new WeakMap<object, number | typeof pendingSchema>();
  const queryEntries = new WeakMap<object, number | typeof pendingSchema>();
  const formReferences = new Set<string>();
  const queryReferences = new Set<string>();

  function compile(
    input: SchemaObject | boolean,
    strictQuery = false,
    nested = false,
  ): z.ZodType | typeof pendingSchema {
    if (typeof input === 'boolean') {
      if (input && strictQuery) throw new Error('Unsupported unrestricted query schema');
      return input ? z.any() : z.never();
    }
    input = toRaw(input);
    const capabilities = getQueryCapabilities(input);
    // Capabilities also live on ordinary named-filter form roots. Only public
    // where/orders subtrees use strict JSON operands; forms must stay ZodObjects
    // with their existing primitive coercion, even when they advertise sorting.
    const querySchema = strictQuery || (!!capabilities && input.type !== 'object');
    const entries = querySchema ? queryEntries : formEntries;
    const references = querySchema ? queryReferences : formReferences;
    if (input.$ref) {
      const target = onGetSchema(input.$ref);
      if (!target) {
        if (nested && !querySchema) return pendingSchema;
        throw new Error(`Unresolved schema reference: ${input.$ref}`);
      }
      // A ref-only cycle has no validating structure to anchor a lazy schema.
      if (references.has(input.$ref)) {
        const index = entries.get(toRaw(target));
        if (index === undefined) throw new Error(`Cyclic schema reference: ${input.$ref}`);
        if (index === pendingSchema) return pendingSchema;
        return schemas[index] ?? z.lazy(() => schemas[index]);
      }
      references.add(input.$ref);
      try {
        return compile(target, querySchema, nested);
      } finally {
        references.delete(input.$ref);
      }
    }
    const existing = entries.get(input);
    if (existing === pendingSchema) return pendingSchema;
    if (existing !== undefined) return schemas[existing] ?? z.lazy(() => schemas[existing]);
    const source = input;
    const index = schemas.length;
    schemas.length++;
    entries.set(source, index);
    try {
      if (!querySchema && input.properties) {
        // Ordinary schemas arrive reactively. Omit only the pending property for
        // this render; resolver reads keep the next computation reactive.
        const properties: NonNullable<SchemaObject['properties']> = {};
        for (const [key, property] of Object.entries(input.properties)) {
          const publicControl = !!capabilities && (key === 'where' || key === 'orders');
          if (compile(property as SchemaObject, publicControl, true) !== pendingSchema) {
            properties[key] = property;
          }
        }
        input = {
          ...input,
          properties,
          required: input.required?.filter(key => key in properties),
        };
      }
      const code = jsonSchemaToZod(input, {
        parserOverride: (node, refs) => {
          if (refs.path.length > 0) {
            const publicControl =
              !!capabilities &&
              refs.path[0] === 'properties' &&
              (refs.path[1] === 'where' || refs.path[1] === 'orders');
            const child = compile(node as SchemaObject, querySchema || publicControl, true);
            if (child === pendingSchema) throw pendingSchema;
            const childIndex = schemas.push(child) - 1;
            return `schemas[${childIndex}]`;
          }
          // The upstream oneOf code contains TypeScript and cannot be evaluated as
          // JavaScript. Preserve exact-one semantics without an any fallback.
          if (node.oneOf) {
            if (!node.oneOf.length) throw new Error('Unsupported empty oneOf schema');
            const branches: z.ZodType[] = [];
            let pending = false;
            for (const branch of node.oneOf) {
              const compiled = compile(branch as SchemaObject, querySchema, true);
              if (compiled === pendingSchema) pending = true;
              else branches.push(compiled);
            }
            if (pending) throw pendingSchema;
            let result: z.ZodType = z.union(branches);
            result = result.refine(
              value => branches.filter(branch => branch.safeParse(value).success).length === 1,
            );
            if (node.nullable) result = result.nullable();
            if (node.description) result = result.describe(node.description);
            if (node.default !== undefined) result = result.default(node.default);
            const branchIndex = schemas.push(result) - 1;
            return `schemas[${branchIndex}]`;
          }
          if (node.anyOf?.length === 0) throw new Error('Unsupported empty anyOf schema');
          if (querySchema) {
            for (const key of [
              'prefixItems',
              'contains',
              'unevaluatedProperties',
              'dependentSchemas',
              'patternProperties',
              'if',
              'then',
              'else',
            ]) {
              if (key in node) throw new Error(`Unsupported query schema keyword: ${key}`);
            }
          }
        },
      });
      if (querySchema && code.includes('z.any()')) {
        throw new Error('Unsupported unrestricted query schema');
      }
      let result: z.ZodType = evaluateSimple(code, { z, schemas });
      if (querySchema) {
        // Zova's form parse adapter intentionally coerces primitive values. Public
        // query values are JSON scalars: reject mismatched types before that adapter
        // runs, without changing ordinary forms or the process-global Zod adapter.
        const acceptsType = (value: unknown, type: string) => {
          if (type === 'null') return value === null;
          if (type === 'array') return Array.isArray(value);
          if (type === 'object')
            return value !== null && typeof value === 'object' && !Array.isArray(value);
          if (type === 'integer') return typeof value === 'number' && Number.isInteger(value);
          if (type === 'string') return typeof value === 'string';
          if (type === 'number') return typeof value === 'number';
          if (type === 'boolean') return typeof value === 'boolean';
          return false;
        };
        const queryInput = input;
        result = z
          .custom(value => {
            if ((queryInput as SchemaObject & { nullable?: boolean }).nullable && value === null)
              return true;
            if (queryInput.type) {
              const types = Array.isArray(queryInput.type) ? queryInput.type : [queryInput.type];
              if (!types.some(type => acceptsType(value, type))) return false;
            }
            if ('const' in queryInput && value !== queryInput.const) return false;
            if (queryInput.enum && !queryInput.enum.includes(value)) return false;
            return true;
          })
          .pipe(result);
      }
      schemas[index] = result;
      return schemas[index];
    } catch (error) {
      if (error !== pendingSchema) {
        entries.delete(source);
        throw error;
      }
      entries.set(source, pendingSchema);
      return pendingSchema;
    }
  }

  const result = compile(schema);
  if (result === pendingSchema) throw new Error('Unresolved schema reference in root schema');
  return result as T;
}

export function getSchemaOfRequestBody(
  operationObject?: OperationObject,
): SchemaObject | undefined {
  return cast<RequestBodyObject>(operationObject?.requestBody)?.content?.['application/json']
    ?.schema as any;
}

export function getSchemaOfResponseBody(
  operationObject?: OperationObject,
): SchemaObject | undefined {
  return operationObject?.responses?.['200']?.content?.['application/json']?.schema;
}

export function getQueryCapabilities(schema?: SchemaObject): IQueryCapabilities | undefined {
  const capabilities = (schema as ISchemaObjectExtensionField | undefined)?.filter?.capabilities
    ?.query;
  if (capabilities) return capabilities;
  for (const name of ['orders', 'where']) {
    const field = schema?.properties?.[name] as ISchemaObjectExtensionField | undefined;
    if (field?.filter?.capabilities?.query) return field.filter.capabilities.query;
  }
}

// UI column mapping only. Canonical orders supplied by callers are never rewritten.
export function getQueryOrderField(schema: SchemaObject | undefined, column: string): string {
  return getQueryCapabilities(schema)?.conveniences?.[column]?.field ?? column;
}

export function getSchemaOfRequestQuery(
  operationObject?: OperationObject,
): SchemaObject | undefined {
  const parameters = operationObject?.parameters;
  if (!parameters) return;
  const schema: SchemaObject = { type: 'object', required: [], properties: {} };
  for (const _parameter of parameters) {
    const parameter = _parameter as ParameterObject;
    if (parameter.in !== 'query') continue;
    const name = parameter.name;
    const fieldSchema = parameter.schema! as SchemaObject;
    schema.properties![name] = fieldSchema;
    if (parameter.required) schema.required!.push(name);
  }
  const query = getQueryCapabilities(schema);
  if (query) (schema as ISchemaObjectExtensionField).filter = { capabilities: { query } };
  return schema;
}

export function getSchemaOfRequestQueryFilter(
  operationObject?: OperationObject,
  options?: { where?: boolean; order?: boolean },
) {
  const parameters = operationObject?.parameters;
  if (!parameters) return;
  const schema: ISchemaObjectExtensionField = { type: 'object', required: [], properties: {} };
  const query = getQueryCapabilities(getSchemaOfRequestQuery(operationObject));
  if (query) schema.filter = { capabilities: { query } };
  // Ordering belongs to the public query policy, not the named convenience DTO.
  if (options?.order) return schema;
  for (const _parameter of parameters) {
    const parameter = _parameter as ParameterObject;
    if (parameter.in !== 'query') continue;
    const name = parameter.name;
    if (__FilterColumnsIgnore.includes(name)) continue;
    const fieldSchema = parameter.schema! as ISchemaObjectExtensionField;
    if (options?.where === true && fieldSchema.filter?.capabilities?.where !== false) {
      schema.properties![name] = fieldSchema;
      if (parameter.required) schema.required!.push(name);
    }
  }
  return schema;
}
