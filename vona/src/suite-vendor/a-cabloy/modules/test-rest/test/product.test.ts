import type {
  DtoProductCreate,
  DtoProductSelectRes,
  DtoProductUpdate,
  EntityProduct,
} from 'vona-module-test-rest';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('product.test.ts', () => {
  it('action:product', async () => {
    await app.bean.executor.mockCtx(async () => {
      // data
      const data: DtoProductCreate = {
        name: '__Tom__',
        description: 'This is a test',
        price: 0,
        quantity: 0,
        amount: 0,
      };
      const dataUpdate: DtoProductUpdate = {
        ...data,
        name: '__TomNew__',
      };
      // login
      await app.bean.passport.signinMock();
      // create
      const productId = await app.bean.executor.performAction('post', '/test/rest/product', {
        body: data,
      });
      assert.equal(!!productId, true);
      // findMany
      const queryRes: DtoProductSelectRes = await app.bean.executor.performAction(
        'get',
        '/test/rest/product',
      );
      assert.equal(queryRes.list.findIndex(item => item.name === data.name) > -1, true);
      // update
      await app.bean.executor.performAction('patch', '/test/rest/product/:id', {
        params: { id: productId },
        body: dataUpdate,
      });
      // findOne
      let product: EntityProduct = await app.bean.executor.performAction(
        'get',
        '/test/rest/product/:id',
        { params: { id: productId } },
      );
      assert.equal(product.name, dataUpdate.name);
      // delete
      await app.bean.executor.performAction('delete', '/test/rest/product/:id', {
        params: { id: product.id },
      });
      // findOne
      product = await app.bean.executor.performAction('get', '/test/rest/product/:id', {
        params: { id: product.id },
      });
      assert.equal(product, undefined);
      // logout
      await app.bean.passport.signout();
    });
  });
});
