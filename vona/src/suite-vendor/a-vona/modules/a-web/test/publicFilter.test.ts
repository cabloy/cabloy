import type { RouteHandlerArgumentMeta } from 'vona-module-a-openapi';
import type { IQueryPolicy } from 'vona-module-a-orm';

import { ZodMetadata } from '@cabloy/zod-openapi';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import {
  checkQueryBudget,
  PublicQueryError,
  queryDefaultLimits,
  SymbolQueryPolicy,
  validateQuery,
} from 'vona-module-a-orm';
import z from 'zod';

import type { IPipeOptionsFilter } from '../src/bean/pipe.filter.ts';

import { PipeFilter } from '../src/bean/pipe.filter.ts';
import { prepareAnalysisFilter } from '../src/lib/analysisFilter.ts';

class ModelFilterFixture {}
class EntityFilterFixture {}

const policy: IQueryPolicy = {
  name: 'PublicFilterFixture',
  modelLike: ModelFilterFixture as any,
  modelClass: ModelFilterFixture as any,
  entityClass: EntityFilterFixture,
  fields: {
    title: { operators: ['eq', 'containsI'], schema: z.string(), nullable: false, type: 'string' },
    score: { operators: ['gte'], schema: z.number(), nullable: false, type: 'number' },
    createdAt: {
      operators: ['gte', 'lt'],
      schema: z.iso.datetime({ offset: true }),
      nullable: false,
      type: 'timestamp',
    },
  },
  orderable: ['title'],
  pagination: true,
  bindings: {},
  conveniences: {},
  defaults: { orders: [{ field: 'title', direction: 'asc' }], pageNo: 1, pageSize: 20 },
  projection: { mode: 'fixed' },
  limits: queryDefaultLimits,
};
const metadata: RouteHandlerArgumentMeta = {
  type: 'query',
  controller: ModelFilterFixture,
  method: 'select',
  index: 0,
};
const isPublicError = (error: unknown) => error instanceof PublicQueryError && error.status === 422;

function prepared(query = policy) {
  const schema = z
    .object({
      title: z
        .string()
        .optional()
        .openapi({ rest: { visible: true } }),
      score: z.number().optional(),
      createdAt: z
        .string()
        .optional()
        .openapi({ filter: { transform: ['a-web:dateRange', undefined] } }),
    })
    .openapi('PublicFilterNamedFixture');
  Object.defineProperty(schema, SymbolQueryPolicy, { value: query });
  return {
    ...prepareAnalysisFilter(schema),
    type: 'query' as const,
    disableErrorMessages: false,
    errorHttpStatusCode: 400,
  };
}

async function filter(input: Record<string, unknown>, options: IPipeOptionsFilter = prepared()) {
  const pipe = app.bean._getBean(PipeFilter);
  return await pipe.transform(input, metadata, options);
}

describe('publicFilter.test.ts', { concurrency: false }, () => {
  it('keeps named UI metadata separate from strict action controls without mutating the source', async () => {
    await app.bean.executor.mockCtx(async () => {
      const options = prepared();
      assert.equal(options.query, policy);
      assert.deepEqual(Object.keys(options.namedSchema.shape), ['title', 'score', 'createdAt']);
      const object = options.schema as z.ZodObject;
      assert.ok(object.shape.where);
      assert.ok(object.shape.orders);
      assert.equal(object.safeParse({ columns: ['title'] }).success, false);
      assert.equal(object.safeParse({ unknown: true }).success, false);
      assert.deepEqual(ZodMetadata.getOpenapiMetadata(object.shape.title), {
        rest: { visible: true },
      });
      assert.deepEqual(
        (ZodMetadata.getOpenapiMetadata(object) as any).filter.capabilities.query.fields.title
          .operators,
        ['eq', 'containsI'],
      );
    });
  });

  it('AND-combines HTTP JSON AST and named fields, parses pages once, and returns no named controls', async () => {
    await app.bean.executor.mockCtx(async () => {
      const where = { field: 'score', op: 'gte', value: 3 };
      const result = await filter({
        where: JSON.stringify(where),
        title: 'hello',
        pageNo: '2',
        pageSize: '10',
      });
      assert.deepEqual(result, {
        where: { and: [where, { field: 'title', op: 'containsI', value: 'hello' }] },
        pageNo: 2,
        pageSize: 10,
      });
      assert.deepEqual(validateQuery(policy, result, 'select', undefined, true), result);
      assert.equal('title' in result, false);
      assert.equal('limit' in result, false);
      assert.equal('joins' in result, false);
    });
  });

  it('rejects unsafe native coercion, double JSON, unknown controls, SQL-style where, and list controls in analysis', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const input of [
        { where: { field: 'score', op: 'gte', value: '3' } },
        { where: JSON.stringify(JSON.stringify({ field: 'title', op: 'eq', value: 'x' })) },
        { where: { title: { _eq_: 'x' } } },
        { orders: 'title,desc' },
        { columns: ['title'] },
        { joins: [] },
        { pageNo: '1.5' },
        { pageNo: true },
      ]) {
        await assert.rejects(() => filter(input), isPublicError);
      }
      const analysis = {
        modelLike: policy.modelLike,
        modelClass: policy.modelClass,
        groups: ['title'],
        aggrs: { count: ['*'] },
        defaults: { group: { groups: ['title'], aggrs: { count: ['*'] } } },
        limits: { maxGroups: 3, maxMetrics: 10, maxGroupRows: 1000 },
      };
      const named = z.object({ title: z.string().optional() });
      const groupOptions: IPipeOptionsFilter = {
        disableErrorMessages: false,
        errorHttpStatusCode: 400,
        query: policy,
        analysis,
        analysisMode: 'group',
        namedSchema: named,
        schema: z.strictObject({
          title: named.shape.title,
          where: z.unknown().optional(),
          groups: z.unknown().optional(),
          aggrs: z.unknown().optional(),
        }),
        type: 'query',
      };
      for (const input of [{ orders: [] }, { pageNo: 1 }, { pageSize: 20 }]) {
        await assert.rejects(() => filter(input, groupOptions), isPublicError);
      }
    });
  });

  it('bounds native graphs before recursive validation and permits normal serialized AST transport', async () => {
    await app.bean.executor.mockCtx(async () => {
      let where: any = { field: 'title', op: 'eq', value: 'x' };
      for (let i = 0; i < 100; i++) where = { not: where };
      await assert.rejects(() => filter({ where }), isPublicError);
      const cyclic: any = {};
      cyclic.not = cyclic;
      await assert.rejects(() => filter({ where: cyclic }), isPublicError);
      const normal = {
        and: Array.from({ length: 6 }, (_, i) => ({
          field: 'title',
          op: 'eq',
          value: `item-${i}`,
        })),
      };
      assert.ok(JSON.stringify(normal).length > 256);
      assert.deepEqual((await filter({ where: JSON.stringify(normal) })).where, normal);
      assert.throws(
        () =>
          checkQueryBudget(
            { where: { field: 'title', op: 'eq', value: 'x'.repeat(257) } },
            policy.limits,
          ),
        isPublicError,
      );
    });
  });

  it('retains plain narrow named filters and declared pagination, without generic controls', async () => {
    await app.bean.executor.mockCtx(async () => {
      const options = {
        ...prepareAnalysisFilter(
          z.object({
            title: z.string().optional(),
            pageNo: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(20),
          }),
        ),
        type: 'query' as const,
        disableErrorMessages: false,
        errorHttpStatusCode: 400,
      };
      assert.equal(options.query, undefined);
      assert.deepEqual(await filter({ title: 'hello' }, options), {
        pageNo: 1,
        pageSize: 20,
        where: { field: 'title', op: 'containsI', value: 'hello' },
      });
      await assert.rejects(
        () => filter({ where: { field: 'title', op: 'eq', value: 'x' } }, options),
        isPublicError,
      );
      await assert.rejects(() => filter({ orders: [] }, options), isPublicError);
    });
  });

  it('normalizes date ranges to canonical ISO AST contributions', async () => {
    await app.bean.executor.mockCtx(async () => {
      const result = await filter({ createdAt: '2026-01-02~2026-01-03' });
      const where = result.where as any;
      assert.deepEqual(
        where.and.map((leaf: any) => [leaf.field, leaf.op]),
        [
          ['createdAt', 'gte'],
          ['createdAt', 'lt'],
        ],
      );
      for (const leaf of where.and)
        assert.equal(z.iso.datetime({ offset: true }).safeParse(leaf.value).success, true);
      assert.equal(
        new Date(where.and[1].value).getTime() - new Date(where.and[0].value).getTime(),
        2 * 24 * 60 * 60 * 1000,
      );
    });
  });
});
