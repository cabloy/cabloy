import type { Constructable } from 'vona';

import { $Class } from 'vona';

import type {
  IAnalysisPolicy,
  TypeAnalysisAggregateResult,
  TypeAnalysisGroupResult,
} from '../../types/analysis.ts';

import { _DtoAggregate_inner } from './dtoAggregate.ts';
import { DtoGroup } from './dtoGroup.ts';

/** A finite optional superset: absent fields are unrequested, null retains SQL meaning. */
export function DtoAnalysisGroup<Policy extends IAnalysisPolicy>(
  policy: Policy,
): Constructable<TypeAnalysisGroupResult<Policy>> {
  if (!policy.defaults.group) throw new TypeError('Analysis group action is not enabled');
  const base = DtoGroup(policy.modelLike as any, [...policy.groups] as any, policy.aggrs as any);
  return $Class.partial(base) as Constructable<TypeAnalysisGroupResult<Policy>>;
}

export function DtoAnalysisAggregate<Policy extends IAnalysisPolicy>(
  policy: Policy,
): Constructable<TypeAnalysisAggregateResult<Policy>> {
  if (!policy.defaults.aggregate) throw new TypeError('Analysis aggregate action is not enabled');
  abstract class TargetClass {}
  // Aggregate aliases deliberately do not copy field validators/renderers from source columns.
  return _DtoAggregate_inner(
    TargetClass as any,
    policy.modelLike as any,
    policy.aggrs as any,
  ) as Constructable<TypeAnalysisAggregateResult<Policy>>;
}
