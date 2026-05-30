import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $relationMutate } from 'vona-module-a-orm';
import { ModelPost, ModelRole, ModelRoleUser } from 'vona-module-test-vona';

describe('modelRelationsMutate.test.ts', () => {
  it('action:modelRelationsMutate', async () => {
    await app.bean.executor.mockCtx(async () => {
      const prefix = 'action:modelRelationsMutate';
      // scope
      const scopeTest = app.scope('test-vona');
      // insert: roles
      const roles = await scopeTest.model.role.insertBulk([
        { name: `${prefix}:family` },
        { name: `${prefix}:friend` },
      ]);
      assert.equal(roles.length, 2);
      assert.equal(roles[0].id !== undefined, true);
      // insert: users
      const users = await scopeTest.model.user.insertBulk(
        [
          {
            name: `${prefix}:tom`,
            posts: [
              {
                title: `${prefix}:postApple`,
                postContent: {
                  content: `${prefix}:postContentApple`,
                },
              },
            ],
            roles: [
              {
                id: roles[0].id,
              },
            ],
          },
        ],
        {
          include: {
            posts: { include: { postContent: true } },
            roles: true,
          },
        },
      );
      assert.equal(users.length, 1);
      // check
      const post = await scopeTest.model.post.get(
        { id: users[0].posts?.[0].id },
        { include: { postContent: true } },
      );
      assert.equal(post?.postContent?.content, `${prefix}:postContentApple`);
      // update: users
      const _usersUpdate = await scopeTest.model.user.update(
        {
          id: users[0].id,
          posts: [
            // update
            {
              id: users[0].posts?.[0].id,
              title: `${prefix}:postApple-update`,
              // update
              postContent: {
                content: `${prefix}:postContentApple-update`,
              },
            },
            // insert
            {
              title: `${prefix}:postPear`,
              postContent: {
                content: `${prefix}:postContentPear`,
              },
            },
          ],
          roles: [
            // delete
            { id: users[0].roles![0].id, deleted: true },
            // insert
            { id: roles[1].id },
          ],
        },
        {
          include: {
            posts: { include: { postContent: true } },
            roles: true,
          },
        },
      );
      // check
      const usersUpdateCheck = await scopeTest.model.user.get(
        {
          id: users[0].id,
        },
        {
          include: {
            posts: {
              include: { postContent: true },
              orders: [['id', 'asc']],
            },
            roles: true,
          },
        },
      );
      assert.equal(usersUpdateCheck?.posts.length, 2);
      assert.equal(usersUpdateCheck?.posts[0].title, `${prefix}:postApple-update`);
      assert.equal(
        usersUpdateCheck?.posts[0].postContent?.content,
        `${prefix}:postContentApple-update`,
      );
      assert.equal(usersUpdateCheck?.posts[1].postContent?.content, `${prefix}:postContentPear`);
      assert.equal(usersUpdateCheck?.roles.length, 1);
      assert.equal(usersUpdateCheck?.roles[0].id, roles[1].id);
      // mutate: users
      const _usersMutate = await scopeTest.model.user.mutate(
        {
          id: users[0].id,
          posts: [
            // update
            {
              id: users[0].posts![0].id,
              title: `${prefix}:postApple-mutate`,
              // update
              postContent: {
                id: users[0].posts![0].postContent?.id,
                content: `${prefix}:postContentApple-mutate`,
              },
            },
          ],
          roles: [
            // delete
            { id: roles[1].id, deleted: true },
          ],
        },
        {
          include: {
            posts: { include: { postContent: true } },
            roles: true,
          },
        },
      );
      // check
      const usersMutateCheck = await scopeTest.model.user.get(
        {
          id: users[0].id,
        },
        {
          include: {
            posts: {
              include: { postContent: true },
              orders: [['id', 'asc']],
            },
            roles: { columns: '*' as any },
          },
        },
      );
      assert.equal(usersMutateCheck?.posts.length, 2);
      assert.equal(usersMutateCheck?.posts[0].title, `${prefix}:postApple-mutate`);
      assert.equal(
        usersMutateCheck?.posts[0].postContent?.content,
        `${prefix}:postContentApple-mutate`,
      );
      assert.equal(usersMutateCheck?.posts[1].postContent?.content, `${prefix}:postContentPear`);
      assert.equal(usersMutateCheck?.roles.length, 0);
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
      const roleUsers = await scopeTest.model.roleUser.select({
        where: { userId: users.map(item => item.id) },
      });
      assert.equal(roleUsers.length, 0);
      // delete: roles
      await scopeTest.model.role.deleteBulk(roles.map(item => item.id));
      const roles2 = await scopeTest.model.role.select(
        {
          where: {
            id: roles.map(item => item.id!),
          },
        },
        { disableDeleted: true },
      );
      assert.equal(roles2.length, 2);
      assert.equal(roles2[0].id !== undefined, true);
      assert.equal(roles2[0].deleted, true);
    });
  });

  it('action:modelRelationsMutateWith', async () => {
    await app.bean.executor.mockCtx(async () => {
      const prefix = 'action:modelRelationsMutateWith';
      // scope
      const scopeTest = app.scope('test-vona');
      // insert: roles
      const roles = await scopeTest.model.role.insertBulk([
        { name: `${prefix}:family` },
        { name: `${prefix}:friend` },
      ]);
      assert.equal(roles.length, 2);
      assert.equal(roles[0].id !== undefined, true);
      // insert: users
      const users = await scopeTest.model.user.insertBulk(
        [
          {
            name: `${prefix}:tom`,
            posts: [
              {
                title: `${prefix}:postApple`,
                postContent: {
                  content: `${prefix}:postContentApple`,
                },
              },
            ],
            roles: [
              {
                id: roles[0].id,
              },
            ],
          },
        ],
        {
          with: {
            posts: $relationMutate.hasMany(ModelPost, 'userId', { include: { postContent: true } }),
            roles: $relationMutate.belongsToMany(ModelRoleUser, ModelRole, 'userId', 'roleId'),
          },
        },
      );
      assert.equal(users.length, 1);
      // check
      const post = await scopeTest.model.post.get(
        { id: users[0].posts![0].id },
        { include: { postContent: true } },
      );
      assert.equal(post?.postContent?.content, `${prefix}:postContentApple`);
      // update: users
      const _usersUpdate = await scopeTest.model.user.update(
        {
          id: users[0].id,
          posts: [
            // update
            {
              id: users[0].posts![0].id,
              title: `${prefix}:postApple-update`,
              // update
              postContent: {
                content: `${prefix}:postContentApple-update`,
              },
            },
            // insert
            {
              title: `${prefix}:postPear`,
              postContent: {
                content: `${prefix}:postContentPear`,
              },
            },
          ],
          roles: [
            // delete
            { id: users[0].roles![0].id, deleted: true },
            // insert
            { id: roles[1].id },
          ],
        },
        {
          with: {
            posts: $relationMutate.hasMany(ModelPost, 'userId', { include: { postContent: true } }),
            roles: $relationMutate.belongsToMany(ModelRoleUser, ModelRole, 'userId', 'roleId'),
          },
        },
      );
      // check
      const usersUpdateCheck = await scopeTest.model.user.get(
        {
          id: users[0].id,
        },
        {
          include: {
            posts: {
              include: { postContent: true },
              orders: [['id', 'asc']],
            },
            roles: true,
          },
        },
      );
      assert.equal(usersUpdateCheck?.posts.length, 2);
      assert.equal(usersUpdateCheck?.posts[0].title, `${prefix}:postApple-update`);
      assert.equal(
        usersUpdateCheck?.posts[0].postContent?.content,
        `${prefix}:postContentApple-update`,
      );
      assert.equal(usersUpdateCheck?.posts[1].postContent?.content, `${prefix}:postContentPear`);
      assert.equal(usersUpdateCheck?.roles.length, 1);
      assert.equal(usersUpdateCheck?.roles[0].id, roles[1].id);
      // mutate: users
      const _usersMutate = await scopeTest.model.user.mutate(
        {
          id: users[0].id,
          posts: [
            // update
            {
              id: users[0].posts![0].id,
              title: `${prefix}:postApple-mutate`,
              // update
              postContent: {
                id: users[0].posts![0].postContent?.id,
                content: `${prefix}:postContentApple-mutate`,
              },
            },
          ],
          roles: [
            // delete
            { id: roles[1].id, deleted: true },
          ],
        },
        {
          with: {
            posts: $relationMutate.hasMany(ModelPost, 'userId', { include: { postContent: true } }),
            roles: $relationMutate.belongsToMany(ModelRoleUser, ModelRole, 'userId', 'roleId'),
          },
        },
      );
      // check
      const usersMutateCheck = await scopeTest.model.user.get(
        {
          id: users[0].id,
        },
        {
          include: {
            posts: {
              include: { postContent: true },
              orders: [['id', 'asc']],
            },
            roles: { columns: '*' as any },
          },
        },
      );
      assert.equal(usersMutateCheck?.posts.length, 2);
      assert.equal(usersMutateCheck?.posts[0].title, `${prefix}:postApple-mutate`);
      assert.equal(
        usersMutateCheck?.posts[0].postContent?.content,
        `${prefix}:postContentApple-mutate`,
      );
      assert.equal(usersMutateCheck?.posts[1].postContent?.content, `${prefix}:postContentPear`);
      assert.equal(usersMutateCheck?.roles.length, 0);
      // delete: users
      await scopeTest.model.user.deleteBulk(
        users.map(item => item.id),
        {
          with: {
            posts: $relationMutate.hasMany(ModelPost, 'userId', { include: { postContent: true } }),
            roles: $relationMutate.belongsToMany(ModelRoleUser, ModelRole, 'userId', 'roleId'),
          },
        },
      );
      const roleUsers = await scopeTest.model.roleUser.select({
        where: { userId: users.map(item => item.id) },
      });
      assert.equal(roleUsers.length, 0);
      // delete: roles
      await scopeTest.model.role.deleteBulk(roles.map(item => item.id));
      const roles2 = await scopeTest.model.role.select(
        {
          where: {
            id: roles.map(item => item.id!),
          },
        },
        { disableDeleted: true },
      );
      assert.equal(roles2.length, 2);
      assert.equal(roles2[0].id !== undefined, true);
      assert.equal(roles2[0].deleted, true);
    });
  });

  it('action:modelRelationsMutateTree', async () => {
    await app.bean.executor.mockCtx(async () => {
      const prefix = 'action:modelRelationsMutateTree';
      // scope
      const scopeTest = app.scope('test-vona');
      // create: categoryTree
      const categoryTree = await scopeTest.model.category.insert({
        name: `${prefix}:1`,
        children: [
          {
            name: `${prefix}:1-1`,
            children: [{ name: `${prefix}:1-1-1` }, { name: `${prefix}:1-1-2` }],
          },
          {
            name: `${prefix}:1-2`,
          },
        ],
      });
      const categoryTreeCheck = await scopeTest.model.category.get({ id: categoryTree.id });
      assert.equal(categoryTree.id, categoryTreeCheck?.id);
      const children = categoryTree.children!.sort((a, b) => Number(a.id) - Number(b.id));
      const childrenCheck = categoryTreeCheck!.children.sort((a, b) => Number(a.id) - Number(b.id));
      assert.equal(children[0].name, childrenCheck[0].name);
      assert.equal(children[0].name, `${prefix}:1-1`);
      assert.equal(children[0].children?.length, childrenCheck[0].children.length);
      assert.equal(children[0].children?.length, 2);
      // get: categoryChain
      const categoryChain = await scopeTest.model.categoryChain.get({
        id: children[0].children![0].id,
      });
      assert.equal(categoryChain?.parent?.id, children[0].id);
      assert.equal(categoryChain?.parent?.parent?.id, categoryTree.id);
      assert.equal(categoryChain?.parent?.parent?.parent, undefined);
      // delete: categoryTree
      const items = await scopeTest.model.category.select({
        where: {
          name: { _startsWith_: `${prefix}:` },
        },
        include: { children: false },
      });
      assert.equal(items.length, 5);
      await scopeTest.model.category.delete(
        { id: categoryTree.id },
        { include: { children: { meta: { client: '_auto_' } } } },
      );
      const items2 = await scopeTest.model.category.select({
        where: {
          name: { _startsWith_: `${prefix}:` },
        },
        include: { children: false },
      });
      assert.equal(items2.length, 0);
    });
  });
});
