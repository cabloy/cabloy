import type { IQueryParams } from 'vona-module-a-orm';

import { isNil } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { $protocolKey } from 'vona';
import { app } from 'vona-mock';

describe('dtoQuery.test.ts', () => {
  it('action:dtoQuery', async () => {
    await app.bean.executor.mockCtx(async () => {
      // findManyEcho
      const resEcho: IQueryParams = await app.bean.executor.performAction(
        'get',
        '/test/vona/post/findManyEcho',
        {
          headers: {
            [$protocolKey('x-vona-tz')]: 'Asia/Tokyo',
          },
          query: {
            columns: 'id,title', // ['id', 'title'],
            where: {
              stars: {
                _gt_: 12,
              },
            },
            // orders: [['userName', 'asc']],
            // orders: [['testVonaPost.createdAt', 'asc']],
            pageNo: 2,
            pageSize: 30,
            title: 'ai',
            userName: 'tom',
            createdAt: '2025-12-01~2025-12-02',
          },
        },
      );
      assert.deepEqual(resEcho.columns, ['id', 'title']);
      assert.deepEqual(resEcho.where, {
        'stars': { _gt_: 12 },
        'title': { _includesI_: 'ai' },
        'testVonaUser.name': { _eqI_: 'tom' },
        'createdAt': {
          _gte_: new Date('2025-11-30T15:00:00.000Z'),
          _lt_: new Date('2025-12-02T15:00:00.000Z'),
        },
      });
      assert.deepEqual(resEcho.orders, [['testVonaPost.createdAt', 'desc']]);
      assert.equal(resEcho.offset, 30);
      assert.equal(resEcho.limit, 30);
      // findMany
      const res = await app.bean.executor.performAction('get', '/test/vona/post/findMany', {
        query: {
          columns: 'id,title', // ['id', 'title'],
          where: {
            stars: {
              _gt_: 12,
            },
          },
          orders: [['testVonaPost.createdAt', 'desc']],
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
});
