import assert from 'node:assert';
import { describe, it } from 'node:test';
import { cast } from 'vona';
import { app } from 'vona-mock';
import { $relationDynamic } from 'vona-module-a-orm';
import { ModelPost, ModelPostContent, ModelUser } from 'vona-module-test-vona';

describe('modelRelations.test.ts', () => {
  it('action:modelRelations', async () => {
    await app.bean.executor.mockCtx(async () => {
      const prefix = 'action:modelRelations';
      // scope
      const scopeTest = app.scope('test-vona');
      // test data: create
      const testData = await scopeTest.service.testData.create(prefix);
      const { userTom, userJimmy, roleFamily, roleFriend, postApple, postPear, postContentApple } =
        testData;
      // relation: hasOne
      const posts = await scopeTest.model.post.select({
        columns: ['id', 'title', 'userId'],
        where: {
          id: [postApple.id, postPear.id],
        },
        orders: [['id', 'asc']],
        include: { postContent: true },
      });
      assert.equal(posts.length, 2);
      assert.equal(posts[0].postContent?.content, 'action:modelRelations:postContentApple');
      assert.equal(cast(posts[0].postContent)?.iid, undefined);
      assert.equal(posts[1].postContent, undefined);
      // relation: hasOne: get
      const postGet = await scopeTest.model.post.get(
        { id: postApple.id },
        { columns: 'id', include: { postContent: true } },
      );
      assert.equal(cast(postGet)?.iid, undefined);
      assert.equal(postGet?.postContent?.content, 'action:modelRelations:postContentApple');
      // relation: hasOne: columns
      const postGetColumns = await scopeTest.model.post.get(
        { id: postApple.id },
        { columns: ['id'], include: { postContent: { columns: ['id'] } } },
      );
      assert.equal(cast(postGetColumns?.postContent)?.content, undefined);
      assert.equal(Object.keys(postGetColumns!.postContent!).length, 1);
      assert.equal(Object.keys(postGetColumns!).length, 1 + 2); // .user + .postContent
      // relation: belongsTo
      const postContents = await scopeTest.model.postContent.select({
        where: {
          id: postContentApple.id,
        },
        include: { post: true },
      });
      assert.equal(postContents.length, 1);
      assert.equal(postContents[0].post?.title, 'action:modelRelations:postApple');
      // relation: belongsTo: get
      const postContentGet = await scopeTest.model.postContent.get(
        { id: postContentApple.id },
        { include: { post: true } },
      );
      assert.equal(postContentGet?.post?.title, 'action:modelRelations:postApple');
      // relation: belongsTo: autoload
      const postAutoload = await scopeTest.model.post.get({ id: postApple.id });
      assert.equal(postAutoload!.user?.id, postAutoload!.userId);
      assert.equal(cast(postAutoload?.user)?.iid, undefined);
      assert.equal(Object.keys(postAutoload!.user!).length, 2); // id + name
      // relation: hasMany
      const users = await scopeTest.model.user.select({
        where: {
          id: [userTom.id, userJimmy.id],
        },
        orders: [['id', 'asc']],
        include: { posts: true },
      });
      assert.equal(users.length, 2);
      assert.equal(users[0].posts.length, 2);
      assert.equal(users[1].posts.length, 0);
      // relation: hasMany: options.where/orders
      const userOptions = await scopeTest.model.user.select({
        where: {
          id: [userTom.id, userJimmy.id],
        },
        orders: [['id', 'asc']],
        include: {
          posts: {
            where: {
              id: { _in_: [postApple.id, postPear.id] },
            },
            orders: [['id', 'desc']],
          },
        },
      });
      assert.equal(userOptions.length, 2);
      assert.equal(userOptions[0].posts.length, 2);
      assert.equal(userOptions[1].posts.length, 0);
      assert.equal(cast(userOptions[0].posts[0]).iid, undefined);
      assert.equal(
        Number.parseInt(userOptions[0].posts[0].id as any) >
          Number.parseInt(userOptions[0].posts[1].id as any),
        true,
      );
      // relation: hasMany: options.where/orders
      const userOptions2 = await scopeTest.model.user.select({
        where: {
          id: [userTom.id, userJimmy.id],
        },
        orders: [['id', 'asc']],
        include: {
          posts: {
            joins: [
              [
                'innerJoin',
                'testVonaPostContent',
                ['testVonaPost.id', 'testVonaPostContent.postId'],
              ],
            ],
            where: {
              'testVonaPost.id': { _in_: [postApple.id, postPear.id] },
              '_and_': { 'testVonaPost.id': { _notIn_: [postApple.id, postPear.id] } },
              'testVonaPostContent.id': [postContentApple.id],
            },
            orders: [['testVonaPost.id', 'desc']],
          },
          roles: true,
        },
      });
      assert.equal(userOptions2.length, 2);
      assert.equal(userOptions2[0].posts.length, 0);
      assert.equal(userOptions2[1].posts.length, 0);
      // relation: hasMany: get
      const userGet = await scopeTest.model.user.get(
        { id: userTom.id },
        { include: { posts: true } },
      );
      assert.equal(userGet?.posts.length, 2);
      // relation: belongsToMany
      const roles = await scopeTest.model.role.select({
        where: {
          id: [roleFamily.id, roleFriend.id],
        },
        orders: [['id', 'asc']],
        include: { users: true },
      });
      assert.equal(roles.length, 2);
      assert.equal(roles[0].users.length, 2);
      assert.equal(roles[1].users.length, 1);
      // relation: belongsToMany: get
      const roleGet = await scopeTest.model.role.get(
        { id: roleFamily.id },
        { include: { users: true } },
      );
      assert.equal(roleGet?.users.length, 2);
      assert.equal(cast(roleGet?.users[0]).iid, undefined);
      // relation: belongsToMany: mget
      const roles2 = await scopeTest.model.role.mget([roleFamily.id, roleFriend.id], {
        columns: ['id', 'name'],
        include: { users: true },
      });
      assert.equal(roles2.length, 2);
      assert.equal(cast(roles2[0]).iid, undefined);
      assert.equal(roles2[0].users.length, 2);
      assert.equal(roles2[1].users.length, 1);
      // relation: include + with
      const items = await scopeTest.model.post.select({
        where: {
          id: postApple.id,
        },
        include: {
          postContent: {
            include: {
              post: { include: { user: { columns: ['id'] } }, meta: { client: '_auto_' } },
            },
            with: {
              post3: $relationDynamic.belongsTo(
                () => ModelPostContent,
                () => ModelPost,
                'postId',
                {
                  include: {
                    postContent: true,
                  },
                },
              ),
            },
          },
        },
        with: {
          user3: $relationDynamic.belongsTo(ModelPost, () => ModelUser, 'userId', {
            include: { posts: true },
            with: {
              roles: $relationDynamic.belongsToMany(
                'test-vona:roleUser',
                'test-vona:role',
                'userId',
                'roleId',
                {
                  columns: ['id', 'name'],
                  meta: { client: '_auto_' },
                },
              ),
            },
            columns: ['id', 'name'],
          }),
        },
      });
      assert.equal(Object.keys(items[0].postContent!.post!.user!).length, 1);
      assert.equal(items[0].postContent?.post3?.postContent?.content !== undefined, true);
      assert.equal(items[0].user3!.posts.length > 0, true);
      assert.equal(items[0].user3!.roles.length > 0, true);
      assert.equal(cast(items[0].user3!.roles[0]).iid, undefined);
      assert.equal(cast(items[0].user3)?.iid, undefined);
      // test data: delete
      await scopeTest.service.testData.drop(testData);
    });
  });
});
