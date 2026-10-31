import type { TableIdentity } from 'table-identity';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $relationMutate } from 'vona-module-a-orm';
import { ModelPost } from 'vona-module-test-vona';

const uncached = { disableCacheEntity: true, disableCacheQuery: true };
const include = { posts: { include: { postContent: true } }, roles: true } as const;

async function createFixture(marker: string, ownedUserIds: TableIdentity[]) {
  const scopeTest = app.scope('test-vona');
  const users = await scopeTest.model.user.insertBulk(
    ['first', 'missing', 'deleted', 'last'].map(name => ({ name: `${marker}${name}` })),
  );
  ownedUserIds.push(...users.map(item => item.id));
  const roles = await scopeTest.model.role.insertBulk([
    { name: `${marker}initial` },
    { name: `${marker}added` },
  ]);
  const posts = await scopeTest.model.post.insertBulk(
    users.map((user, index) => ({ title: `${marker}post:${index}`, userId: user.id })),
  );
  const contents = await scopeTest.model.postContent.insertBulk(
    posts.map((post, index) => ({ content: `${marker}content:${index}`, postId: post.id })),
  );
  await scopeTest.model.roleUser.insertBulk(
    users.map(user => ({ userId: user.id, roleId: roles[0].id })),
  );

  // Leave local children and junctions behind, without a writable parent.
  await scopeTest.model.user.delete({ id: users[1].id }, { disableDeleted: true });
  await scopeTest.model.user.getById(users[2].id);
  // Keep a warmed live entity cache: admission must consult durable scoped state.
  await scopeTest.model.user.builder().where('id', users[2].id).update({ deleted: true });
  return { users, roles, posts, contents };
}

async function readChildren(userId: TableIdentity) {
  const scopeTest = app.scope('test-vona');
  const options = { ...uncached, disableDeleted: true };
  const posts = await scopeTest.model.post.select(
    {
      columns: ['id', 'userId', 'title', 'deleted'],
      where: { userId },
      orders: [['id', 'asc']],
      include: { user: false },
    },
    options,
  );
  const contents = await scopeTest.model.postContent.select(
    {
      columns: ['id', 'postId', 'content', 'deleted'],
      where: { postId: posts.map(item => item.id!) },
      orders: [['id', 'asc']],
    },
    options,
  );
  const roleUsers = await scopeTest.model.roleUser.select(
    {
      columns: ['id', 'userId', 'roleId', 'deleted'],
      where: { userId },
      orders: [['id', 'asc']],
    },
    options,
  );
  return { posts, contents, roleUsers };
}

async function cleanup(marker: string, ownedUserIds: TableIdentity[]) {
  const scopeTest = app.scope('test-vona');
  const options = { ...uncached, disableDeleted: true };
  // Include roots inserted by mutateBulk, even if a later assertion failed.
  const users = await scopeTest.model.user.select(
    { columns: ['id'], where: { name: { _startsWith_: marker } } },
    options,
  );
  const userIds = [...new Set(ownedUserIds.concat(users.map(item => item.id!)))];
  await scopeTest.model.postContent.delete({ content: { _startsWith_: marker } }, options);
  await scopeTest.model.post.delete(
    { title: { _startsWith_: marker } },
    { ...options, include: { user: false } },
  );
  if (userIds.length > 0) {
    await scopeTest.model.roleUser.delete({ userId: userIds }, options);
  }
  await scopeTest.model.role.delete({ name: { _startsWith_: marker } }, options);
  await scopeTest.model.user.delete({ name: { _startsWith_: marker } }, options);
}

describe('modelRelationsMutationAdmission.test.ts', { concurrency: false }, () => {
  it('does not update, insert, unlink, or cascade children for a missing direct-id root', async () => {
    await app.bean.executor.mockCtx(async () => {
      const marker = `relationAdmission:${randomUUID()}:`;
      const ownedUserIds: TableIdentity[] = [];
      const scopeTest = app.scope('test-vona');
      try {
        const { users, posts, roles } = await createFixture(marker, ownedUserIds);
        const before = await readChildren(users[1].id);
        const data = {
          id: users[1].id,
          posts: [
            {
              id: posts[1].id,
              title: `${marker}forbidden-update`,
              postContent: { content: `${marker}forbidden-content` },
            },
            { title: `${marker}forbidden-insert` },
          ],
          roles: [{ id: roles[0].id, deleted: true }, { id: roles[1].id }],
        };
        await scopeTest.model.user.update(data, { include });
        assert.deepEqual(await readChildren(users[1].id), before);
        await scopeTest.model.user.mutate(data, { include });
        assert.deepEqual(await readChildren(users[1].id), before);
        await scopeTest.model.user.delete({ id: users[1].id }, { include });
        assert.deepEqual(await readChildren(users[1].id), before);
        assert.equal(await scopeTest.model.user.getById(users[1].id, uncached), undefined);
      } finally {
        await cleanup(marker, ownedUserIds);
      }
    });
  });

  it('honors rejecting root predicates and does not fan a single update out to multiple parents', async () => {
    await app.bean.executor.mockCtx(async () => {
      const marker = `relationAdmission:${randomUUID()}:`;
      const ownedUserIds: TableIdentity[] = [];
      const scopeTest = app.scope('test-vona');
      try {
        const { users, roles } = await createFixture(marker, ownedUserIds);
        const beforeFirst = await readChildren(users[0].id);
        const beforeLast = await readChildren(users[3].id);
        // Only rejection paths use an extra where: child option propagation is unchanged.
        const options = { include, where: { name: `${marker}not-a-root` } };
        const data = {
          id: users[0].id,
          posts: [{ title: `${marker}forbidden` }],
          roles: [{ id: roles[1].id }],
        };
        await scopeTest.model.user.update(data, options);
        await scopeTest.model.user.updateBulk([data], options);
        await scopeTest.model.user.mutate(data, options);
        await scopeTest.model.user.delete(
          { id: users[0].id, name: `${marker}not-a-root` },
          { include },
        );
        assert.deepEqual(await readChildren(users[0].id), beforeFirst);
        assert.equal(
          (await scopeTest.model.user.getById(users[0].id, uncached))?.name,
          users[0].name,
        );

        await scopeTest.model.user.update(
          { posts: [{ title: `${marker}no-fan-out` }] },
          { include, where: { id: [users[0].id, users[3].id] } },
        );
        assert.deepEqual(await readChildren(users[0].id), beforeFirst);
        assert.deepEqual(await readChildren(users[3].id), beforeLast);
      } finally {
        await cleanup(marker, ownedUserIds);
      }
    });
  });

  it('keeps mixed updateBulk and mutateBulk result slots aligned without touching orphan relations', async () => {
    await app.bean.executor.mockCtx(async () => {
      const marker = `relationAdmission:${randomUUID()}:`;
      const ownedUserIds: TableIdentity[] = [];
      const scopeTest = app.scope('test-vona');
      try {
        const { users, posts } = await createFixture(marker, ownedUserIds);
        const beforeMissing = await readChildren(users[1].id);
        const beforeDeleted = await readChildren(users[2].id);
        const updated = await scopeTest.model.user.updateBulk(
          users.map((user, index) => ({
            id: user.id,
            posts: [{ id: posts[index].id, title: `${marker}bulk:${index}` }],
          })),
          { include },
        );
        assert.deepEqual(
          updated.map(item => item.id),
          users.map(item => item.id),
        );
        assert.equal(updated[0].posts?.[0].id, posts[0].id);
        assert.equal(updated[3].posts?.[0].id, posts[3].id);
        assert.equal((await readChildren(users[0].id)).posts[0].title, `${marker}bulk:0`);
        assert.equal((await readChildren(users[3].id)).posts[0].title, `${marker}bulk:3`);
        assert.deepEqual(await readChildren(users[1].id), beforeMissing);
        assert.deepEqual(await readChildren(users[2].id), beforeDeleted);

        const mutated = await scopeTest.model.user.mutateBulk(
          [
            { id: users[1].id, posts: [{ title: `${marker}missing-insert` }] },
            { name: `${marker}inserted`, posts: [{ title: `${marker}inserted-post` }] },
            { id: users[3].id, posts: [{ id: posts[3].id, title: `${marker}mutate:last` }] },
            { id: users[2].id, posts: [{ title: `${marker}deleted-insert` }] },
            { id: users[0].id, posts: [{ id: posts[0].id, title: `${marker}mutate:first` }] },
          ],
          { include },
        );
        assert.equal(mutated.length, 5);
        assert.deepEqual(
          [mutated[0].id, mutated[2].id, mutated[3].id, mutated[4].id],
          [users[1].id, users[3].id, users[2].id, users[0].id],
        );
        assert.ok(mutated[1].id);
        assert.equal(mutated[1].name, `${marker}inserted`);
        assert.equal((await readChildren(mutated[1].id!)).posts[0].title, `${marker}inserted-post`);
        assert.equal(mutated[2].posts?.[0].id, posts[3].id);
        assert.equal(mutated[4].posts?.[0].id, posts[0].id);
        assert.equal((await readChildren(users[3].id)).posts[0].title, `${marker}mutate:last`);
        assert.equal((await readChildren(users[0].id)).posts[0].title, `${marker}mutate:first`);
        assert.deepEqual(await readChildren(users[1].id), beforeMissing);
        assert.deepEqual(await readChildren(users[2].id), beforeDeleted);
      } finally {
        await cleanup(marker, ownedUserIds);
      }
    });
  });

  it('cascades bulk deletes only from admitted roots and permits explicit physical deletion of deleted roots', async () => {
    await app.bean.executor.mockCtx(async () => {
      const marker = `relationAdmission:${randomUUID()}:`;
      const ownedUserIds: TableIdentity[] = [];
      const scopeTest = app.scope('test-vona');
      try {
        const { users, roles, contents } = await createFixture(marker, ownedUserIds);
        const beforeMissing = await readChildren(users[1].id);
        const beforeDeleted = await readChildren(users[2].id);
        await scopeTest.model.user.deleteBulk([users[1].id, users[0].id, users[2].id], { include });
        assert.equal(await scopeTest.model.user.getById(users[0].id, uncached), undefined);
        const firstChildren = await readChildren(users[0].id);
        assert.equal(firstChildren.posts.length, 1);
        assert.equal(firstChildren.posts[0].deleted, true);
        assert.equal(firstChildren.contents[0].deleted, true);
        assert.equal(firstChildren.roleUsers[0].deleted, true);
        assert.deepEqual(await readChildren(users[1].id), beforeMissing);
        assert.deepEqual(await readChildren(users[2].id), beforeDeleted);

        const mutated = await scopeTest.model.user.mutateBulk(
          [
            { id: users[2].id, deleted: true },
            { id: users[3].id, deleted: true },
            { id: users[1].id, deleted: true },
          ],
          { include },
        );
        assert.deepEqual(mutated, []);
        assert.equal(await scopeTest.model.user.getById(users[3].id, uncached), undefined);
        const lastChildren = await readChildren(users[3].id);
        assert.equal(lastChildren.posts[0].deleted, true);
        assert.equal(lastChildren.contents[0].deleted, true);
        assert.equal(lastChildren.roleUsers[0].deleted, true);
        assert.deepEqual(await readChildren(users[1].id), beforeMissing);
        assert.deepEqual(await readChildren(users[2].id), beforeDeleted);

        await scopeTest.model.user.delete(
          { id: users[2].id },
          { include, disableDeleted: true, ...uncached },
        );
        assert.equal(
          await scopeTest.model.user.getById(users[2].id, { disableDeleted: true, ...uncached }),
          undefined,
        );
        assert.deepEqual(await readChildren(users[2].id), {
          posts: [],
          contents: [],
          roleUsers: [],
        });
        assert.equal(
          await scopeTest.model.postContent.getById(contents[2].id, {
            disableDeleted: true,
            ...uncached,
          }),
          undefined,
        );
        assert.deepEqual(await readChildren(users[1].id), beforeMissing);
        assert.ok(await scopeTest.model.role.getById(roles[0].id, uncached));
      } finally {
        await cleanup(marker, ownedUserIds);
      }
    });
  });

  it('allows relation-only and unchanged-scalar updates, including dynamic with and disabled caches', async () => {
    await app.bean.executor.mockCtx(async () => {
      const marker = `relationAdmission:${randomUUID()}:`;
      const ownedUserIds: TableIdentity[] = [];
      const scopeTest = app.scope('test-vona');
      try {
        const { users, posts } = await createFixture(marker, ownedUserIds);
        const updated = await scopeTest.model.user.update(
          {
            id: users[0].id,
            posts: [
              {
                id: posts[0].id,
                title: `${marker}relation-only`,
                postContent: { content: `${marker}relation-only-content` },
              },
            ],
          },
          { include },
        );
        assert.equal(updated.id, users[0].id);
        assert.equal(
          (await readChildren(users[0].id)).contents[0].content,
          `${marker}relation-only-content`,
        );

        const withOptions = {
          ...uncached,
          with: {
            posts: $relationMutate.hasMany(ModelPost, 'userId', { include: { postContent: true } }),
          },
        };
        const beforeMissing = await readChildren(users[1].id);
        await scopeTest.model.user.update(
          { id: users[1].id, posts: [{ title: `${marker}forbidden-with` }] },
          withOptions,
        );
        assert.deepEqual(await readChildren(users[1].id), beforeMissing);
        const unchanged = await scopeTest.model.user.update(
          {
            id: users[0].id,
            name: users[0].name,
            posts: [
              {
                id: posts[0].id,
                title: `${marker}unchanged-scalar`,
                postContent: { content: `${marker}uncached-content` },
              },
            ],
          },
          withOptions,
        );
        assert.equal(unchanged.id, users[0].id);
        assert.equal(
          (await scopeTest.model.user.getById(users[0].id, uncached))?.name,
          users[0].name,
        );
        const children = await readChildren(users[0].id);
        assert.equal(children.posts[0].title, `${marker}unchanged-scalar`);
        assert.equal(children.contents[0].content, `${marker}uncached-content`);

        await scopeTest.model.user.delete({ id: users[0].id }, { include, ...uncached });
        assert.equal(await scopeTest.model.user.getById(users[0].id, uncached), undefined);
        assert.equal((await readChildren(users[0].id)).contents[0].deleted, true);
      } finally {
        await cleanup(marker, ownedUserIds);
      }
    });
  });

  it('applies admission to autoloaded category children without an explicit include', async () => {
    await app.bean.executor.mockCtx(async () => {
      const marker = `relationAdmission:${randomUUID()}:`;
      const scopeTest = app.scope('test-vona');
      const options = { ...uncached, disableDeleted: true, include: { children: false } } as const;
      const rootIds: TableIdentity[] = [];
      try {
        const roots = await scopeTest.model.category.insertBulk([
          { name: `${marker}live` },
          { name: `${marker}missing` },
        ]);
        rootIds.push(...roots.map(item => item.id));
        const children = await scopeTest.model.category.insertBulk(
          roots.map((root, index) => ({
            name: `${marker}child:${index}`,
            categoryIdParent: root.id,
          })),
        );
        await scopeTest.model.category.delete({ id: roots[1].id }, options);
        await scopeTest.model.category.update({
          id: roots[1].id,
          children: [{ name: `${marker}forbidden-autoload` }],
        });
        await scopeTest.model.category.delete({ id: roots[1].id });
        await scopeTest.model.category.update(
          { id: roots[0].id, children: [{ name: `${marker}rejected-autoload` }] },
          { where: { name: `${marker}not-a-root` } },
        );
        const afterRejected = await scopeTest.model.category.select(
          {
            columns: ['id', 'name', 'categoryIdParent', 'deleted'],
            where: { categoryIdParent: roots.map(item => item.id) },
            orders: [['id', 'asc']],
            include: { children: false },
          },
          options,
        );
        assert.equal(afterRejected.length, 2);
        assert.deepEqual(
          afterRejected.map(item => item.name),
          children.map(item => item.name),
        );
        assert.ok(afterRejected.every(item => item.deleted === false));

        await scopeTest.model.category.update(
          {
            id: roots[0].id,
            children: [{ id: children[0].id, name: `${marker}allowed-autoload` }],
          },
          uncached,
        );
        assert.equal(
          (await scopeTest.model.category.getById(children[0].id, options))?.name,
          `${marker}allowed-autoload`,
        );
        await scopeTest.model.category.delete({ id: roots[0].id }, uncached);
        assert.equal(
          (await scopeTest.model.category.getById(children[0].id, options))?.deleted,
          true,
        );
        assert.equal(
          (await scopeTest.model.category.getById(children[1].id, options))?.deleted,
          false,
        );
      } finally {
        if (rootIds.length > 0) {
          await scopeTest.model.category.delete({ categoryIdParent: rootIds }, options);
        }
        await scopeTest.model.category.delete({ name: { _startsWith_: marker } }, options);
      }
    });
  });
});
