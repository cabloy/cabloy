import type { BeanModelMeta } from '../src/lib/bean.model/bean.model_meta.ts';
import type {
  TypeAnalysisAggregateParams,
  TypeAnalysisAggregateResult,
  TypeAnalysisGroupParams,
  TypeAnalysisGroupResult,
} from '../src/types/analysis.ts';

import { $defineAnalysis } from '../src/lib/analysis/policy.ts';

function expectType<_T extends true>() {}
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

type Entity = {
  id: string;
  iid: number;
  level: number;
  amount?: number | null;
  name: string;
  description?: string | null;
  imageId?: string;
};
declare const Model: new () => BeanModelMeta<Entity>;

// Compile-time assertions only; the factory is never executed by this file.
function checkAnalysisTypes() {
  const policy = $defineAnalysis(() => Model, {
    groups: ['level', 'description'],
    aggrs: { count: ['*', 'imageId'], sum: ['amount'] },
    defaults: {
      group: { groups: ['level'], aggrs: { count: ['*'] } },
      aggregate: { aggrs: { count: ['imageId'] } },
    },
  });
  expectType<Equal<typeof policy.groups, readonly ['level', 'description']>>();
  expectType<Equal<typeof policy.aggrs.count, readonly ['*', 'imageId']>>();
  expectType<
    Equal<
      TypeAnalysisAggregateResult<typeof policy>,
      { count_all?: string; count_imageId?: string; sum_amount?: string | null }
    >
  >();
  expectType<
    Equal<TypeAnalysisGroupResult<typeof policy>['description'], string | null | undefined>
  >();
  expectType<Equal<TypeAnalysisGroupResult<typeof policy>['level'], number | undefined>>();
  const group: TypeAnalysisGroupParams<typeof policy> = {
    groups: ['description'],
    aggrs: { sum: ['amount'] },
    where: { name: 'x' },
  };
  const aggregate: TypeAnalysisAggregateParams<typeof policy> = { aggrs: { count: ['imageId'] } };
  void group;
  void aggregate;
  // @ts-expect-error unapproved group
  const badGroup: TypeAnalysisGroupParams<typeof policy> = { groups: ['name'] };
  // @ts-expect-error field was allowed for count, not sum
  const badColumn: TypeAnalysisAggregateParams<typeof policy> = { aggrs: { sum: ['imageId'] } };
  // @ts-expect-error aggregate has no group controls
  const badAggregate: TypeAnalysisAggregateParams<typeof policy> = { groups: ['level'] };
  // @ts-expect-error unknown function
  const badFunction: TypeAnalysisAggregateParams<typeof policy> = { aggrs: { median: ['amount'] } };
  void [badGroup, badColumn, badAggregate, badFunction];
  $defineAnalysis(Model, {
    groups: ['level'],
    // @ts-expect-error non-count metrics must be numeric
    aggrs: { sum: ['name'] },
    defaults: { aggregate: { aggrs: {} } },
  });
  $defineAnalysis(Model, {
    groups: ['level'],
    // @ts-expect-error identity columns cannot be summed
    aggrs: { sum: ['iid'] },
    defaults: { aggregate: { aggrs: {} } },
  });
  $defineAnalysis(Model, {
    // @ts-expect-error qualified columns are not physical field names
    groups: ['table.level'],
    aggrs: { count: ['*'] },
    defaults: { aggregate: { aggrs: { count: ['*'] } } },
  });
  $defineAnalysis(Model, {
    groups: [],
    // @ts-expect-error unknown function
    aggrs: { count: ['*'], median: ['level'] },
    defaults: { aggregate: { aggrs: { count: ['*'] } } },
  });
  $defineAnalysis(Model, {
    groups: ['level'],
    aggrs: { count: ['*'] },
    defaults: {
      // @ts-expect-error defaults cannot widen the group allowlist
      group: { groups: ['name'], aggrs: { count: ['*'] } },
    },
  });
  $defineAnalysis(Model, {
    groups: ['level'],
    aggrs: { count: ['*'] },
    // @ts-expect-error defaults cannot widen the metric allowlist
    defaults: { aggregate: { aggrs: { count: ['imageId'] } } },
  });
  const readonlyConfig = {
    groups: ['level'],
    aggrs: { count: ['*'] },
    defaults: { group: { groups: ['level'], aggrs: { count: ['*'] } } },
  } as const;
  const readonlyPolicy = $defineAnalysis(Model, readonlyConfig);
  expectType<Equal<typeof readonlyPolicy.aggrs.count, readonly ['*']>>();
  void [policy, readonlyPolicy];
}
void checkAnalysisTypes;
