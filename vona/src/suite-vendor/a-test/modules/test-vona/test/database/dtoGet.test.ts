import type { TypeDecoratorRules } from 'vona-module-a-openapiutils';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { getTargetDecoratorRules } from 'vona-module-a-openapiutils';
import { $Dto, $relationDynamic } from 'vona-module-a-orm';
import {
  ModelPost,
  ModelPostContent,
  ModelRole,
  ModelRoleUser,
  ModelUser,
} from 'vona-module-test-vona';

describe('dtoGet.test.ts', () => {
  it('action:dtoGet', async () => {
    await app.bean.executor.mockCtx(async () => {
      const DtoPostNew = $Dto.get(ModelPost, {
        columns: ['id', 'title', 'userId'],
        include: {
          postContent: {
            columns: ['id', 'content'],
            include: {
              post: { include: { user: { columns: ['id'] } } },
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
                () => ModelRoleUser,
                () => ModelRole,
                'userId',
                'roleId',
              ),
            },
            columns: ['id', 'name'],
          }),
        },
      });
      const rules: TypeDecoratorRules = getTargetDecoratorRules(DtoPostNew.prototype);
      assert.equal(rules.id?.type === 'pipe', true);
      assert.equal(rules.title?.type === 'string', true);
      assert.equal(rules.userId?.type === 'pipe', true);
      assert.equal(rules.iid, undefined);
      assert.equal(rules.postContent?.type === 'optional', true);
      assert.equal(rules.user?.type === 'optional', true);
      assert.equal(rules.user3?.type === 'optional', true);
    });
  });
  it('action:dtoGet:categoryTree', async () => {
    await app.bean.executor.mockCtx(async () => {
      const DtoCategoryTree = $Dto.get('test-vona:category', {
        columns: ['id', 'name'],
        include: { children: { columns: ['id'] } },
      });
      const rules: TypeDecoratorRules = getTargetDecoratorRules(DtoCategoryTree.prototype);
      assert.equal(rules.children?.type === 'pipe', true);
      assert.equal(rules.iid, undefined);
      const DtoCategoryChain = $Dto.get('test-vona:categoryChain', {
        columns: ['id', 'name', 'categoryIdParent'],
      });
      const _apiJson = await app.bean.openapi.generateJsonOfClass(DtoCategoryChain);
      // console.log(JSON.stringify(apiJson.components));
    });
  });
});
