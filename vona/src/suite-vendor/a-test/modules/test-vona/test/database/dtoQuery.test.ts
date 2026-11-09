import type { TypeQueryInput } from 'vona-module-a-orm';

import { isNil } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { $protocolKey } from 'vona';
import { app } from 'vona-mock';

import type { postQuery } from '../../src/dto/postSelectReq.ts';

const is422 = (error: { code?: number }) => error.code === 422;

describe('dtoQuery.test.ts', () => {
  it('returns canonical public predicates without compiling ORM controls', async () => {
    await app.bean.executor.mockCtx(async () => {
      const resEcho: TypeQueryInput<typeof postQuery> = await app.bean.executor.performAction(
        'get',
        '/test/vona/post/findManyEcho',
        {
          headers: {
            [$protocolKey('x-vona-tz')]: 'Asia/Tokyo',
          },
          query: {
            where: { field: 'stars', op: 'gt', value: 12 },
            orders: [{ field: 'userName', direction: 'asc' }],
            pageNo: 2,
            pageSize: 30,
            title: 'ai',
            userName: 'tom',
            createdAt: '2025-12-01~2025-12-02',
          },
        },
      );
      assert.ok(resEcho.where && 'and' in resEcho.where);
      // AND contributions are complete without making schema-property order a contract.
      const predicates = resEcho.where.and;
      assert.deepEqual(
        { ...resEcho, where: undefined },
        {
          where: undefined,
          orders: [{ field: 'userName', direction: 'asc' }],
          pageNo: 2,
          pageSize: 30,
        },
      );
      assert.deepEqual(
        predicates.map(predicate => JSON.stringify(predicate)).sort(),
        [
          { field: 'stars', op: 'gt', value: 12 },
          { field: 'title', op: 'containsI', value: 'ai' },
          {
            and: [
              { field: 'createdAt', op: 'gte', value: '2025-11-30T15:00:00.000Z' },
              { field: 'createdAt', op: 'lt', value: '2025-12-02T15:00:00.000Z' },
            ],
          },
          { field: 'userName', op: 'eqI', value: 'tom' },
        ]
          .map(predicate => JSON.stringify(predicate))
          .sort(),
      );
      for (const query of [{ where: { field: 'title', op: 'isNull' } }, { title: 'null' }]) {
        const result = await app.bean.executor.performAction(
          'get',
          '/test/vona/post/findManyEcho',
          { query },
        );
        assert.deepEqual(result, { where: { field: 'title', op: 'isNull' } });
      }
      const dateNull = await app.bean.executor.performAction(
        'get',
        '/test/vona/post/findManyEcho',
        { query: { createdAt: 'null' } },
      );
      assert.deepEqual(dateNull, { where: { field: 'createdAt', op: 'isNull' } });
      const res = await app.bean.executor.performAction('get', '/test/vona/post/findMany', {
        query: {
          where: { field: 'stars', op: 'gt', value: 12 },
          orders: [{ field: 'createdAt', direction: 'desc' }],
          pageNo: 2,
          pageSize: 30,
          title: 'ai',
          userName: 'tom',
        },
      });
      assert.equal(Array.isArray(res.list), true);
      assert.equal(!isNil(res.total), true);
    });
  });

  it('returns bounded machine-readable query diagnostics over HTTP without submitted values', async () => {
    await app.bean.executor.mockCtx(async () => {
      const submittedValue = 'private-submitted-projection-value';
      const url = new URL(app.util.getAbsoluteUrlByApiPath('/test/vona/post/findManyEcho'));
      url.searchParams.set('columns', submittedValue);
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      assert.equal(response.status, 422);
      const text = await response.text();
      const body = JSON.parse(text);
      assert.equal(body.code, 422);
      assert.deepEqual(body.errors, {
        queryCode: 'query_unknown_control',
        path: 'columns',
      });
      assert.ok(Buffer.byteLength(text, 'utf8') < 512);
      assert.equal(text.includes(submittedValue), false);
    });
  });

  it('rejects legacy DSL, projection and internal controls at the public boundary', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const query of [
        { where: { stars: { _gt_: 12 } } },
        { where: { field: 'stars', op: 'gt', value: '12' } },
        { where: { field: 'testVonaPost.title', op: 'eq', value: 'title' } },
        { where: { field: 'title', op: 'eq', value: null } },
        { where: '{invalid' },
        { orders: [['title', 'asc']] },
        { orders: [{ field: 'testVonaPost.title', direction: 'asc' }] },
        { columns: 'id,title' },
        { columns: ['id'] },
        { joins: [] },
        { include: { user: true } },
        { limit: 1 },
        { offset: 0 },
        { pageNo: 0 },
        { pageSize: 101 },
      ]) {
        await assert.rejects(
          () => app.bean.executor.performAction('get', '/test/vona/post/findManyEcho', { query }),
          is422,
        );
      }
    });
  });
});
