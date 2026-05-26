import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('orm.test.ts', () => {
  it('action:orm:hasOne', async () => {
    await app.bean.executor.mockCtx(async () => {
      // scope
      const scopeTest = app.scope('test-vona');
      // create: post/postContent
      const post1 = await scopeTest.model.post.insert({
        title: 'action:orm:hasOne:post1',
      });
      const postContent1 = await scopeTest.model.postContent.insert({
        content: 'action:orm:hasOne:content',
        postId: post1.id,
      });
      // delete
      await scopeTest.model.post.delete({ id: post1.id });
      await scopeTest.model.postContent.delete({ id: postContent1.id });
    });
  });
});
