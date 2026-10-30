import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { cast } from 'vona';
import { app } from 'vona-mock';
import { $schema } from 'vona-module-a-openapiutils';
import { $Dto, $relationDynamic } from 'vona-module-a-orm';
import { ModelPost, ModelUserStats, ModelUserStatsGroup } from 'vona-module-test-vona';

describe('aggregateContract.test.ts', () => {
  it('keeps aggregate strings and SQL nulls across query cache boundaries and DTO parsing', async () => {
    await app.bean.executor.mockCtx(async () => {
      const model = app.scope('test-vona').model.user;
      const prefix = `aggregateContract:${randomUUID()}`;
      const where = { name: { _startsWith_: `${prefix}:` } };
      const aggrs = {
        count: ['*', 'age'] as ('*' | 'age')[],
        sum: 'age' as const,
        avg: 'age' as const,
        min: 'age' as const,
        max: 'age' as const,
      };
      const query = { where, aggrs };
      const groupQuery = {
        ...query,
        groups: 'scores' as const,
        orders: [['scores', 'asc']] as ['scores', 'asc'][],
      };
      const table = model.getTable(undefined);
      // Use the real SQL cache key, without intercepting or replacing a shared cache method.
      const cache = model.cacheQuery.getInstance(table);
      const key = { sql: cast(model)._select_buildParams(table, query).toQuery() };
      const groupKey = { sql: cast(model)._select_buildParams(table, groupQuery).toQuery() };
      const cached = { cache: { enable: true } };
      const bypass = { disableCacheQuery: true };
      const schema = $schema($Dto.aggregate('test-vona:user', aggrs));
      const groupSchema = $schema($Dto.group('test-vona:user', 'scores', aggrs));
      try {
        await model.insertBulk([
          { name: `${prefix}:first`, age: 3, scores: 1 },
          { name: `${prefix}:second`, age: 4, scores: 1 },
          { name: `${prefix}:null`, scores: 2 },
        ]);
        await cache.del(key);
        await cache.del(groupKey);
        assert.equal(await cache.peek(key), undefined);
        assert.equal(await cache.peek(groupKey), undefined);
        for (const options of [cached, cached, bypass]) {
          const result = await model.aggregate(query, options);
          assert.equal(result.count_all, '3');
          assert.equal(result.count_age, '2');
          assert.equal(result.sum_age, '7');
          assert.equal(typeof result.avg_age, 'string');
          assert.equal(Number(result.avg_age), 3.5);
          assert.equal(result.min_age, '3');
          assert.equal(result.max_age, '4');
          assert.deepEqual(await schema.parseAsync(result), result);
          assert.equal(await model.count({ where }, options), '3');
          const page = await model.selectAndCount({ where, limit: 1 }, options);
          assert.equal(page.total, '3');
          assert.equal(page.list.length, 1);
          assert.equal(page.pageCount, 3);
          const groups = await model.group(groupQuery, options);
          assert.equal(groups.length, 2);
          assert.equal(groups[0].scores, 1);
          assert.equal(groups[0].count_all, '2');
          assert.equal(groups[0].count_age, '2');
          assert.equal(groups[0].sum_age, '7');
          assert.equal(typeof groups[0].avg_age, 'string');
          assert.equal(Number(groups[0].avg_age), 3.5);
          assert.equal(groups[0].min_age, '3');
          assert.equal(groups[0].max_age, '4');
          assert.deepEqual(groups[1], {
            scores: 2,
            count_all: '1',
            count_age: '0',
            sum_age: null,
            avg_age: null,
            min_age: null,
            max_age: null,
          });
          for (const group of groups) assert.deepEqual(await groupSchema.parseAsync(group), group);
        }
        assert.notEqual(await cache.peek(key), undefined);
        assert.notEqual(await cache.peek(groupKey), undefined);
        // A pre-normalization cache entry must be normalized on reads, not only on SQL misses.
        const legacy = {
          count_all: 17,
          count_age: 16,
          sum_age: 19,
          avg_age: 9.5,
          min_age: 9,
          max_age: 10,
        };
        await cache.set([legacy], key);
        await cache.set([{ scores: 1, ...legacy }], groupKey);
        assert.deepEqual(await model.aggregate(query, cached), {
          count_all: '17',
          count_age: '16',
          sum_age: '19',
          avg_age: '9.5',
          min_age: '9',
          max_age: '10',
        });
        assert.deepEqual(await model.group(groupQuery, cached), [
          {
            scores: 1,
            count_all: '17',
            count_age: '16',
            sum_age: '19',
            avg_age: '9.5',
            min_age: '9',
            max_age: '10',
          },
        ]);
        assert.equal((await model.aggregate(query, bypass)).count_all, '3');
        assert.equal((await model.group(groupQuery, bypass)).length, 2);
        for (const emptyWhere of [{ name: `${prefix}:null` }, { name: `${prefix}:empty` }]) {
          const result = await model.aggregate({ aggrs, where: emptyWhere }, bypass);
          assert.deepEqual(result, {
            count_all: emptyWhere.name.endsWith(':null') ? '1' : '0',
            count_age: '0',
            sum_age: null,
            avg_age: null,
            min_age: null,
            max_age: null,
          });
          assert.deepEqual(await schema.parseAsync(result), result);
        }
        const emptyWhere = { name: `${prefix}:empty` };
        assert.equal(await model.count({ where: emptyWhere }, bypass), '0');
        assert.deepEqual(await model.group({ ...groupQuery, where: emptyWhere }, bypass), []);
        const emptyPage = await model.selectAndCount({ where: emptyWhere, limit: 1 }, bypass);
        assert.equal(emptyPage.total, '0');
        assert.deepEqual(emptyPage.list, []);
        assert.equal(emptyPage.pageCount, 0);
      } finally {
        await cache.del(key);
        await cache.del(groupKey);
        await model.delete(where);
      }
    });
  });

  it('keeps single and batched relation aggregates compatible with their DTOs', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('test-vona');
      const prefix = `aggregateRelations:${randomUUID()}`;
      const where = { name: { _startsWith_: `${prefix}:` } };
      const aggrs = {
        count: '*' as const,
        sum: 'stars' as const,
        avg: 'stars' as const,
        min: 'stars' as const,
        max: 'stars' as const,
      };
      const options = {
        include: { posts: false as const },
        with: { posts: $relationDynamic.hasMany(() => ModelPost, 'userId', { aggrs }) },
      };
      const relationSchema = $schema($Dto.aggregate('test-vona:post', aggrs));
      const statsSchema = $schema(
        $Dto.get(() => ModelUserStats, { columns: 'name', include: { roles: true } }),
      );
      const groupedSchema = $schema(
        $Dto.get(() => ModelUserStatsGroup, { columns: 'name', include: { roles: true } }),
      );
      try {
        const users = await scope.model.user.insertBulk([
          { name: `${prefix}:posts` },
          { name: `${prefix}:empty` },
        ]);
        await scope.model.post.insertBulk([
          { title: `${prefix}:first`, userId: users[0].id, stars: 2 },
          { title: `${prefix}:second`, userId: users[0].id, stars: 3 },
        ]);
        const single = await scope.model.userStats.get({ id: users[0].id }, options);
        const batch = await scope.model.userStats.select({ where, ...options });
        const batched = batch.find(user => user.id === users[0].id);
        assert.ok(single?.posts);
        assert.ok(batched?.posts);
        for (const posts of [single.posts, batched.posts]) {
          assert.equal(posts.count_all, '2');
          assert.equal(posts.sum_stars, '5');
          assert.equal(typeof posts.avg_stars, 'string');
          assert.equal(Number(posts.avg_stars), 2.5);
          assert.equal(posts.min_stars, '2');
          assert.equal(posts.max_stars, '3');
          assert.deepEqual(await relationSchema.parseAsync(posts), posts);
        }
        // Preserve the distinction: a single aggregate has an empty SQL row,
        // whereas the batched GROUP BY path has no matching relation row.
        const empty = await scope.model.userStats.get({ id: users[1].id }, options);
        assert.deepEqual(empty?.posts, {
          count_all: '0',
          sum_stars: null,
          avg_stars: null,
          min_stars: null,
          max_stars: null,
        });
        assert.equal(batch.find(user => user.id === users[1].id)?.posts, undefined);
        assert.deepEqual(await relationSchema.parseAsync(empty?.posts), empty?.posts);
        for (const user of await scope.model.userStats.select({
          where,
          columns: 'name',
          include: { roles: true },
        })) {
          assert.deepEqual(await statsSchema.parseAsync(user), user);
        }
        for (const user of await scope.model.userStatsGroup.select({
          where,
          columns: 'name',
          include: { roles: true },
        })) {
          assert.deepEqual(await groupedSchema.parseAsync(user), user);
        }
      } finally {
        await scope.model.post.delete({ title: { _startsWith_: `${prefix}:` } });
        await scope.model.user.delete(where);
      }
    });
  });
});
