import type { SchemaObject } from 'openapi3-ts/oas31';
import type { ISchemaObjectExtensionField } from 'zova-module-a-openapi';

import type { IDraftProjection, IDraftSchemaOptions } from '../types/draft.ts';

interface IDraftNode {
  kind: 'scalar' | 'object' | 'array';
  shape: unknown;
  fields?: { path: string[]; node: IDraftNode }[];
  item?: IDraftNode;
  relation?: boolean;
  codec?: 'date-time';
}

export interface IDraftSchema {
  enabled: boolean;
  signature: string;
  node: IDraftNode;
}

const unsafeKeys = new Set(['__proto__', 'prototype', 'constructor']);
const omitted = Symbol('omitted');
const sensitiveName =
  /password|passwd|secret|credential|captcha|verificationCode|verifyCode|securityCode|smsCode|accessToken|refreshToken|authToken|apiKey|privateKey|signingKey|encryptionKey|oneTimePassword|otp|(?:^|[._\s])(?:token|key|pin)(?:$|[._\s])/i;
const sensitiveFormat = /^(?:password|secret|token|credential|captcha|otp|binary|byte)$/i;
const fileRenderer = /formField(?:File|Image|Upload)|^(?:file|image|upload|password|captcha)$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function safePath(key: string): string[] | undefined {
  const path = key.split('.');
  return path.every(part => part && !unsafeKeys.has(part)) ? path : undefined;
}

function effectiveSchema(schema: SchemaObject, options: IDraftSchemaOptions) {
  const rest = (schema as ISchemaObjectExtensionField).rest;
  return {
    ...schema,
    rest: {
      ...rest,
      ...(options.scene !== 'form' ? rest?.form : undefined),
      ...rest?.[options.scene],
    },
  };
}

function excluded(schema: ISchemaObjectExtensionField, key = '', includeReadonly = true) {
  const rest = schema.rest as Record<string, any> | undefined;
  const render = rest?.render;
  const renderType = isRecord(render) ? render.type : render;
  const renderProps = isRecord(render) && isRecord(render.props) ? render.props : undefined;
  return (
    rest?.draft === false ||
    (includeReadonly &&
      (schema.readOnly === true ||
        !!rest?.readonly ||
        !!rest?.options?.readonly ||
        !!renderProps?.readonly)) ||
    schema.writeOnly === true ||
    sensitiveFormat.test(schema.format ?? '') ||
    sensitiveName.test(key) ||
    fileRenderer.test(String(renderType ?? '')) ||
    sensitiveFormat.test(String(rest?.options?.type ?? renderProps?.type ?? '')) ||
    (schema as any).contentEncoding === 'base64' ||
    /^image\//i.test((schema as any).contentMediaType ?? '')
  );
}

function shapeOf(schema: SchemaObject) {
  const shape: Record<string, unknown> = {};
  for (const key of [
    'type',
    'format',
    'nullable',
    'enum',
    'const',
    'required',
    'minLength',
    'maxLength',
    'minimum',
    'maximum',
    'multipleOf',
    'exclusiveMinimum',
    'exclusiveMaximum',
    'pattern',
    'minItems',
    'maxItems',
    'uniqueItems',
  ]) {
    const value = (schema as any)[key];
    if (value !== undefined) shape[key] = value;
  }
  return shape;
}

function pathsOverlap(a: string[], b: string[]) {
  return a.slice(0, Math.min(a.length, b.length)).every((part, index) => part === b[index]);
}

function restrictNode(node: IDraftNode, blocked: string[][]): IDraftNode {
  if (node.kind !== 'object') return node;
  return {
    ...node,
    fields: (node.fields ?? []).flatMap(field => {
      const overlapping = blocked.filter(path => pathsOverlap(path, field.path));
      if (overlapping.some(path => path.length <= field.path.length)) return [];
      return [
        {
          ...field,
          node: restrictNode(
            field.node,
            overlapping.map(path => path.slice(field.path.length)),
          ),
        },
      ];
    }),
  };
}

function resolve(
  schema: SchemaObject | undefined,
  options: IDraftSchemaOptions,
  includeReadonly = true,
) {
  const seen = new Set<string>();
  while (schema) {
    if (excluded(effectiveSchema(schema, options), '', includeReadonly)) return;
    if (!schema.$ref) return schema;
    if (seen.has(schema.$ref)) return;
    seen.add(schema.$ref);
    schema = options.resolveSchema(schema.$ref);
  }
}

function primitiveValue(value: unknown) {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value))
  );
}

function primitiveSchema(schema: SchemaObject) {
  if (schema.properties || schema.items) return false;
  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    return (
      types.length > 0 &&
      types.every(type => ['string', 'boolean', 'number', 'integer', 'null'].includes(type))
    );
  }
  if (Object.hasOwn(schema, 'const')) return primitiveValue(schema.const);
  return !!schema.enum?.length && schema.enum.every(primitiveValue);
}

function nullSchema(schema: SchemaObject) {
  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    return types.length > 0 && types.every(type => type === 'null');
  }
  if (Object.hasOwn(schema, 'const')) return schema.const === null;
  return !!schema.enum?.length && schema.enum.every(value => value === null);
}

function dateTimeSchema(schema: SchemaObject) {
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  return (
    schema.format === 'date-time' &&
    types.includes('string') &&
    types.every(type => type === 'string' || type === 'null')
  );
}

function compileNode(
  schemaRaw: SchemaObject,
  options: IDraftSchemaOptions,
  ancestors: Set<SchemaObject>,
): IDraftNode | undefined {
  if (!isRecord(schemaRaw) || ancestors.has(schemaRaw)) return;
  const schema = effectiveSchema(schemaRaw, options);
  if (excluded(schema) || schema.allOf || (schema.oneOf && schema.anyOf)) return;
  const nextAncestors = new Set(ancestors).add(schemaRaw);
  const shape = shapeOf(schema);
  if (schema.$ref) {
    if (schema.oneOf || schema.anyOf || schema.properties || schema.items) return;
    const target = options.resolveSchema(schema.$ref);
    const node = target && compileNode(target, options, nextAncestors);
    if (!node) return;
    if (schema.type !== undefined) {
      const types = Array.isArray(schema.type) ? schema.type : [schema.type];
      const compatible =
        node.kind === 'scalar'
          ? primitiveSchema(schema)
          : types.length > 0 && types.every(type => type === node.kind || type === 'null');
      if (!compatible) return;
    }
    const codec =
      node.codec &&
      (schema.type === undefined || dateTimeSchema({ ...schema, format: 'date-time' })) &&
      (schema.format === undefined || schema.format === 'date-time')
        ? node.codec
        : undefined;
    return { ...node, codec, shape: { ...shape, $ref: schema.$ref, target: node.shape } };
  }
  const operator = schema.oneOf ? 'oneOf' : 'anyOf';
  const union = schema[operator];
  if (union) {
    if (!union.length || schema.properties || schema.items) return;
    const members = union.map(member =>
      compileNode(member as SchemaObject, options, nextAncestors),
    );
    if (members.some(member => !member)) return;
    const unionShape = { ...shape, [operator]: members.map(member => member!.shape) };
    const nonNull = union.flatMap((raw, index) => {
      const member = resolve(raw as SchemaObject, options);
      return member && nullSchema(member) ? [] : [members[index]!];
    });
    if (members.every(member => member!.kind === 'scalar')) {
      if (schema.type !== undefined && !primitiveSchema(schema)) return;
      const codec =
        nonNull.length > 0 &&
        nonNull.every(member => member.codec === 'date-time') &&
        (schema.type === undefined || dateTimeSchema({ ...schema, format: 'date-time' })) &&
        (schema.format === undefined || schema.format === 'date-time')
          ? 'date-time'
          : undefined;
      return { kind: 'scalar', shape: unionShape, codec };
    }
    // Structural unions remain limited to one non-null member plus safe null branches.
    if (nonNull.length !== 1 || nonNull.length === members.length) return;
    const node = nonNull[0];
    if (schema.type !== undefined) {
      const types = Array.isArray(schema.type) ? schema.type : [schema.type];
      if (!types.length || types.some(type => type !== node.kind && type !== 'null')) return;
    }
    return { ...node, shape: unionShape };
  }
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (schema.type === 'array' || schema.items) {
    if (
      schema.properties ||
      types.some(type => type !== undefined && type !== 'array' && type !== 'null')
    ) {
      return;
    }
    const itemSchema = resolve(schema.items as SchemaObject | undefined, options);
    const item = schema.items && compileNode(schema.items as SchemaObject, options, nextAncestors);
    if (!item) return;
    const identity = itemSchema?.properties?.id as SchemaObject | undefined;
    const relation =
      item.kind === 'object' &&
      !!identity &&
      !!resolve(identity, options, false) &&
      !excluded(effectiveSchema(resolve(identity, options, false)!, options), 'id', false);
    return { kind: 'array', shape, item, relation };
  }
  if (schema.type === 'object' || schema.properties) {
    if (types.some(type => type !== undefined && type !== 'object' && type !== 'null')) return;
    const fields: NonNullable<IDraftNode['fields']> = [];
    const blocked: string[][] = [];
    // The runtime loader deduplicates aliases. Inspect their safety metadata before that
    // deduplication so an excluded alias cannot make its canonical source persistable.
    for (const [key, raw] of Object.entries(schema.properties ?? {})) {
      const resolvedProperty = resolve(raw as SchemaObject, options);
      const property = effectiveSchema(resolvedProperty ?? (raw as SchemaObject), options);
      const path = safePath(property.rest?.fieldSource ?? key);
      if (path && (!resolvedProperty || excluded(property, key))) blocked.push(path);
    }
    for (const property of options.loadProperties(schema, options.scene) ?? []) {
      const key = property.key ?? '';
      const path = safePath(key);
      if (!path) continue;
      if (excluded(property, [key, property.schemaKey, ...(property.schemaKeys ?? [])].join(' '))) {
        blocked.push(path);
        continue;
      }
      const node = compileNode(property, options, nextAncestors);
      if (!node) {
        blocked.push(path);
        continue;
      }
      fields.push({ path, node });
    }
    // Prefer the declared object over a duplicate flattened alias, but carry all alias
    // safety exclusions down into that object so unrelated sibling fields still persist.
    const uniqueFields = fields.filter(
      (field, index) =>
        !fields.some(
          (other, otherIndex) =>
            otherIndex !== index &&
            pathsOverlap(other.path, field.path) &&
            (other.path.length < field.path.length ||
              (other.path.length === field.path.length && otherIndex < index)),
        ),
    );
    uniqueFields.sort((a, b) => JSON.stringify(a.path).localeCompare(JSON.stringify(b.path)));
    return restrictNode({ kind: 'object', shape, fields: uniqueFields }, blocked);
  }
  // Scalar eligibility is structural, not submit validation: unfinished primitive values
  // still use the ordinary projection policy without selecting a union branch.
  if (primitiveSchema(schema)) {
    return { kind: 'scalar', shape, codec: dateTimeSchema(schema) ? 'date-time' : undefined };
  }
}

function describeNode(node: IDraftNode): unknown {
  return [
    node.kind,
    node.shape,
    node.relation ?? false,
    node.fields?.map(field => [field.path, describeNode(field.node)]),
    node.item && describeNode(node.item),
    ...(node.codec ? [node.codec] : []),
  ];
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`;
  if (isRecord(value)) {
    return `{${Object.keys(value)
      .sort()
      .map(key => `${JSON.stringify(key)}:${stableSerialize(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value) ?? 'undefined';
}

function fingerprint(value: unknown) {
  const text = stableSerialize(value);
  let a = 2166136261;
  let b = 2246822507;
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    a = Math.imul(a ^ code, 16777619);
    b = Math.imul(b ^ code, 3266489909);
  }
  return `${(a >>> 0).toString(16).padStart(8, '0')}${(b >>> 0).toString(16).padStart(8, '0')}`;
}

export function createDraftSchema(
  schema: SchemaObject,
  options: IDraftSchemaOptions,
): IDraftSchema {
  const node = compileNode(schema, options, new Set());
  return {
    enabled: !!node,
    signature: fingerprint(node && describeNode(node)),
    node: node ?? { kind: 'object', shape: {}, fields: [] },
  };
}

function getPath(value: unknown, path: string[]) {
  let current = value;
  for (const part of path) {
    if (!isRecord(current) || !Object.hasOwn(current, part)) return omitted;
    current = current[part];
  }
  return current;
}

function setPath(target: Record<string, unknown>, path: string[], value: unknown) {
  for (const part of path.slice(0, -1)) {
    if (!isRecord(target[part])) target[part] = {};
    target = target[part] as Record<string, unknown>;
  }
  target[path[path.length - 1]] = value;
}

function rowId(value: unknown): string | number | undefined {
  if (!isRecord(value)) return;
  const id = value.id;
  return typeof id === 'string' || (typeof id === 'number' && Number.isFinite(id)) ? id : undefined;
}

function dateValue(value: unknown) {
  if (!(value instanceof Date)) return;
  try {
    const time = Date.prototype.getTime.call(value);
    return Number.isFinite(time) ? time : undefined;
  } catch {
    // Objects with a forged Date prototype have no native date value.
  }
}

function projectNode(
  node: IDraftNode,
  value: unknown,
  baseline: unknown,
  path: (string | number)[],
  projection: IDraftProjection,
  ancestors: Set<object>,
): unknown {
  if (value === omitted) return omitted;
  if (value === undefined) {
    projection.undefinedPaths.push(JSON.stringify(path));
    return omitted;
  }
  if (value === null) return null;
  if (node.codec === 'date-time' && value instanceof Date) {
    const time = dateValue(value);
    return time === undefined ? omitted : Date.prototype.toISOString.call(new Date(time));
  }
  if (typeof value === 'object') {
    if (ancestors.has(value) || (!Array.isArray(value) && !isRecord(value))) return omitted;
    ancestors = new Set(ancestors).add(value);
  }
  if (node.kind === 'scalar') {
    return typeof value === 'string' ||
      typeof value === 'boolean' ||
      (typeof value === 'number' && Number.isFinite(value))
      ? value
      : omitted;
  }
  if (node.kind === 'object') {
    if (!isRecord(value)) return omitted;
    const result: Record<string, unknown> = {};
    for (const field of node.fields ?? []) {
      const projected = projectNode(
        field.node,
        getPath(value, field.path),
        getPath(baseline, field.path),
        [...path, ...field.path],
        projection,
        ancestors,
      );
      if (projected !== omitted) setPath(result, field.path, projected);
    }
    return result;
  }
  if (!Array.isArray(value)) return omitted;
  const rows = Array.isArray(baseline) ? baseline : [];
  const result: unknown[] = [];
  const identities: NonNullable<IDraftProjection['relations'][string]> = [];
  for (const row of value) {
    const index = result.length;
    const id = node.relation ? rowId(row) : undefined;
    const baselineRow = id === undefined ? rows[index] : rows.find(item => rowId(item) === id);
    const projected = projectNode(
      node.item!,
      row,
      baselineRow,
      [...path, index],
      projection,
      ancestors,
    );
    if (projected === omitted && row !== undefined) continue;
    result.push(projected === omitted ? null : projected);
    if (node.relation) {
      identities.push({
        ...(id !== undefined ? { id } : {}),
        ...(id !== undefined && isRecord(row) && row.deleted === true ? { deleted: true } : {}),
      });
    }
  }
  if (node.relation) projection.relations[JSON.stringify(path)] = identities;
  return result;
}

export function projectDraftValues(
  schema: IDraftSchema,
  values: unknown,
  baseline?: unknown,
): IDraftProjection {
  const projection: IDraftProjection = { values: {}, relations: {}, undefinedPaths: [] };
  if (!schema.enabled) return projection;
  const result = projectNode(schema.node, values, baseline, [], projection, new Set());
  if (isRecord(result)) projection.values = result;
  return projection;
}

function cloneBaseline(value: unknown, ancestors = new Set<object>()): unknown {
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value;
  }
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value !== 'object' || ancestors.has(value)) return;
  if (value instanceof Date) {
    const time = dateValue(value);
    return time === undefined ? undefined : new Date(time);
  }
  if (!Array.isArray(value) && !isRecord(value)) return;
  const next = new Set(ancestors).add(value);
  if (Array.isArray(value)) return value.map(item => cloneBaseline(item, next));
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    if (!unsafeKeys.has(key)) result[key] = cloneBaseline(value[key], next);
  }
  return result;
}

function restoreNode(
  node: IDraftNode,
  value: unknown,
  baseline: unknown,
  path: (string | number)[],
  projection: IDraftProjection,
  undefinedPaths: Set<string>,
): unknown {
  if (undefinedPaths.has(JSON.stringify(path))) return undefined;
  if (value === omitted) return cloneBaseline(baseline === omitted ? undefined : baseline);
  if (value === null) return null;
  if (node.kind === 'scalar') {
    if (
      typeof value === 'string' ||
      typeof value === 'boolean' ||
      (typeof value === 'number' && Number.isFinite(value))
    ) {
      return value;
    }
    return cloneBaseline(baseline === omitted ? undefined : baseline);
  }
  if (node.kind === 'object') {
    const cloned = cloneBaseline(baseline);
    const result = isRecord(cloned) ? cloned : {};
    for (const field of node.fields ?? []) {
      setPath(
        result,
        field.path,
        restoreNode(
          field.node,
          getPath(value, field.path),
          getPath(baseline, field.path),
          [...path, ...field.path],
          projection,
          undefinedPaths,
        ),
      );
    }
    return result;
  }
  if (!Array.isArray(value)) return cloneBaseline(baseline);
  const rows = Array.isArray(baseline) ? baseline : [];
  const identities = projection.relations[JSON.stringify(path)];
  if (node.relation && (!Array.isArray(identities) || identities.length !== value.length))
    throw new Error('Invalid draft relation');
  const used = new Set<string>();
  return value.map((row, index) => {
    const identity = node.relation ? identities[index] : undefined;
    const id = identity?.id;
    let baselineRow = rows[index];
    if (node.relation) {
      baselineRow = undefined;
      if (id !== undefined) {
        if (typeof id !== 'string' && (typeof id !== 'number' || !Number.isFinite(id)))
          throw new Error('Invalid draft identity');
        const key = `${typeof id}:${id}`;
        const matches = rows.filter(item => rowId(item) === id);
        if (used.has(key) || matches.length !== 1) throw new Error('Changed draft relation');
        used.add(key);
        baselineRow = matches[0];
      }
    }
    const restored = restoreNode(
      node.item!,
      row,
      baselineRow,
      [...path, index],
      projection,
      undefinedPaths,
    );
    if (node.relation && isRecord(restored)) {
      if (id === undefined) {
        delete restored.id;
        delete restored.deleted;
      } else {
        restored.id = id;
        if (identity?.deleted === true) restored.deleted = true;
      }
    }
    return restored;
  });
}

export function restoreDraftValues<T extends {}>(
  schema: IDraftSchema,
  projection: IDraftProjection,
  baseline: T,
): T | undefined {
  if (
    !schema.enabled ||
    !isRecord(projection) ||
    !isRecord(projection.values) ||
    !isRecord(projection.relations) ||
    !Array.isArray(projection.undefinedPaths) ||
    !projection.undefinedPaths.every(path => typeof path === 'string')
  ) {
    return;
  }
  try {
    // Re-project untrusted stored values under current schema; only validated identity
    // metadata participates in reconstruction, and undeclared keys never enter the form.
    const sanitized = projectDraftValues(schema, projection.values, baseline);
    sanitized.relations = projection.relations;
    return restoreNode(
      schema.node,
      sanitized.values,
      baseline,
      [],
      sanitized,
      new Set(projection.undefinedPaths),
    ) as T;
  } catch {
    // Invalid identity metadata or unsupported stored data is not recoverable.
  }
}

function normalizeBaseline(node: IDraftNode, baseline: unknown): unknown {
  if (
    node.codec === 'date-time' &&
    typeof baseline === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(baseline)
  ) {
    const date = new Date(baseline);
    if (dateValue(date) !== undefined) return Date.prototype.toISOString.call(date);
  }
  if (node.kind === 'array' && Array.isArray(baseline)) {
    const rows = baseline.map(row => normalizeBaseline(node.item!, row));
    if (node.relation && rows.every(row => rowId(row) !== undefined)) {
      rows.sort((a, b) =>
        `${typeof rowId(a)}:${rowId(a)}`.localeCompare(`${typeof rowId(b)}:${rowId(b)}`),
      );
    }
    return rows;
  }
  if (node.kind === 'object' && isRecord(baseline)) {
    const result = cloneBaseline(baseline) as Record<string, unknown>;
    for (const field of node.fields ?? []) {
      const value = getPath(baseline, field.path);
      if (value !== omitted) setPath(result, field.path, normalizeBaseline(field.node, value));
    }
    return result;
  }
  return baseline;
}

export function draftBaselineSignature(schema: IDraftSchema, baseline: unknown): string {
  const normalized = normalizeBaseline(schema.node, baseline);
  return fingerprint(projectDraftValues(schema, normalized, normalized));
}
