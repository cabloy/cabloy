import assert from 'node:assert';
import { describe, it } from 'node:test';
import { cast } from 'vona';
import { app } from 'vona-mock';
import { $relationDynamic } from 'vona-module-a-orm';
import { ModelPost, ModelRole, ModelRoleUser } from 'vona-module-test-vona';

describe('modelGroup.test.ts', () => {
  it('action:modelGroup', async () => {
    await app.bean.executor.mockCtx(async () => {
      const prefix = 'action:modelGroup';
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
      // group: user
      const usersGroup = await scopeTest.model.user.group({
        groups: ['name'],
        aggrs: {
          count: ['*', 'age'],
          sum: ['age'],
          avg: 'age',
          max: 'age',
        },
        where: {
          name: { _startsWith_: `${prefix}:` },
        },
        having: {
          _and_: {
            name: { _startsWith_: `${prefix}:` },
            max_age: { _isNot_: null },
          },
          count_all: { _gt_: 0 },
        },
        orders: [['max_age', 'desc']],
      });
      assert.equal(usersGroup.length, 2);
      assert.equal(usersGroup[0].name, `${prefix}:jimmy`);
      assert.equal(usersGroup[0].count_all, 1);
      assert.equal(usersGroup[0].count_age, 1);
      assert.equal(usersGroup[0].sum_age, 5);
      assert.equal(usersGroup[0].avg_age, 5);
      assert.equal(usersGroup[0].max_age, 5);
      // group: usersStats: posts: autoload
      const usersStats = await scopeTest.model.userStatsGroup.select({
        where: {
          id: users.map(item => item.id),
        },
        orders: [['id', 'asc']],
        include: {
          roles: true,
        },
      });
      assert.equal(usersStats.length, 3);
      assert.equal(usersStats[0].posts[0].title, `${prefix}:postApple2`);
      assert.equal(usersStats[0].posts[0].count_all, 1);
      assert.equal(usersStats[0].posts[0].count_title, 1);
      assert.equal(usersStats[0].posts[0].sum_stars, 3);
      assert.equal(usersStats[0].roles[0].count_all, 1);
      // group: usersStats: posts: mixed
      const usersStats2 = await scopeTest.model.userStatsGroup.select({
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
      assert.equal(usersStats2[0].posts[0].title, `${prefix}:postApple2`);
      assert.equal(usersStats2[0].posts[0].count_all, 1);
      assert.equal(cast(usersStats2[0].posts[0]).count_title, undefined);
      assert.equal(usersStats2[0].posts[0].sum_stars, 3);
      assert.equal(usersStats2[0].roles[0].count_all, 1);
      // group: usersStats: posts: disable
      const usersStats3 = await scopeTest.model.userStatsGroup.select({
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
      assert.equal(usersStats3[0].posts[0].title, `${prefix}:postApple2`);
      assert.equal(usersStats3[0].posts[0].count_all, 1);
      assert.equal(cast(usersStats3[0].posts[0]).count_title, undefined);
      assert.equal(cast(usersStats3[0].posts[0]).sum_stars, undefined);
      assert.equal(usersStats3[0].roles[0].count_all, 1);
      // group: usersStats: with
      const usersStats4 = await scopeTest.model.userStatsGroup.select({
        where: {
          id: users.map(item => item.id),
        },
        orders: [['id', 'asc']],
        include: {
          posts: false,
          roles: false,
        },
        with: {
          posts: $relationDynamic.hasMany(
            () => ModelPost,
            'userId',
            {
              groups: ['title'],
              aggrs: { count: '*' },
              orders: [['title', 'desc']],
            },
            undefined,
            true,
          ),
          roles: $relationDynamic.belongsToMany(
            () => ModelRoleUser,
            () => ModelRole,
            'userId',
            'roleId',
            {
              groups: 'name',
              aggrs: { count: '*' },
            },
          ),
        },
      });
      assert.equal(usersStats4.length, 3);
      assert.equal(usersStats4[0].posts[0].title, `${prefix}:postApple2`);
      assert.equal(usersStats4[0].posts[0].count_all, 1);
      assert.equal(cast(usersStats4[0].posts[0]).count_title, undefined);
      assert.equal(cast(usersStats4[0].posts[0]).sum_stars, undefined);
      assert.equal(usersStats4[0].roles[0].count_all, 1);
      // group: get
      const userStats4 = await scopeTest.model.userStatsGroup.get(
        {
          id: users[0].id,
        },
        {
          include: {
            posts: false,
            roles: false,
          },
          with: {
            posts: $relationDynamic.hasMany(
              () => ModelPost,
              'userId',
              {
                groups: ['title'],
                aggrs: { count: '*' },
                orders: [['title', 'desc']],
              },
              undefined,
              true,
            ),
            roles: $relationDynamic.belongsToMany(
              () => ModelRoleUser,
              () => ModelRole,
              'userId',
              'roleId',
              {
                groups: 'name',
                aggrs: { count: '*' },
              },
            ),
          },
        },
      );
      assert.equal(userStats4?.posts[0].title, `${prefix}:postApple2`);
      assert.equal(userStats4?.posts[0].count_all, 1);
      assert.equal(cast(userStats4?.posts[0]).count_title, undefined);
      assert.equal(cast(userStats4?.posts[0]).sum_stars, undefined);
      assert.equal(userStats4?.roles[0].count_all, 1);
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
