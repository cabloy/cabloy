import { ZodMetadata } from '@cabloy/zod-openapi';
import { useApp } from 'vona';
import { getTargetDecoratorRules } from 'vona-module-a-openapiutils';
import z from 'zod';

import type { TypeAnalysisModelLike } from '../../types/analysis.ts';
import type {
  IQueryConfig,
  IQueryField,
  IQueryFieldConfig,
  TypeQueryPolicy,
} from '../../types/query.ts';

import { getClassEntityFromClassModel, prepareClassModel } from '../../common/utils.ts';

export const queryDefaultLimits = Object.freeze({
  maxBytes: 8192,
  maxNodes: 128,
  maxValueDepth: 6,
  maxPredicateDepth: 3,
  maxListItems: 32,
  maxOrders: 5,
  maxStringLength: 256,
  maxPageSize: 100,
});
const scalarOps = ['eq', 'ne', 'in', 'notIn'];
const orderedOps = [...scalarOps, 'gt', 'gte', 'lt', 'lte'];
const stringOps = [
  ...scalarOps,
  'eqI',
  'contains',
  'containsI',
  'startsWith',
  'startsWithI',
  'endsWith',
  'endsWithI',
];

function invalid(message: string): never {
  throw new TypeError(`Invalid query policy: ${message}`);
}
function identifier(name: string) {
  if (!/^[a-z]\w*$/i.test(name) || ['__proto__', 'constructor', 'prototype'].includes(name))
    invalid('invalid public field identifier');
}

function scalar(input: z.ZodType, config: IQueryFieldConfig, identity: boolean): IQueryField {
  let schema = ZodMetadata.resolveLazySchema(config.schema ?? input);
  let nullable = false;
  const seen = new Set<z.ZodType>();
  while (
    ['optional', 'nullable', 'default', 'prefault', 'pipe', 'readonly', 'nonoptional'].includes(
      schema.type,
    )
  ) {
    if (seen.has(schema)) invalid('cyclic scalar schema');
    seen.add(schema);
    if (schema.type === 'nullable') nullable = true;
    const def = schema.def as any;
    schema = ZodMetadata.resolveLazySchema(def.innerType ?? def.in);
  }
  let type =
    config.type ??
    ((identity
      ? 'identity'
      : schema.type === 'date'
        ? 'timestamp'
        : schema.type) as IQueryField['type']);
  if (schema.type === 'literal' || schema.type === 'enum') type = config.type ?? 'enum';
  let value: z.ZodType;
  if (type === 'identity') {
    const numeric = useApp().util.getModuleConfigRaw('a-orm')?.table?.identityType === 'number';
    value = numeric
      ? z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)
      : z.string().regex(/^\d+$/);
  } else if (type === 'timestamp') {
    value = z.iso.datetime({ offset: true });
  } else if (type === 'date') {
    value = z.iso.date();
  } else if (type === 'decimal') {
    value = z.string().regex(/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/);
  } else if (type === 'enum') {
    if (schema.type === 'enum')
      value = z.enum((schema as z.ZodEnum).options as [string, ...string[]]);
    else if (schema.type === 'literal') value = z.literal((schema.def as any).values);
    else invalid('enum requires enum or literal metadata');
  } else if (type === 'string') {
    value = z.string();
  } else if (type === 'number') {
    value = z.number();
  } else if (type === 'boolean') {
    value = z.boolean();
  } else {
    invalid(`unsupported scalar ${schema.type}; declare a query-value adapter`);
  }
  // Explicit adapters are query-owned and retain their validation, not write transforms/defaults.
  if (config.schema) value = schema;
  const eligible =
    type === 'string'
      ? stringOps
      : ['number', 'decimal', 'date', 'timestamp'].includes(type)
        ? orderedOps
        : type === 'boolean'
          ? ['eq', 'ne']
          : scalarOps;
  const allowed = nullable ? [...eligible, 'isNull', 'isNotNull'] : eligible;
  if (
    !config.operators.length ||
    new Set(config.operators).size !== config.operators.length ||
    config.operators.some(op => !allowed.includes(op))
  ) {
    invalid('unsupported or duplicated field operators');
  }
  return Object.freeze({
    ...config,
    schema: value,
    type,
    nullable,
    operators: Object.freeze([...config.operators]),
  });
}

/** Static metadata only; never captures user, instance or request state. */
export function $defineQuery<
  M extends TypeAnalysisModelLike,
  const F extends Record<string, IQueryFieldConfig>,
>(modelLike: M, config: IQueryConfig<F>): TypeQueryPolicy<M, F> {
  if (config.name && !/^[a-z]\w*$/i.test(config.name)) invalid('invalid policy name');
  const modelClass = prepareClassModel(modelLike as any);
  const entityClass = getClassEntityFromClassModel(modelClass);
  const rules = getTargetDecoratorRules(entityClass.prototype, true);
  const fields: Record<string, IQueryField> = {};
  const bindings = { ...config.bindings };
  for (const [name, field] of Object.entries(config.fields)) {
    identifier(name);
    const binding = bindings[name];
    let source = rules[name];
    if (binding) {
      identifier(binding.localKey);
      identifier(binding.field);
      if (!rules[binding.localKey] || binding.foreignKey !== 'id')
        invalid('binding must target a unique model id');
      if (binding.joinType && !['leftJoin', 'innerJoin'].includes(binding.joinType))
        invalid('unsupported binding join type');
      const targetEntity = getClassEntityFromClassModel(
        prepareClassModel(binding.modelLike as any),
      );
      source = getTargetDecoratorRules(targetEntity.prototype, true)[binding.field];
    }
    if (!source) invalid(`unknown entity field ${name}`);
    let input = source;
    if (binding?.joinType !== 'innerJoin' && binding) input = input.nullable();
    fields[name] = scalar(input, field, name === 'id' || name.endsWith('Id'));
  }
  for (const name of Object.keys(bindings)) {
    if (!fields[name]) invalid('binding without a declared query field');
    bindings[name] = Object.freeze({ ...bindings[name] });
  }
  const orderable = [...config.orderable];
  if (new Set(orderable).size !== orderable.length) invalid('duplicate order field');
  for (const name of orderable) {
    identifier(name);
    if (!rules[name] && !fields[name]) invalid(`unknown order field ${name}`);
  }
  if (!rules.id) invalid('query model requires a stable id');
  const conveniences = { ...config.conveniences };
  for (const [name, entry] of Object.entries(conveniences)) {
    identifier(name);
    if (!fields[entry.field] || (entry.op && !fields[entry.field].operators.includes(entry.op)))
      invalid('invalid convenience binding');
    conveniences[name] = Object.freeze({ ...entry });
  }
  const limits = { ...queryDefaultLimits, ...config.limits };
  for (const [name, limit] of Object.entries(limits)) {
    if (!(name in queryDefaultLimits) || !Number.isSafeInteger(limit) || limit < 1)
      invalid('invalid complexity limit');
  }
  const defaults = {
    pageNo: 1,
    pageSize: 20,
    ...config.defaults,
    orders: (config.defaults?.orders ?? [{ field: 'id', direction: 'asc' as const }]).map(order =>
      Object.freeze({ ...order }),
    ),
  };
  if (
    !Number.isSafeInteger(defaults.pageNo) ||
    defaults.pageNo < 1 ||
    !Number.isSafeInteger(defaults.pageSize) ||
    defaults.pageSize < 1 ||
    defaults.pageSize > limits.maxPageSize
  ) {
    invalid('invalid pagination defaults');
  }
  if (
    !defaults.orders.length ||
    defaults.orders.length > limits.maxOrders ||
    new Set(defaults.orders.map(o => o.field)).size !== defaults.orders.length ||
    defaults.orders.some(
      o =>
        (!orderable.includes(o.field) && o.field !== 'id') ||
        !['asc', 'desc'].includes(o.direction),
    )
  ) {
    invalid('invalid default orders');
  }
  if (config.projection && config.projection.mode !== 'fixed') invalid('unsupported projection');
  return Object.freeze({
    name: config.name ?? modelClass.name,
    pagination: config.pagination !== false,
    modelLike,
    modelClass,
    entityClass,
    fields: Object.freeze(fields),
    orderable: Object.freeze(orderable),
    bindings: Object.freeze(bindings),
    conveniences: Object.freeze(conveniences),
    defaults: Object.freeze({ ...defaults, orders: Object.freeze(defaults.orders) }),
    projection: Object.freeze({ mode: 'fixed' as const }),
    limits: Object.freeze(limits),
  }) as TypeQueryPolicy<M, F>;
}
