import type {
  IAnalysisPolicy,
  TypeAnalysisAggregateParams,
  TypeAnalysisAggregateResult,
  TypeAnalysisGroupParams,
  TypeAnalysisGroupResult,
} from '../../types/analysis.ts';
import type { TypeModelOfModelLike } from '../../types/relations.ts';
import type { BeanModelCache } from '../bean.model/bean.model_cache.ts';

import { analysisFailure, resolveAnalysis } from './controls.ts';

function assertModel(model: object, policy: IAnalysisPolicy) {
  if (!(model instanceof policy.modelClass))
    analysisFailure('Analysis policy does not belong to this model');
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
    where: params?.where,
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
    where: params?.where,
    aggrs,
  })) as TypeAnalysisAggregateResult<Policy>;
}
