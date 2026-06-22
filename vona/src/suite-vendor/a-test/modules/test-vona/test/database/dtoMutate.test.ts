import type { TypeDecoratorRules } from 'vona-module-a-openapiutils';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $schema, getTargetDecoratorRules } from 'vona-module-a-openapiutils';
import { $Dto, $relationDynamic } from 'vona-module-a-orm';
import { ModelPost } from 'vona-module-test-vona';

describe('dtoMutate.test.ts', () => {
  it('action:dtoMutate', async () => {
    await app.bean.executor.mockCtx(async () => {
      // create
      const DtoUserCreate = $Dto.create('test-vona:user', {
        include: { posts: true },
      });
      let rules: TypeDecoratorRules;
      rules = getTargetDecoratorRules(DtoUserCreate.prototype);
      assert.equal(rules.name?.type === 'string', true);
      assert.equal(rules.id, undefined);
      assert.equal(rules.iid, undefined);
      assert.equal(rules.deleted, undefined);
      assert.equal(rules.createdAt, undefined);
      assert.equal(rules.updatedAt, undefined);
      assert.equal(rules.posts?.type === 'optional', true);
      // update
      const DtoUserUpdate = $Dto.update('test-vona:user', {
        with: {
          posts: $relationDynamic.hasMany(() => ModelPost, 'userId', { columns: ['id', 'title'] }),
        },
      });
      rules = getTargetDecoratorRules(DtoUserUpdate.prototype);
      assert.equal(rules.name?.type === 'string', true); // ZodOptional
      assert.equal(rules.id, undefined);
      assert.equal(rules.iid, undefined);
      assert.equal(rules.deleted, undefined);
      assert.equal(rules.createdAt, undefined);
      assert.equal(rules.updatedAt, undefined);
      assert.equal(rules.posts?.type === 'optional', true);
      // create: dtoClass without columns should behave like provided columns
      const DtoPostBase = $Dto.get('test-vona:post', {
        columns: ['id', 'title'],
      });
      const DtoUserCreateCustom = $Dto.create('test-vona:user', {
        include: {
          posts: {
            dtoClass: DtoPostBase,
          },
        },
      });
      const schema = $schema(DtoUserCreateCustom);
      const res = await schema.parseAsync({
        name: 'kevin',
        posts: [{ id: 1, title: 'post1' }],
      });
      assert.equal((res.posts?.[0] as any)?.id, undefined);
      assert.equal(res.posts?.[0]?.title, 'post1');
      // create: not mutate post(belongsTo)
      const DtoPostCreate = $Dto.create('test-vona:post', {
        include: {
          postContent: true,
          user: true,
        },
      });
      rules = getTargetDecoratorRules(DtoPostCreate.prototype);
      assert.equal(rules.title?.type === 'string', true); // ZodOptional
      assert.equal(rules.stars?.type === 'optional', true);
      assert.equal(rules.userId?.type === 'pipe', true);
      assert.equal(rules.postContent?.type === 'optional', true);
      assert.equal(rules.user, undefined);
      assert.equal(rules.id, undefined);
    });
  });
});
