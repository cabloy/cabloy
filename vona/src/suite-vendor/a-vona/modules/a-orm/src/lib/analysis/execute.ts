import type {
  IAnalysisPolicy,
  TypeAnalysisAggregateParams,
  TypeAnalysisAggregateResult,
  TypeAnalysisGroupParams,
  TypeAnalysisGroupResult,
} from '../../types/analysis.ts';
import type { TypeModelWhere } from '../../types/modelWhere.ts';
import type { TypeModelOfModelLike } from '../../types/relations.ts';
import type { BeanModelCache } from '../bean.model/bean.model_cache.ts';

import { getTableOrTableAlias, isRaw, isRef } from '../../common/utils.ts';
import { Op } from '../../types/modelWhere.ts';
import { analysisFailure, resolveAnalysis } from './controls.ts';

function assertModel(model: object, policy: IAnalysisPolicy) {
  if (!(model instanceof policy.modelClass))
    analysisFailure('Analysis policy does not belong to this model');
}

function qualifyWhere(where: TypeModelWhere<any> | undefined, table: string) {
  if (!where || isRaw(where) || isRef(where)) return where;
  return Object.fromEntries(
    Object.entries(where).map(([key, value]) => {
      if ([Op.and, Op.or, Op.not].some(op => key.startsWith(op))) {
        return [key, qualifyWhere(value, table)];
      }
      return [key.startsWith('_') || key.includes('.') ? key : `${table}.${key}`, value];
    }),
  );
}

function analysisWhere<Policy extends IAnalysisPolicy>(
  model: BeanModelCache<any>,
  params?: TypeAnalysisGroupParams<Policy> | TypeAnalysisAggregateParams<Policy>,
): TypeModelWhere<any> | undefined {
  if (!params?.joins?.length) return params?.where;
  const table = model.getTable(params.where);
  const qualifier = getTableOrTableAlias(table);
  const columnId = `${qualifier}.id`;
  // Membership preserves the complete joined predicate without multiplying main rows.
  const ids = model.builder(table).select(columnId);
  model.buildJoins(ids, params.joins as Parameters<typeof model.buildJoins>[1]);
  model.prepareWhere(ids, table, qualifyWhere(params.where, qualifier));
  // Raw operands bypass the ORM's nested-object filter traversal; retain SQL bindings.
  const { sql, bindings } = ids.toSQL();
  const where = { [columnId]: { [Op.in]: model.raw(sql, bindings) } } as TypeModelWhere<any>;
  if (model.getTable(where) !== table) {
    analysisFailure('Analysis joined filters must resolve to the same model table');
  }
  return where;
}

/** Keep instance/soft-delete scope, caching and scalar normalization owned by the ORM. */
export async function $executeAnalysisGroup<Policy extends IAnalysisPolicy>(
  model: TypeModelOfModelLike<Policy['modelLike']>,
  policy: Policy,
  params?: TypeAnalysisGroupParams<Policy>,
): Promise<TypeAnalysisGroupResult<Policy>[]> {
  assertModel(model, policy);
  const { groups, aggrs } = resolveAnalysis(policy, 'group', params);
  const rows = await (model as unknown as BeanModelCache<any>).group({
    where: analysisWhere(model as unknown as BeanModelCache<any>, params),
    groups: groups!,
    aggrs,
    orders: groups!.map(column => [column, 'asc']),
    limit: policy.limits.maxGroupRows + 1,
  });
  if (rows.length > policy.limits.maxGroupRows)
    analysisFailure(`Analysis exceeds ${policy.limits.maxGroupRows} group rows`);
  return rows as TypeAnalysisGroupResult<Policy>[];
}

export async function $executeAnalysisAggregate<Policy extends IAnalysisPolicy>(
  model: TypeModelOfModelLike<Policy['modelLike']>,
  policy: Policy,
  params?: TypeAnalysisAggregateParams<Policy>,
): Promise<TypeAnalysisAggregateResult<Policy>> {
  assertModel(model, policy);
  const { aggrs } = resolveAnalysis(policy, 'aggregate', params);
  return (await (model as unknown as BeanModelCache<any>).aggregate({
    where: analysisWhere(model as unknown as BeanModelCache<any>, params),
    aggrs,
  })) as TypeAnalysisAggregateResult<Policy>;
}
