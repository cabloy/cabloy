import type { Knex } from 'knex';

import type {
  IAnalysisPolicy,
  TypeAnalysisMode,
  TypeAnalysisGroupParams,
  TypeAnalysisAggregateParams,
} from '../../types/analysis.ts';
import type { IQueryParams } from '../../types/model.ts';
import type { TypeModelWhere } from '../../types/modelWhere.ts';
import type { IQueryPolicy, TypeQueryInput, TypeQueryPredicate } from '../../types/query.ts';
import type { TypeModelOfModelLike } from '../../types/relations.ts';
import type { BeanModelCache } from '../bean.model/bean.model_cache.ts';

import { getTableOrTableAlias } from '../../common/utils.ts';
import { Op } from '../../types/modelWhere.ts';
import { resolveAnalysis } from '../analysis/controls.ts';
import { validateQuery } from './schema.ts';

export interface ICompileQueryOptions {
  mode?: 'select' | TypeAnalysisMode;
  scopeWhere?: TypeModelWhere<any>;
  analysis?: IAnalysisPolicy;
}

/** Compile only public controls; ORM and business scope remain server-owned. */
export function $compileQuery<P extends IQueryPolicy, A extends IAnalysisPolicy>(
  model: TypeModelOfModelLike<P['modelLike']>,
  policy: P,
  input: object | undefined,
  options: ICompileQueryOptions & { mode: 'group'; analysis: A },
): TypeAnalysisGroupParams<A>;
export function $compileQuery<P extends IQueryPolicy, A extends IAnalysisPolicy>(
  model: TypeModelOfModelLike<P['modelLike']>,
  policy: P,
  input: object | undefined,
  options: ICompileQueryOptions & { mode: 'aggregate'; analysis: A },
): TypeAnalysisAggregateParams<A>;
export function $compileQuery<P extends IQueryPolicy>(
  model: TypeModelOfModelLike<P['modelLike']>,
  policy: P,
  input?: TypeQueryInput<P> | object,
  options?: ICompileQueryOptions & { mode?: 'select' },
): IQueryParams<TypeModelOfModelLike<P['modelLike']>>;
export function $compileQuery<P extends IQueryPolicy>(
  model: TypeModelOfModelLike<P['modelLike']>,
  policy: P,
  input?: TypeQueryInput<P> | object,
  options: ICompileQueryOptions = {},
):
  | IQueryParams<TypeModelOfModelLike<P['modelLike']>>
  | TypeAnalysisGroupParams<IAnalysisPolicy>
  | TypeAnalysisAggregateParams<IAnalysisPolicy> {
  if (!(model instanceof policy.modelClass))
    throw new TypeError('Query policy does not belong to this model');
  const owner = model as unknown as BeanModelCache<any>;
  const mode = options.mode ?? 'select';
  const value = validateQuery(
    policy,
    input ?? {},
    mode,
    options.analysis,
    true,
  ) as unknown as TypeQueryInput;
  const table = owner.getTable(options.scopeWhere);
  const main = getTableOrTableAlias(table);
  const where: Record<string, unknown> = {};
  if (options.scopeWhere) where[`${Op.and}scope`] = options.scopeWhere;
  const aliases = new Map<string, string>();
  const members = owner.builder(table).select(`${main}.id`);
  const addBinding = (field: string) => {
    const binding = policy.bindings[field];
    if (!binding) return `${main}.${field}`;
    let alias = aliases.get(field);
    if (!alias) {
      alias = `query_related_${aliases.size}`;
      aliases.set(field, alias);
      const target = owner.newInstanceTarget(binding.modelLike as any) as BeanModelCache<any>;
      const targetTable = target.getTable(undefined);
      const scoped = target.builder(targetTable).select(`${getTableOrTableAlias(targetTable)}.*`);
      target.prepareWhere(scoped, targetTable, {});
      members[binding.joinType ?? 'leftJoin'](
        scoped.as(alias),
        `${main}.${binding.localKey}`,
        `${alias}.${binding.foreignKey}`,
      );
    }
    return `${alias}.${binding.field}`;
  };
  const compile = (builder: Knex.QueryBuilder, node: TypeQueryPredicate) => {
    if ('and' in node || 'or' in node) {
      const children = 'and' in node ? node.and : node.or;
      builder.where(group => {
        for (const child of children)
          group['and' in node ? 'andWhere' : 'orWhere'](part => compile(part, child));
      });
      return;
    }
    if ('not' in node) {
      builder.whereNot(part => compile(part, node.not));
      return;
    }
    const column = addBinding(node.field);
    const op = node.op;
    if (op === 'isNull') {
      builder.whereNull(column);
    } else if (op === 'isNotNull') {
      builder.whereNotNull(column);
    } else {
      const rawValue = 'value' in node ? node.value : undefined;
      const field = policy.fields[node.field];
      const convert = (entry: unknown) =>
        field.type === 'timestamp' ? new Date(entry as string) : entry;
      const operand: any = Array.isArray(rawValue) ? rawValue.map(convert) : convert(rawValue);
      const compare = { eq: '=', ne: '<>', gt: '>', gte: '>=', lt: '<', lte: '<=' } as const;
      if (op in compare) {
        builder.where(column, compare[op as keyof typeof compare], operand);
      } else if (op === 'in') {
        builder.whereIn(column, operand);
      } else if (op === 'notIn') {
        builder.whereNotIn(column, operand);
      } else {
        const escaped = String(operand).replace(/[!%_]/g, '!$&');
        const pattern = op.startsWith('contains')
          ? `%${escaped}%`
          : op.startsWith('startsWith')
            ? `${escaped}%`
            : op.startsWith('endsWith')
              ? `%${escaped}`
              : escaped;
        const insensitive = op.endsWith('I');
        const method =
          insensitive && owner.db.dialect.capabilities.ilike
            ? 'whereILike'
            : !insensitive && owner.db.dialect.capabilities.like
              ? 'whereLike'
              : insensitive
                ? 'whereLike'
                : 'whereILike';
        builder[method](column, owner.raw("? escape '!'", [pattern]));
      }
    }
  };
  if (value.where) {
    // Knex compiles joins before deferred where callbacks; resolve every binding first.
    const pending: TypeQueryPredicate[] = [value.where as TypeQueryPredicate];
    while (pending.length) {
      const node = pending.pop()!;
      if ('field' in node) addBinding(node.field);
      else if ('not' in node) pending.push(node.not);
      else pending.push(...('and' in node ? node.and : node.or));
    }
    // One membership predicate preserves OR/NOT and repeated fields without parent fan-out.
    compile(members, value.where as TypeQueryPredicate);
    owner.prepareWhere(members, table, options.scopeWhere);
    const { sql, bindings } = members.toSQL();
    where[`${main}.id`] = { [Op.in]: owner.raw(sql, bindings) };
  }
  if (owner.getTable(where as any) !== table)
    throw new TypeError('Query must resolve to the same model table');
  if (mode !== 'select') {
    return { where, ...resolveAnalysis(options.analysis!, mode, value) } as any;
  }
  const orders: unknown[][] = [];
  for (const order of value.orders ?? policy.defaults.orders) {
    const binding = policy.bindings[order.field];
    let column: string | Knex.Raw = `${main}.${order.field}`;
    if (binding) {
      const target = owner.newInstanceTarget(binding.modelLike as any) as BeanModelCache<any>;
      const targetTable = target.getTable(undefined);
      const targetAlias = getTableOrTableAlias(targetTable);
      const scalar = target.builder(targetTable).select(`${targetAlias}.${binding.field}`);
      target.prepareWhere(scalar, targetTable, {});
      scalar.where(
        `${targetAlias}.${binding.foreignKey}`,
        target.ref(`${main}.${binding.localKey}`),
      );
      const { sql, bindings } = scalar.toSQL();
      column = owner.raw(`(${sql})`, bindings);
    }
    // Knex's MySQL null-placement option replaces value ordering with a null
    // test. Keep null rank and actual value as separate portable sort clauses.
    orders.push([owner.raw('case when ?? is null then 1 else 0 end', [column]), 'asc']);
    orders.push([column, order.direction]);
  }
  if (!(value.orders ?? policy.defaults.orders).some(order => order.field === 'id'))
    orders.push([`${main}.id`, 'asc']);
  if (policy.pagination === false) return { where, orders } as any;
  const pageSize = value.pageSize ?? policy.defaults.pageSize;
  return {
    where,
    orders,
    limit: pageSize,
    offset: ((value.pageNo ?? policy.defaults.pageNo) - 1) * pageSize,
  } as any;
}
