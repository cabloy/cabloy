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

import type { ISchemaObjectExtensionField, TypeSchemaScene } from '../types/rest.js';

import { OrderUnknownBase } from '../types/database.js';

const __FilterColumnsIgnore = ['columns', 'where', 'orders', 'pageNo', 'pageSize'];

export function loadSchemaProperties(
  schema: SchemaObject | undefined,
  onGetSchema: (schemaName: string) => SchemaObject | undefined,
  schemaScene?: TypeSchemaScene,
): SchemaObject[] | undefined {
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
    const fieldSource = property.rest?.fieldSource;
    if (fieldSource) {
      const parts = fieldSource.split('.');
      const propertyParent: any =
        parts[0] === key ? property : result.find(item => item.key === parts[0]);
      property = propertyParent?.properties[parts[1]];
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
  const schemaNormalize = _normalizeSchema(toRaw(schema), onGetSchema);
  const code = jsonSchemaToZod(schemaNormalize);
  return evaluateSimple(code, { z });
}

function _normalizeSchema(
  schema: SchemaObject,
  onGetSchema: (schemaName: string) => SchemaObject | undefined,
) {
  if (!schema.properties) return schema;
  const schemaNew = Object.assign({}, schema, { properties: {} });
  for (const key in schema.properties) {
    let property = schema.properties[key] as SchemaObject | undefined;
    if (property?.$ref) {
      property = onGetSchema(property.$ref);
    }
    if (!property) continue;
    schemaNew.properties[key] = _normalizeSchema(property, onGetSchema);
  }
  return schemaNew;
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
  return schema;
}

export function getSchemaOfRequestQueryFilter(
  operationObject?: OperationObject,
  options?: { where?: boolean; order?: boolean },
) {
  const parameters = operationObject?.parameters;
  if (!parameters) return;
  const schema: SchemaObject = { type: 'object', required: [], properties: {} };
  for (const _parameter of parameters) {
    const parameter = _parameter as ParameterObject;
    if (parameter.in !== 'query') continue;
    const name = parameter.name;
    if (__FilterColumnsIgnore.includes(name)) continue;
    const fieldSchema = parameter.schema! as ISchemaObjectExtensionField;
    if (
      (options?.where === true && fieldSchema.filter?.capabilities?.where !== false) ||
      (options?.order === true && fieldSchema.filter?.capabilities?.order !== false)
    ) {
      schema.properties![name] = fieldSchema;
      if (parameter.required) schema.required!.push(name);
    }
  }
  return schema;
}
