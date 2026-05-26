import type { TypeDecoratorRules } from 'vona-module-a-openapiutils';
import type z from 'zod';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { getTargetDecoratorRules } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { ModelUserStatsGroup } from 'vona-module-test-vona';

describe('dtoGroup.test.ts', () => {
  it('action:dtoGroup', async () => {
    await app.bean.executor.mockCtx(async () => {
      const DtoUserAggr = $Dto.group('test-vona:user', ['name'], {
        count: ['*', 'age'],
        sum: ['age'],
        avg: 'age',
        // max: 'age',
        // min: 'age',
      });
      let rules: TypeDecoratorRules;
      rules = getTargetDecoratorRules(DtoUserAggr.prototype);
      assert.equal(rules.name?.type === 'string', true);
      assert.equal(rules.count_all?.type === 'optional', true);
      const rule_count_all = (rules.count_all as z.ZodOptional)?.def.innerType as z.ZodString;
      assert.equal(rule_count_all.type === 'string', true);
      assert.equal(rules.count_age?.type === 'optional', true);
      assert.equal(rules.sum_age?.type === 'optional', true);
      assert.equal(rules.avg_age?.type === 'optional', true);
      assert.equal(rules.max_age, undefined);
      assert.equal(rules.min_age, undefined);
      // group: userStats: posts: autoload
      const DtoUserStats = $Dto.get(() => ModelUserStatsGroup, {
        columns: 'name',
        include: { roles: true },
      });
      rules = getTargetDecoratorRules(DtoUserStats.prototype);
      assert.equal(rules.name?.type === 'string', true);
      assert.equal(rules.iid, undefined);
      assert.equal(rules.posts?.type === 'pipe', true);
      assert.equal(rules.roles?.type === 'pipe', true);
    });
  });
});
