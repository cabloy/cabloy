import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { IAnalysisPolicy } from '../src/types/analysis.ts';

import {
  AnalysisError,
  analysisCapabilities,
  analysisControlSchemas,
  resolveAnalysis,
} from '../src/lib/analysis/controls.ts';
import { $executeAnalysisAggregate, $executeAnalysisGroup } from '../src/lib/analysis/execute.ts';

class Model {
  calls: unknown[] = [];
  rows: object[] = [];
  group(params: unknown) {
    this.calls.push(params);
    return Promise.resolve(this.rows);
  }

  aggregate(params: unknown) {
    this.calls.push(params);
    return Promise.resolve(this.rows[0]);
  }
}
const policy = {
  modelLike: Model,
  modelClass: Model,
  groups: ['level', 'category'],
  aggrs: {
    count: ['*', 'imageId'],
    sum: ['amount'],
    avg: ['amount'],
    min: ['amount'],
    max: ['amount'],
  },
  defaults: {
    group: { groups: ['level'], aggrs: { count: ['*'] } },
    aggregate: { aggrs: { count: ['*', 'imageId'] } },
  },
  limits: { maxGroups: 2, maxMetrics: 5, maxGroupRows: 2 },
} as unknown as IAnalysisPolicy;
const invalid = (run: () => unknown) =>
  assert.throws(
    run,
    error => error instanceof AnalysisError && error.status === 422 && error.code === 422,
  );

describe('analysis controls', () => {
  it('defaults each omitted control independently and canonicalizes policy order', () => {
    assert.deepEqual(resolveAnalysis(policy, 'group'), {
      groups: ['level'],
      aggrs: { count: ['*'] },
    });
    assert.deepEqual(resolveAnalysis(policy, 'group', { groups: ['category'] }), {
      groups: ['category'],
      aggrs: { count: ['*'] },
    });
    assert.deepEqual(resolveAnalysis(policy, 'group', { aggrs: { sum: ['amount'] } }), {
      groups: ['level'],
      aggrs: { sum: ['amount'] },
    });
    assert.deepEqual(
      resolveAnalysis(policy, 'group', {
        groups: ['category', 'level'],
        aggrs: { count: ['imageId', '*'] },
      }),
      { groups: ['level', 'category'], aggrs: { count: ['*', 'imageId'] } },
    );
    assert.deepEqual(resolveAnalysis(policy, 'aggregate'), { aggrs: { count: ['*', 'imageId'] } });
  });

  it('rejects empty, duplicated, unknown, qualified and malformed controls', () => {
    for (const input of [
      { groups: [] },
      { groups: ['level', 'level'] },
      { groups: ['unknown'] },
      { groups: ['table.level'] },
      { groups: 'level' },
      { groups: '["level"]' },
      { groups: [1] },
      { groups: null },
      { aggrs: '{"count":["*"]}' },
      { aggrs: { count: '["*"]' } },
      { aggrs: { count: '*' } },
      { aggrs: { count: [1] } },
      { aggrs: {} },
      { aggrs: null },
      { aggrs: [] },
      { aggrs: { count: [] } },
      { aggrs: { count: ['*', '*'] } },
      { aggrs: { count: ['table.imageId'] } },
      { aggrs: { count: ['unknown'] } },
      { aggrs: { sum: ['imageId'] } },
      { aggrs: { median: ['amount'] } },
      { aggrs: { 'sql.count': ['*'] } },
      { aggrs: { count: ['*'], avg: [] } },
      { joins: [] },
      { having: {} },
      { distinct: false },
      { include: {} },
      { with: {} },
      'not-an-object',
      null,
      [],
    ])
      invalid(() => resolveAnalysis(policy, 'group', input));
    for (const groups of [[], ['level'], undefined, null])
      invalid(() => resolveAnalysis(policy, 'aggregate', { groups }));
    invalid(() => resolveAnalysis(policy, 'other' as never));
  });

  it('applies combined metric limits and refuses disabled actions', () => {
    invalid(() =>
      resolveAnalysis({ ...policy, limits: { ...policy.limits, maxGroups: 1 } }, 'group', {
        groups: ['level', 'category'],
      }),
    );
    invalid(() => resolveAnalysis(policy, 'aggregate', { aggrs: policy.aggrs }));
    invalid(() =>
      resolveAnalysis({ ...policy, defaults: { aggregate: policy.defaults.aggregate } }, 'group'),
    );
    assert.deepEqual(
      resolveAnalysis(
        { ...policy, groups: [], defaults: { aggregate: policy.defaults.aggregate } },
        'aggregate',
      ),
      { aggrs: { count: ['*', 'imageId'] } },
    );
  });

  it('exposes strict native schemas and only serializable public capabilities', () => {
    const schemas = analysisControlSchemas(policy, 'group');
    assert.equal(
      schemas.selection.safeParse({ aggrs: { count: ['*'], unknown: ['amount'] } }).success,
      false,
    );
    assert.equal(schemas.selection.safeParse({ extra: true }).success, false);
    assert.equal(
      analysisControlSchemas(policy, 'aggregate').selection.safeParse({ groups: ['level'] })
        .success,
      false,
    );
    assert.deepEqual(schemas.selection.parse({}), { groups: ['level'], aggrs: { count: ['*'] } });
    const capabilities = analysisCapabilities(policy, 'group');
    assert.deepEqual(JSON.parse(JSON.stringify(capabilities)), {
      mode: 'group',
      groups: ['level', 'category'],
      aggrs: policy.aggrs,
      defaults: policy.defaults.group,
      limits: policy.limits,
    });
    assert.deepEqual(analysisCapabilities(policy, 'aggregate').groups, []);
    (capabilities.groups as string[]).push('external');
    assert.deepEqual(policy.groups, ['level', 'category']);
  });
});

describe('analysis execution boundary', () => {
  it('forwards only scoped where, resolved controls, canonical ordering and cap+1', async () => {
    const model = new Model();
    const where = { level: 1 };
    model.rows = [
      { level: 1, count_all: '2' },
      { level: 2, count_all: '1' },
    ];
    const rows = await $executeAnalysisGroup(model as never, policy, {
      where,
      limit: 999,
      offset: 99,
      columns: ['secret'],
      orders: [['secret', 'desc']],
    });
    assert.equal(rows, model.rows);
    assert.deepEqual(model.calls, [
      { where, groups: ['level'], aggrs: { count: ['*'] }, orders: [['level', 'asc']], limit: 3 },
    ]);
    model.calls = [];
    model.rows = [{ count_all: '0', sum_amount: null }];
    const item = await $executeAnalysisAggregate(model as never, policy, {
      where,
      aggrs: { count: ['*'], sum: ['amount'] },
      limit: 1,
    });
    assert.equal(item, model.rows[0]);
    assert.deepEqual(model.calls, [{ where, aggrs: { count: ['*'], sum: ['amount'] } }]);
  });

  it('rejects overflow, wrong models and invalid direct calls before execution', async () => {
    const model = new Model();
    model.rows = [{}, {}, {}];
    await assert.rejects($executeAnalysisGroup(model as never, policy), AnalysisError);
    model.calls = [];
    await assert.rejects(
      $executeAnalysisGroup(model as never, policy, { groups: [] }),
      AnalysisError,
    );
    await assert.rejects(
      $executeAnalysisAggregate(model as never, policy, { joins: [] } as never),
      AnalysisError,
    );
    await assert.rejects($executeAnalysisAggregate({} as never, policy), AnalysisError);
    assert.deepEqual(model.calls, []);
    model.rows = [];
    assert.deepEqual(await $executeAnalysisGroup(model as never, policy), []);
  });
});
