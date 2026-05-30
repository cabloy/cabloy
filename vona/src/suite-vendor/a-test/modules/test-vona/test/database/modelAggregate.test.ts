import assert from 'node:assert';
import { describe, it } from 'node:test';
import { cast } from 'vona';
import { app } from 'vona-mock';
import { $relationDynamic } from 'vona-module-a-orm';
import { ModelPost, ModelRole, ModelRoleUser } from 'vona-module-test-vona';

describe('modelAggregate.test.ts', () => {
  it('action:modelAggregate', async () => {
    await app.bean.executor.mockCtx(async () => {
      const prefix = 'action:modelAggregate';
      // scope
      const scopeTest = app.scope('test-vona');
      // insert: roles
      const roles = await scopeTest.model.role.insertBulk([
        { name: `${prefix}:family` },
        { name: `${prefix}:friend` },
      ]);
      assert.equal(roles.length, 2);
      assert.equal(roles[0].id !== undefined, true);
      // create: users
      const users = await scopeTest.model.user.insertBulk(
        [
          {
            name: `${prefix}:tom`,
            age: 3,
            posts: [
              {
                title: `${prefix}:postApple`,
                stars: 2,
                postContent: {
                  content: `${prefix}:postContentApple`,
                },
              },
              {
                title: `${prefix}:postApple2`,
                stars: 3,
                postContent: {
                  content: `${prefix}:postContentApple2`,
                },
              },
            ],
            roles: [
              {
                id: roles[0].id,
              },
            ],
          },
          {
            name: `${prefix}:jimmy`,
            age: 5,
            posts: [
              {
                title: `${prefix}:postPear`,
                stars: 4,
                postContent: {
                  content: `${prefix}:postContentPear`,
                },
              },
            ],
          },
          { name: `${prefix}:mike` },
        ],
        {
          include: {
            posts: { include: { postContent: true } },
            roles: true,
          },
        },
      );
      // count: user
      const userCount = await scopeTest.model.user.count({
        column: '*',
        where: {
          name: { _startsWith_: `${prefix}:` },
        },
      });
      assert.equal(userCount, 3);
      // aggr: user
      const userStats = await scopeTest.model.user.aggregate({
        aggrs: {
          count: ['*', 'age'],
          sum: ['age'],
          avg: 'age',
          max: 'age',
        },
        where: {
          name: { _startsWith_: `${prefix}:` },
        },
      });
      assert.equal(userStats.count_all, 3);
      assert.equal(userStats.count_age, 2);
      assert.equal(userStats.sum_age, 8);
      assert.equal(userStats.avg_age, 4);
      assert.equal(userStats.max_age, 5);
      // aggr: usersStats: posts: autoload
      const usersStats = await scopeTest.model.userStats.select({
        where: {
          id: users.map(item => item.id),
        },
        orders: [['id', 'asc']],
        include: {
          roles: true,
        },
      });
      assert.equal(usersStats.length, 3);
      assert.equal(usersStats[0].posts?.count_all, 2);
      assert.equal(usersStats[0].posts?.count_title, 2);
      assert.equal(usersStats[0].posts?.sum_stars, 5);
      assert.equal(usersStats[0].roles?.count_all, 1);
      // aggr: usersStats: posts: mixed
      const usersStats2 = await scopeTest.model.userStats.select({
        where: {
          id: users.map(item => item.id),
        },
        orders: [['id', 'asc']],
        include: {
          posts: { aggrs: { count: '*' } },
          roles: true,
        },
      });
      assert.equal(usersStats2.length, 3);
      assert.equal(usersStats2[0].posts?.count_all, 2);
      assert.equal(cast(usersStats2[0].posts).count_title, undefined);
      assert.equal(usersStats2[0].posts?.sum_stars, 5);
      assert.equal(usersStats2[0].roles?.count_all, 1);
      // aggr: usersStats: posts: disable
      const usersStats3 = await scopeTest.model.userStats.select({
        where: {
          id: users.map(item => item.id),
        },
        orders: [['id', 'asc']],
        include: {
          posts: {
            aggrs: {
              count: ['*'],
              sum: [],
            },
          },
          roles: true,
        },
      });
      assert.equal(usersStats3.length, 3);
      assert.equal(usersStats3[0].posts?.count_all, 2);
      assert.equal(cast(usersStats3[0].posts).count_title, undefined);
      assert.equal(cast(usersStats3[0].posts).sum_stars, undefined);
      assert.equal(usersStats3[0].roles?.count_all, 1);
      // aggr: usersStats: with
      const usersStats4 = await scopeTest.model.userStats.select({
        where: {
          id: users.map(item => item.id),
        },
        orders: [['id', 'asc']],
        include: {
          posts: false,
          roles: false,
        },
        with: {
          posts: $relationDynamic.hasMany(() => ModelPost, 'userId', {
            aggrs: { count: '*' },
          }),
          roles: $relationDynamic.belongsToMany(
            () => ModelRoleUser,
            () => ModelRole,
            'userId',
            'roleId',
            {
              aggrs: { count: '*' },
            },
          ),
        },
      });
      assert.equal(usersStats4.length, 3);
      assert.equal(usersStats4[0].posts?.count_all, 2);
      assert.equal(cast(usersStats4[0].posts).count_title, undefined);
      assert.equal(cast(usersStats4[0].posts).sum_stars, undefined);
      assert.equal(usersStats4[0].roles?.count_all, 1);
      // aggr: get
      const userStats4 = await scopeTest.model.userStats.get(
        {
          id: users[0].id,
        },
        {
          include: {
            posts: false,
            roles: false,
          },
          with: {
            posts: $relationDynamic.hasMany(() => ModelPost, 'userId', {
              aggrs: { count: '*' },
            }),
            roles: $relationDynamic.belongsToMany(
              () => ModelRoleUser,
              () => ModelRole,
              'userId',
              'roleId',
              {
                aggrs: { count: '*' },
              },
            ),
          },
        },
      );
      assert.equal(userStats4?.posts?.count_all, 2);
      assert.equal(cast(userStats4?.posts).count_title, undefined);
      assert.equal(cast(userStats4?.posts).sum_stars, undefined);
      assert.equal(userStats4?.roles?.count_all, 1);
      // delete: users
      await scopeTest.model.user.deleteBulk(
        users.map(item => item.id),
        {
          include: {
            posts: { include: { postContent: true } },
            roles: true,
          },
        },
      );
      // delete: roles
      await scopeTest.model.role.deleteBulk(roles.map(item => item.id));
    });
  });
});
