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
      const updateRes = await app.bean.executor.performAction('patch', '/test/rest/product/:id', {
        params: { id: productId },
        body: dataUpdate,
      });
      assert.equal(updateRes, null);
      // findOne
      let product: EntityProduct = await app.bean.executor.performAction(
        'get',
        '/test/rest/product/:id',
        { params: { id: productId } },
      );
      assert.equal(product.name, dataUpdate.name);
      // delete
      const deleteRes = await app.bean.executor.performAction('delete', '/test/rest/product/:id', {
        params: { id: product.id },
      });
      assert.equal(deleteRes, null);
      // findOne
      product = await app.bean.executor.performAction('get', '/test/rest/product/:id', {
        params: { id: product.id },
      });
      assert.equal(product, undefined);
      // logout
      await app.bean.passport.signout();
    });
  });

  it('openapi:product mutations return null', async () => {
    await app.bean.executor.mockCtx(async () => {
      const controller = app.bean.onion.controller
        .getOnionsEnabledCached()
        .find(item => item.beanOptions.beanFullName === 'test-rest.controller.product')
        ?.beanOptions.beanClass;
      if (!controller) throw new Error('test-rest.controller.product not found');

      for (const action of ['update', 'delete']) {
        const doc = await app.bean.openapi.generateJsonOfControllerAction(
          controller,
          action,
          'V31',
        );
        const path = doc.paths?.['/api/test/rest/product/{id}'];
        const responseSchema = path?.[action === 'update' ? 'patch' : 'delete']?.responses?.['200']
          ?.content?.['application/json']?.schema as any;
        assert.ok(responseSchema);
        assert.deepEqual(responseSchema.required, ['code', 'message', 'data']);
        assert.equal(responseSchema.properties.data.type, 'null');
      }
    });
  });
});
