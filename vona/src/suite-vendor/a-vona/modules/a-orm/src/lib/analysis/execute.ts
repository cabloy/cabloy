import type {
  IAnalysisPolicy,
  IResolvedAnalysis,
  TypeAnalysisAggregateParams,
  TypeAnalysisAggregateResult,
  TypeAnalysisGroupParams,
  TypeAnalysisGroupResult,
} from '../../types/analysis.ts';
import type { TypeModelOfModelLike } from '../../types/relations.ts';
import type { BeanModelCache } from '../bean.model/bean.model_cache.ts';

import { qualifyWhere } from '../../common/qualifyWhere.ts';
import { getTableOrTableAlias } from '../../common/utils.ts';
import { normalizeAggregateRows } from '../aggregateResult.ts';
import { analysisFailure, resolveAnalysis } from './controls.ts';

function assertModel(model: object, policy: IAnalysisPolicy) {
  if (!(model instanceof policy.modelClass))
    analysisFailure('Analysis policy does not belong to this model');
}

function analysisFilter<Policy extends IAnalysisPolicy>(
  model: BeanModelCache<any>,
  params?: TypeAnalysisGroupParams<Policy> | TypeAnalysisAggregateParams<Policy>,
) {
  if (!params?.joins?.length) return { where: params?.where };
  const table = model.getTable(params.where);
  const qualifier = getTableOrTableAlias(table);
  const where = qualifyWhere(params.where, qualifier);
  if (model.getTable(where) !== table) {
    analysisFailure('Analysis joined filters must resolve to the same model table');
  }
  return { where, joins: params.joins, qualifier };
}

function analysisColumns(
  model: BeanModelCache<any>,
  qualifier: string,
  selection: IResolvedAnalysis,
) {
  const columns = (selection.groups ?? []).map(column =>
    model.raw('?? as ??', [`${qualifier}.${column}`, column]),
  );
  for (const [fn, fields] of Object.entries(selection.aggrs)) {
    for (const field of fields!) {
      const alias = `${fn}_${field === '*' ? 'all' : field}`;
      columns.push(
        field === '*'
          ? model.raw(`${fn}(*) as ??`, [alias])
          : model.raw(`${fn}(??) as ??`, [`${qualifier}.${field}`, alias]),
      );
    }
  }
  return columns;
}

/** Keep instance/soft-delete scope, caching and scalar normalization owned by the ORM. */
export async function $executeAnalysisGroup<Policy extends IAnalysisPolicy>(
  model: TypeModelOfModelLike<Policy['modelLike']>,
  policy: Policy,
  params?: TypeAnalysisGroupParams<Policy>,
): Promise<TypeAnalysisGroupResult<Policy>[]> {
  assertModel(model, policy);
  const owner = model as unknown as BeanModelCache<any>;
  const selection = resolveAnalysis(policy, 'group', params);
  const { groups, aggrs } = selection;
  const { where, joins, qualifier } = analysisFilter(owner, params);
  const rows = await owner.group({
    where,
    ...(qualifier
      ? {
          joins,
          columns: analysisColumns(owner, qualifier, selection),
          groups: groups!.map(column => `${qualifier}.${column}`),
        }
      : { groups: groups!, aggrs }),
    orders: groups!.map(column => [qualifier ? `${qualifier}.${column}` : column, 'asc']),
    limit: policy.limits.maxGroupRows + 1,
  } as any);
  if (rows.length > policy.limits.maxGroupRows)
    analysisFailure(`Analysis exceeds ${policy.limits.maxGroupRows} group rows`);
  return normalizeAggregateRows(rows, aggrs) as TypeAnalysisGroupResult<Policy>[];
}

export async function $executeAnalysisAggregate<Policy extends IAnalysisPolicy>(
  model: TypeModelOfModelLike<Policy['modelLike']>,
  policy: Policy,
  params?: TypeAnalysisAggregateParams<Policy>,
): Promise<TypeAnalysisAggregateResult<Policy>> {
  assertModel(model, policy);
  const owner = model as unknown as BeanModelCache<any>;
  const selection = resolveAnalysis(policy, 'aggregate', params);
  const { where, joins, qualifier } = analysisFilter(owner, params);
  const row = await owner.aggregate({
    where,
    ...(qualifier
      ? { joins, columns: analysisColumns(owner, qualifier, selection) }
      : { aggrs: selection.aggrs }),
  } as any);
  return normalizeAggregateRows([row], selection.aggrs)[0] as TypeAnalysisAggregateResult<Policy>;
}
