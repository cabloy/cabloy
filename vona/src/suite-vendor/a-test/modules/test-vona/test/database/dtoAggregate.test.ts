import type { TypeDecoratorRules } from 'vona-module-a-openapiutils';
import type z from 'zod';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { runWithZodQueryCoercion } from 'vona';
import { app } from 'vona-mock';
import { $schema, getTargetDecoratorRules } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { ModelUserStats } from 'vona-module-test-vona';

describe('dtoAggregate.test.ts', () => {
  it('action:dtoAggregate', async () => {
    await app.bean.executor.mockCtx(async () => {
      // aggr
      const DtoUserAggr = $Dto.aggregate('test-vona:user', {
        count: ['*', 'age'],
        sum: ['age'],
        avg: 'age',
        // max: 'age',
        // min: 'age',
      });
      let rules: TypeDecoratorRules;
      rules = getTargetDecoratorRules(DtoUserAggr.prototype);
      assert.equal(rules.count_all?.type === 'optional', true);
      const rule_count_all = (rules.count_all as z.ZodOptional)?.def.innerType as z.ZodString;
      assert.equal(rule_count_all.type === 'string', true);
      assert.equal(rules.count_age?.type === 'optional', true);
      assert.equal(rules.sum_age?.type === 'optional', true);
      assert.equal(rules.avg_age?.type === 'optional', true);
      assert.equal(rules.max_age, undefined);
      assert.equal(rules.min_age, undefined);
      for (const field of ['sum_age', 'avg_age']) {
        const nullable = (rules[field] as z.ZodOptional).def.innerType as z.ZodNullable;
        assert.equal(nullable.type, 'nullable');
        assert.equal((nullable.def.innerType as z.ZodString).type, 'string');
      }
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoUserAggr, 'V31');
      const component = Object.values(apiJson.components?.schemas ?? {}).find(
        item => !('$ref' in item) && item.properties?.sum_age && item.properties?.avg_age,
      );
      assert.ok(component && !('$ref' in component));
      for (const field of ['sum_age', 'avg_age']) {
        const property = component.properties?.[field];
        assert.ok(property && !('$ref' in property));
        assert.deepEqual(property.type, ['string', 'null']);
        assert.equal(component.required?.includes(field) ?? false, false);
      }
      const schema = $schema(DtoUserAggr);
      const dimensions = {};
      assert.deepEqual(await schema.parseAsync({ ...dimensions, sum_age: null, avg_age: null }), {
        ...dimensions,
        sum_age: null,
        avg_age: null,
      });
      // mockCtx defaults to request-query coercion; validate the DTO's native
      // JSON value contract using the established async-context-local policy.
      await runWithZodQueryCoercion(false, async () => {
        for (const field of ['count_all', 'count_age', 'sum_age', 'avg_age']) {
          assert.equal((await schema.safeParseAsync({ ...dimensions, [field]: 1 })).success, false);
        }
        assert.equal(
          (await schema.safeParseAsync({ ...dimensions, count_all: null })).success,
          false,
        );
      });

      // aggr: usersStats: posts: autoload
      const DtoUserStats = $Dto.get(() => ModelUserStats, {
        columns: 'name',
        include: { roles: true },
      });
      rules = getTargetDecoratorRules(DtoUserStats.prototype);
      assert.equal(rules.name?.type === 'string', true);
      assert.equal(rules.iid, undefined);
      assert.equal(rules.posts?.type === 'optional', true);
      assert.equal(rules.roles?.type === 'optional', true);
    });
  });
});
