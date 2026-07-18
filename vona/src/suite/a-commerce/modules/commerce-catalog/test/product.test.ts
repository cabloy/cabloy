import type {
  DtoCategoryCreate,
  DtoProductCreate,
  DtoProductSelectRes,
  DtoProductUpdate,
  EntityProduct,
} from 'vona-module-commerce-catalog';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('product.test.ts', () => {
  it('action:product', async () => {
    await app.bean.executor.mockCtx(async () => {
      const categoryData: DtoCategoryCreate = { name: '__ProductCategory__', published: true };
      await app.bean.passport.signinMock();
      try {
        const categoryId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/category',
          {
            body: categoryData,
          },
        );
        const data: DtoProductCreate = {
          categoryId,
          title: '__Tom__',
          published: false,
          description: 'This is a test',
        };
        const productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: data,
          },
        );
        const dataUpdate: DtoProductUpdate = {
          categoryId,
          title: '__TomNew__',
          published: true,
          description: 'This is a test',
        };
        assert.equal(!!productId, true);
        const selectRes: DtoProductSelectRes = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product',
        );
        assert.equal(
          selectRes.list.some(item => item.title === data.title),
          true,
        );
        const updateRes = await app.bean.executor.performAction(
          'patch',
          '/commerce/catalog/product/:id',
          { params: { id: productId }, body: dataUpdate },
        );
        assert.equal(updateRes, null);
        let product: EntityProduct = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/:id',
          { params: { id: productId } },
        );
        assert.equal(product.title, dataUpdate.title);
        assert.equal(product.published, true);
        const deleteRes = await app.bean.executor.performAction(
          'delete',
          '/commerce/catalog/product/:id',
          { params: { id: product.id } },
        );
        assert.equal(deleteRes, null);
        product = await app.bean.executor.performAction('get', '/commerce/catalog/product/:id', {
          params: { id: product.id },
        });
        assert.equal(product, undefined);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
