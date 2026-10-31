import type { TypeDecoratorRules } from 'vona-module-a-openapiutils';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { $Class } from 'vona';
import { app } from 'vona-mock';
import {
  $makeMetadata,
  $schema,
  Api,
  getTargetDecoratorRules,
  v,
} from 'vona-module-a-openapiutils';
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

  it('action:dtoMutate:reuseOwnedRelationsUnderParentOperation', async () => {
    await app.bean.executor.mockCtx(async () => {
      class DtoReference {
        @Api.field(v.tableIdentity())
        id: number | string;
      }
      class DtoContentMutate extends $Dto.mutate('test-vona:postContent', {
        columns: ['id', 'deleted', 'postId', 'content'],
      }) {
        @Api.field(v.object(DtoReference))
        reference: DtoReference;
      }
      const postOptions = {
        columns: ['id', 'deleted', 'title'] as ['id', 'deleted', 'title'],
        include: {
          postContent: { dtoClass: DtoContentMutate, columns: ['content'] as ['content'] },
        },
      };
      class DtoPostMutate extends $Dto.mutate('test-vona:post', postOptions) {
        @Api.field(v.title('Curated content'), v.description('Nested content metadata'))
        declare postContent: DtoContentMutate | undefined;
      }
      class DtoUserMutate extends $Dto.mutate('test-vona:user', {
        columns: ['name'],
        include: { posts: { dtoClass: DtoPostMutate }, roles: true },
      }) {}
      const input = {
        name: 'kevin',
        posts: [
          {
            id: 10,
            deleted: false,
            title: 'post1',
            postContent: {
              id: 20,
              deleted: false,
              postId: 10,
              content: 'content1',
              reference: { id: 30 },
            },
          },
        ],
        roles: [{ id: 40 }],
      };
      const DtoCreate = $Dto.create('test-vona:user', { dtoClass: DtoUserMutate });
      const created = await $schema(DtoCreate).parseAsync(input);
      assert.deepEqual(created, {
        name: 'kevin',
        posts: [
          {
            title: 'post1',
            postContent: { content: 'content1', reference: { id: 30 } },
          },
        ],
        roles: [{ id: 40 }],
      });
      for (const DtoParent of [
        $Dto.update('test-vona:user', { dtoClass: DtoUserMutate }),
        $Dto.mutate('test-vona:user', { dtoClass: DtoUserMutate }),
      ]) {
        const updated = await $schema(DtoParent).parseAsync(input);
        assert.equal(updated.posts?.[0]?.id, 10);
        assert.equal(updated.posts?.[0]?.postContent?.id, 20);
        assert.equal(updated.posts?.[0]?.postContent?.deleted, false);
        assert.equal((updated.posts?.[0]?.postContent as any)?.postId, undefined);
        await $schema(DtoParent).parseAsync({
          name: 'kevin',
          posts: [
            {
              title: 'new post',
              postContent: {
                content: 'new content',
                reference: { id: 30 },
              },
            },
          ],
        });
      }
      // Rebuilding a parent must not mutate the reusable mutation DTO.
      const original = await $schema(DtoUserMutate).parseAsync(input);
      assert.equal(original.posts?.[0]?.postContent?.id, 20);
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoCreate);
      // Anonymous DTOs may be emitted inline rather than as separate components.
      const emitted = JSON.stringify(apiJson);
      assert.ok(emitted.includes('"title":"Curated content"'));
      assert.ok(emitted.includes('"description":"Nested content metadata"'));

      // A caller-selected projection replaces the retained one, not intersects with it.
      const DtoOverride = $Dto.create('test-vona:user', {
        dtoClass: DtoUserMutate,
        include: {
          posts: {
            columns: ['title'],
            include: {
              postContent: { columns: ['content'] },
            },
          },
        },
      });
      const overridden = await $schema(DtoOverride).parseAsync(input);
      assert.deepEqual(overridden.posts, [
        { title: 'post1', postContent: { content: 'content1' } },
      ]);
      const DtoPicked = $Class.pick(DtoUserMutate, ['name']);
      const picked = await $schema(
        $Dto.create('test-vona:user', { dtoClass: DtoPicked }),
      ).parseAsync(input);
      assert.deepEqual(picked, { name: 'kevin' });
      // A fresh false selection keeps its existing hidden optional field, without replaying it.
      const disabled = await $schema(
        $Dto.create('test-vona:user', {
          dtoClass: DtoUserMutate,
          include: { posts: false },
        }),
      ).parseAsync(input);
      assert.equal(disabled.posts?.[0]?.id, 10);
    });
  });

  it('action:dtoMutate:preserveOpenapiMetadataAcrossSchemaReplacement', async () => {
    await app.bean.executor.mockCtx(async () => {
      const rules = getTargetDecoratorRules(DtoSchemaLikeParent.prototype);
      assert.ok(rules.children);
      assert.ok(rules.child);
      const metadataChildren = $makeMetadata(rules.children);
      const metadataChild = $makeMetadata(rules.child);
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
      assert.ok(apiJson.components?.schemas);
      const component = Object.values(apiJson.components.schemas).find(item => {
        return !('$ref' in item) && item.properties?.children && item.properties?.child;
      });
      assert.ok(component && !('$ref' in component));
      assert.ok(component.properties?.children);
      const children = component.properties.children;
      assert.ok(!('$ref' in children));
      assert.equal(children.title, 'Children');
      assert.ok(component.properties.child && '$ref' in component.properties.child);
      assert.equal(typeof component.properties.child.$ref, 'string');
    });
  });
});
