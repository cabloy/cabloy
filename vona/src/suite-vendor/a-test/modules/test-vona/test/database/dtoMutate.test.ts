import type { TypeDecoratorRules } from 'vona-module-a-openapiutils';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { ZodMetadata } from '@cabloy/zod-openapi';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $schema, Api, getTargetDecoratorRules, v } from 'vona-module-a-openapiutils';
import { $Dto, $relationDynamic } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelPost } from 'vona-module-test-vona';

interface IDtoOptionsSchemaLikeChild extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSchemaLikeChild>()
class DtoSchemaLikeChild {
  @Api.field(v.min(3))
  name: string;
}

interface IDtoOptionsSchemaLikeParent extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSchemaLikeParent>()
class DtoSchemaLikeParent {
  @Api.field(
    v.serializerCustom((_value, data: DtoSchemaLikeParent) => {
      return data.children;
    }),
    v.title('Children'),
    v.array(DtoSchemaLikeChild),
  )
  children: DtoSchemaLikeChild[];

  @Api.field(
    v.serializerGetter((value: DtoSchemaLikeChild) => {
      return value;
    }),
    v.description('Child'),
    v.object(DtoSchemaLikeChild),
  )
  child: DtoSchemaLikeChild;
}

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

  it('action:dtoMutate:preserveOpenapiMetadataAcrossSchemaReplacement', async () => {
    await app.bean.executor.mockCtx(async () => {
      const rules = getTargetDecoratorRules(DtoSchemaLikeParent.prototype);
      const metadataChildren = ZodMetadata.getOpenapiMetadata(rules.children!);
      const metadataChild = ZodMetadata.getOpenapiMetadata(rules.child!);
      assert.equal(
        typeof metadataChildren?.serializerTransforms?.['a-serialization:custom']?.custom,
        'function',
      );
      assert.equal(metadataChildren?.title, 'Children');
      assert.equal(
        typeof metadataChild?.serializerTransforms?.['a-serialization:getter']?.getter,
        'function',
      );
      assert.equal(metadataChild?.description, 'Child');
      const schema = $schema(DtoSchemaLikeParent);
      const res = await schema.parseAsync({
        children: [{ name: 'kevin' }],
        child: { name: 'tom' },
      });
      assert.equal(res.children[0].name, 'kevin');
      assert.equal(res.child.name, 'tom');
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoSchemaLikeParent);
      const component = Object.values(apiJson.components.schemas).find(item => {
        return item.properties?.children && item.properties?.child;
      });
      assert.ok(component);
      assert.equal(component.properties.children.title, 'Children');
      assert.equal(typeof component.properties.child.$ref, 'string');
    });
  });
});
