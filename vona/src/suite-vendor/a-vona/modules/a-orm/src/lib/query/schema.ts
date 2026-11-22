import { runWithZodQueryCoercion } from 'vona';
import z from 'zod';

import type { IAnalysisPolicy, TypeAnalysisMode } from '../../types/analysis.ts';
import type {
  IQueryField,
  IQueryLimits,
  IQueryPolicy,
  TypeQueryInput,
  TypeQueryPredicate,
  TypeQueryScalarPredicate,
} from '../../types/query.ts';

import { analysisControlSchemas } from '../analysis/controls.ts';

export class PublicQueryError extends Error {
  readonly status = 422;
  readonly code = 422;
  readonly queryCode: string;
  readonly path: string;
  readonly errors: { queryCode: string; path: string };
  constructor(queryCode: string, path: string = '', message = 'Invalid public query') {
    super(message);
    this.queryCode = queryCode;
    this.path = path.slice(0, 256);
    this.errors = { queryCode, path: this.path };
    this.name = 'PublicQueryError';
  }
}
export function queryFailure(code: string, path = ''): never {
  throw new PublicQueryError(code, path);
}

/** Bounds recursion before any recursive validator or SQL compiler sees input. */
export function checkQueryBudget(input: unknown, limits: Readonly<IQueryLimits>) {
  const pending = [{ value: input, depth: 0, path: '' }];
  const seen = new Set<object>();
  let nodes = 0;
  while (pending.length) {
    const { value, depth, path } = pending.pop()!;
    if (++nodes > limits.maxNodes || depth > limits.maxValueDepth)
      queryFailure('query_complexity', path);
    if (typeof value === 'string' && value.length > limits.maxStringLength)
      queryFailure('query_string_length', path);
    if (!value || typeof value !== 'object') continue;
    if (seen.has(value)) queryFailure('query_cycle', path);
    seen.add(value);
    if (Array.isArray(value) && value.length > limits.maxListItems)
      queryFailure('query_list_length', path);
    if (
      !Array.isArray(value) &&
      Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null
    ) {
      queryFailure('query_shape', path);
    }
    for (const [key, child] of Object.entries(value)) {
      if (child !== undefined)
        pending.push({ value: child, depth: depth + 1, path: path ? `${path}.${key}` : key });
    }
  }
  let bytes: number;
  try {
    bytes = Buffer.byteLength(JSON.stringify(input) ?? '', 'utf8');
  } catch {
    queryFailure('query_shape');
  }
  if (bytes! > limits.maxBytes) queryFailure('query_bytes');
}

const predicates = new WeakMap<IQueryPolicy, z.ZodType<TypeQueryPredicate>>();
function scalarPredicateSchema(
  fields: Readonly<Record<string, IQueryField>>,
  limits: Readonly<IQueryLimits>,
  name: string,
): { schema: z.ZodType<TypeQueryScalarPredicate>; leaves: z.ZodType[] } {
  const leaves: z.ZodType[] = [];
  for (const [field, info] of Object.entries(fields)) {
    const scalar =
      info.type === 'string'
        ? (info.schema as z.ZodString).max(limits.maxStringLength)
        : info.schema;
    for (const kind of ['scalar', 'list', 'null'] as const) {
      const operators = info.operators.filter(
        op =>
          (op === 'isNull' || op === 'isNotNull'
            ? 'null'
            : op === 'in' || op === 'notIn'
              ? 'list'
              : 'scalar') === kind,
      );
      if (!operators.length) continue;
      const shape: Record<string, z.ZodType> = {
        field: z.literal(field),
        op: z.enum(operators as [string, ...string[]]),
      };
      if (kind !== 'null') {
        shape.value = kind === 'list' ? z.array(scalar).min(1).max(limits.maxListItems) : scalar;
      }
      leaves.push(z.strictObject(shape));
    }
  }
  let predicate: z.ZodType<TypeQueryScalarPredicate>;
  const lazy = z.lazy(() => predicate).openapi(name);
  const children = z.array(lazy).min(1).max(limits.maxListItems);
  predicate = z.union([
    ...leaves,
    z.strictObject({ and: children }),
    z.strictObject({ or: children }),
    z.strictObject({ not: lazy }),
  ] as unknown as [z.ZodType, z.ZodType, ...z.ZodType[]]) as z.ZodType<TypeQueryScalarPredicate>;
  return { schema: lazy, leaves };
}
export function queryPredicateSchema(policy: IQueryPolicy): z.ZodType<TypeQueryPredicate> {
  const existing = predicates.get(policy);
  if (existing) return existing;
  const scalar = scalarPredicateSchema(
    policy.fields,
    policy.limits,
    `${policy.name}ScalarPredicate`,
  );
  const relations = Object.entries(policy.relations ?? {}).map(([relation, info]) => {
    const child = scalarPredicateSchema(
      info.fields,
      info.limits,
      `${policy.name}${relation}Predicate`,
    );
    return z
      .strictObject({
        relation: z.literal(relation),
        op: z.enum(['exists', 'notExists']),
        where: child.schema.optional(),
      })
      .openapi({
        ...(info.title !== undefined ? { title: info.title } : {}),
        ...(info.description !== undefined ? { description: info.description } : {}),
      });
  });
  let predicate: z.ZodType<TypeQueryPredicate>;
  const lazy = z.lazy(() => predicate).openapi(`${policy.name}QueryPredicate`);
  const children = z.array(lazy).min(1).max(policy.limits.maxListItems);
  predicate = z.union([
    ...scalar.leaves,
    ...relations,
    z.strictObject({ and: children }),
    z.strictObject({ or: children }),
    z.strictObject({ not: lazy }),
  ] as unknown as [z.ZodType, z.ZodType, ...z.ZodType[]]) as z.ZodType<TypeQueryPredicate>;
  predicates.set(policy, lazy);
  return lazy;
}

export function queryCapabilities(policy: IQueryPolicy) {
  return {
    fields: Object.fromEntries(
      Object.entries(policy.fields).map(([name, field]) => [
        name,
        {
          operators: field.operators,
          type: field.type,
          nullable: field.nullable,
        },
      ]),
    ),
    orderable: policy.orderable,
    projection: policy.projection,
    defaults: policy.defaults,
    pagination: policy.pagination !== false,
    limits: policy.limits,
    conveniences: policy.conveniences,
    relations: Object.fromEntries(
      Object.entries(policy.relations ?? {}).map(([name, relation]) => [
        name,
        {
          ...(relation.title !== undefined ? { title: relation.title } : {}),
          ...(relation.description !== undefined ? { description: relation.description } : {}),
          operators: ['exists', 'notExists'],
          fields: Object.fromEntries(
            Object.entries(relation.fields).map(([field, info]) => [
              field,
              {
                operators: info.operators,
                type: info.type,
                nullable: info.nullable,
              },
            ]),
          ),
        },
      ]),
    ),
  };
}
export type IQueryCapabilities = ReturnType<typeof queryCapabilities>;

export function queryControlSchemas(
  policy: IQueryPolicy,
  mode: 'select' | TypeAnalysisMode = 'select',
) {
  const metadata = { filter: { capabilities: { query: queryCapabilities(policy) } } };
  const shape: Record<string, z.ZodType> = {
    where: queryPredicateSchema(policy)
      .optional()
      .openapi({
        ...metadata,
        description:
          'Recursive Boolean predicate: use explicit leaves { field, op, value }, nonempty { and: [...] } / { or: [...] } groups, or { not: predicate }. ' +
          'Field-value maps such as { fieldName: value } are not supported inside where. ' +
          'The isNull and isNotNull operators omit value; in and notIn require nonempty value arrays. ' +
          'Use only fields, operators and value types admitted by this schema and respect its query limits. ' +
          'Omit where for no added restriction. Supplied named filters combine with where by AND.',
      }),
  };
  if (mode === 'select') {
    const fields = policy.orderable;
    shape.orders = z
      .array(
        z.strictObject({
          field: fields.length ? z.enum(fields as [string, ...string[]]) : z.never(),
          direction: z.enum(['asc', 'desc']),
        }),
      )
      .min(1)
      .max(policy.limits.maxOrders)
      .optional()
      .openapi(metadata);
    if (policy.pagination !== false) {
      shape.pageNo = z.number().int().min(1).max(Number.MAX_SAFE_INTEGER).optional();
      shape.pageSize = z.number().int().min(1).max(policy.limits.maxPageSize).optional();
    }
  }
  return shape;
}

function checkPredicateDepth(
  predicate: TypeQueryPredicate | undefined,
  limit: number,
  policy: IQueryPolicy,
) {
  const stack = predicate ? [{ predicate, depth: 1 }] : [];
  let relations = 0;
  while (stack.length) {
    const { predicate: node, depth } = stack.pop()!;
    if (depth > limit) queryFailure('query_predicate_depth', 'where');
    if ('relation' in node) {
      if (!policyRelationName(policy, node.relation)) queryFailure('query_relation', 'where');
      if (++relations > policy.limits.maxRelations) queryFailure('query_relation_count', 'where');
      if (node.where) checkScalarPredicateDepth(node.where, limit, 'where');
    } else if ('and' in node || 'or' in node) {
      for (const child of 'and' in node ? node.and : node.or)
        stack.push({ predicate: child, depth: depth + 1 });
    } else if ('not' in node) {
      stack.push({ predicate: node.not, depth: depth + 1 });
    }
  }
}
function policyRelationName(policy: IQueryPolicy, relation: string): boolean {
  return Boolean(policy.relations?.[relation]);
}
function checkScalarPredicateDepth(
  predicate: TypeQueryScalarPredicate,
  limit: number,
  path: string,
) {
  const stack = [{ predicate, depth: 1 }];
  while (stack.length) {
    const { predicate: node, depth } = stack.pop()!;
    if (depth > limit) queryFailure('query_predicate_depth', path);
    if ('and' in node || 'or' in node) {
      for (const child of 'and' in node ? node.and : node.or)
        stack.push({ predicate: child, depth: depth + 1 });
    } else if ('not' in node) {
      stack.push({ predicate: node.not, depth: depth + 1 });
    }
  }
}

export function validateQuery<P extends IQueryPolicy>(
  policy: P,
  input: unknown,
  mode: 'select' | TypeAnalysisMode = 'select',
  analysis?: IAnalysisPolicy,
  normalized = false,
): TypeQueryInput<P> {
  const limits = normalized
    ? {
        ...policy.limits,
        maxNodes: policy.limits.maxNodes + 64,
        maxBytes: policy.limits.maxBytes + 4096,
        maxValueDepth: policy.limits.maxValueDepth + 2,
      }
    : policy.limits;
  checkQueryBudget(input, limits);
  const shape = queryControlSchemas(policy, mode);
  if (mode !== 'select') {
    if (!analysis || analysis.modelClass !== policy.modelClass)
      throw new TypeError('Query analysis policy/model mismatch');
    const controls = analysisControlSchemas(analysis, mode);
    shape.aggrs = controls.aggrs;
    if (controls.groups) shape.groups = controls.groups;
  }
  const parsed = runWithZodQueryCoercion(false, () => z.strictObject(shape).safeParse(input ?? {}));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    queryFailure('query_invalid', issue.path.map(String).join('.'));
  }
  const value = parsed.data as TypeQueryInput;
  checkPredicateDepth(value.where, policy.limits.maxPredicateDepth + (normalized ? 1 : 0), policy);
  if (value.orders && new Set(value.orders.map(order => order.field)).size !== value.orders.length)
    queryFailure('query_duplicate_order', 'orders');
  if (mode === 'select') {
    const offset =
      ((value.pageNo ?? policy.defaults.pageNo) - 1) * (value.pageSize ?? policy.defaults.pageSize);
    if (!Number.isSafeInteger(offset) || offset < 0) queryFailure('query_offset', 'pageNo');
  }
  return value as unknown as TypeQueryInput<P>;
}
