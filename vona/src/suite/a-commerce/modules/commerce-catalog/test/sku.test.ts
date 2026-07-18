import type {
  DtoCategoryCreate,
  DtoProductCreate,
  DtoSkuCreate,
  DtoSkuSelectRes,
  DtoSkuUpdate,
  EntitySku,
} from 'vona-module-commerce-catalog';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('sku.test.ts', () => {
  it('action:sku', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const category: DtoCategoryCreate = { name: '__SkuCategory__', published: true };
        const categoryId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/category',
          {
            body: category,
          },
        );
        const product: DtoProductCreate = {
          categoryId,
          title: '__SkuProduct__',
          published: true,
        };
        const productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: product,
          },
        );
        const data: DtoSkuCreate = {
          productId,
          code: '__sku__',
          priceCents: 1999,
          lifecycle: 'draft',
        };
        const skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
          body: data,
        });
        const dataUpdate: DtoSkuUpdate = {
          productId,
          code: '__sku-new__',
          priceCents: 2999,
          lifecycle: 'active',
        };
        assert.equal(!!skuId, true);
        const selectRes: DtoSkuSelectRes = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/sku',
        );
        assert.equal(
          selectRes.list.some(item => item.code === data.code),
          true,
        );
        const updateRes = await app.bean.executor.performAction(
          'patch',
          '/commerce/catalog/sku/:id',
          {
            params: { id: skuId },
            body: dataUpdate,
          },
        );
        assert.equal(updateRes, null);
        let sku: EntitySku = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/sku/:id',
          {
            params: { id: skuId },
          },
        );
        assert.equal(sku.code, dataUpdate.code);
        assert.equal(sku.priceCents, 2999);
        assert.equal(sku.lifecycle, 'active');
        const deleteRes = await app.bean.executor.performAction(
          'delete',
          '/commerce/catalog/sku/:id',
          {
            params: { id: sku.id },
          },
        );
        assert.equal(deleteRes, null);
        sku = await app.bean.executor.performAction('get', '/commerce/catalog/sku/:id', {
          params: { id: sku.id },
        });
        assert.equal(sku, undefined);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
