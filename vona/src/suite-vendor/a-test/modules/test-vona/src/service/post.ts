import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';
import { $relationDynamic } from 'vona-module-a-orm';

import { ModelPost } from '../model/post.ts';
import { ModelPostContent } from '../model/postContent.ts';

@Service()
export class ServicePost extends BeanBase {
  async findMany(params?: IQueryParams<ModelPost>) {
    return await this.scope.model.post.selectAndCount({
      ...params,
      include: { postContent: true },
    });
  }

  async group() {
    const result = await this.scope.model.post.group({
      groups: 'userId',
      aggrs: {
        count: '*',
        sum: 'stars',
      },
      orders: [['count_all', 'desc']],
    });
    return result;
  }

  async aggregate() {
    const result = await this.scope.model.post.aggregate({
      aggrs: {
        count: ['*', 'stars'],
        sum: 'stars',
        avg: 'stars',
        min: 'stars',
        max: 'stars',
      },
    });
    return result;
  }

  async count() {
    return await this.scope.model.post.count();
  }

  async relationBelongsTo() {
    const postContent = await this.scope.model.postContent.select({
      with: {
        post: $relationDynamic.belongsTo(
          () => ModelPostContent,
          () => ModelPost,
          'postId',
          {
            columns: ['id', 'title'],
          },
        ),
      },
    });
    // eslint-disable-next-line no-console
    console.log(postContent[0]?.post?.title);
  }

  async relationHasOne() {
    // insert
    const postCreate = await this.scope.model.post.insert(
      {
        title: 'Post001',
        postContent: {
          content: 'This is a post',
        },
      },
      {
        with: {
          postContent: $relationDynamic.hasOne(() => ModelPostContent, 'postId', {
            columns: ['id', 'content'],
          }),
        },
      },
    );
    // get
    const post = await this.scope.model.post.get(
      {
        id: postCreate.id,
      },
      {
        with: {
          postContent: $relationDynamic.hasOne(() => ModelPostContent, 'postId', {
            columns: ['id', 'content'],
          }),
        },
      },
    );
    // update
    await this.scope.model.post.update(
      {
        id: postCreate.id,
        title: 'Post001-Update',
        postContent: {
          content: 'This is a post-changed',
        },
      },
      {
        with: {
          postContent: $relationDynamic.hasOne(() => ModelPostContent, 'postId', {
            columns: ['id', 'content'],
          }),
        },
      },
    );
    // delete
    await this.scope.model.post.delete(
      {
        id: postCreate.id,
      },
      {
        with: {
          postContent: $relationDynamic.hasOne(() => ModelPostContent, 'postId'),
        },
      },
    );
    // eslint-disable-next-line no-console
    console.log(post?.postContent?.id);
  }

  @Core.transaction()
  async transaction() {
    // insert
    const post = await this.scope.model.post.insert({
      title: 'Post001',
    });
    // cache
    await this.scope.cacheRedis.post.set(post, post.id);
  }

  async transactionManually() {
    const db = this.bean.database.getDb({ clientName: 'default' });
    await db.transaction.begin(async () => {
      const modelPost = this.scope.model.post.newInstance(db);
      const post = await modelPost.insert({ title: 'Post001' });
      await this.scope.cacheRedis.post.set(post, post.id, { db });
    });
  }

  async create() {
    const post = await this.scope.model.post.insert({
      title: 'Post001',
    });
    // console.log(post.id);
    return post;
  }

  async createBulk() {
    const posts = await this.scope.model.post.insertBulk([
      { title: 'Post001' },
      { title: 'Post002' },
    ]);
    // console.log(posts[0].id, posts[1].id);
    return posts;
  }

  async update() {
    const post = await this.scope.model.post.update({
      id: 1,
      title: 'Post001-Update',
    });
    return post;
  }

  async update2() {
    const post = await this.scope.model.post.update(
      {
        title: 'Post001-Update',
      },
      {
        where: {
          title: { _startsWith_: 'Post001' },
        },
      },
    );
    return post;
  }

  async updateBulk() {
    const posts = await this.scope.model.post.updateBulk([
      { id: 1, title: 'Post001-Update' },
      { id: 2, title: 'Post002-Update' },
    ]);
    return posts;
  }

  async delete() {
    await this.scope.model.post.delete({
      id: 1,
    });
  }

  async delete2() {
    await this.scope.model.post.delete({
      title: {
        _startsWith_: 'Post',
      },
    });
  }

  async deleteBulk() {
    await this.scope.model.post.deleteBulk([1, 2]);
  }

  async mutate() {
    // insert
    const post = await this.scope.model.post.mutate({
      title: 'Post001',
    });
    // update
    await this.scope.model.post.mutate({
      id: post.id,
      title: 'Post001-Update',
    });
    // delete
    await this.scope.model.post.mutate({
      id: post.id,
      deleted: true,
    });
  }

  async mutateBulk() {
    await this.scope.model.post.mutateBulk([
      // insert
      { title: 'Post003' },
      // update
      { id: 1, title: 'Post001-Update' },
      // delete
      { id: 2, deleted: true },
    ]);
  }

  async select() {
    return await this.scope.model.post.select({
      where: {
        stars: '_skip_',
      },
    });
  }

  async select2() {
    return await this.scope.model.post.select(
      {
        columns: ['id', 'title', 'userId'],
        where: {
          'id': { _gt_: 1 },
          'testVonaUser.id': 1,
        },
        joins: [['innerJoin', 'testVonaUser', ['userId', 'testVonaUser.id']]],
        offset: 0,
        limit: 20,
        orders: [['createdAt', 'desc']],
      },
      {
        disableDeleted: false,
      },
      'test-vona:user',
    );
  }

  async get(id: TableIdentity) {
    return await this.scope.model.post.getById(id);
  }

  async mget(ids: TableIdentity[]) {
    return await this.scope.model.post.mget(ids);
  }

  // async count() {
  //   return await this.scope.model.post.count();
  // }
}
