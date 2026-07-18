import type {
  DtoCategoryCreate,
  DtoCategorySelectRes,
  DtoCategoryUpdate,
  EntityCategory,
} from 'vona-module-commerce-catalog';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('category.test.ts', () => {
  it('action:category', async () => {
    await app.bean.executor.mockCtx(async () => {
      // data
      const data: DtoCategoryCreate = {
        name: '__Tom__',
        published: false,
        description: 'This is a test',
      };
      const dataUpdate: DtoCategoryUpdate = {
        name: '__TomNew__',
        published: true,
        description: 'This is a test',
      };
      // role-less authenticated users cannot access generated admin actions
      await app.bean.passport.signinMock();
      try {
        app.bean.passport.current!.roles = [];
        const actions = ['create', 'select', 'view', 'update', 'delete'];
        const permissions = await Promise.all(
          actions.map(action =>
            app.bean.permission.retrievePermissionAction('commerce-catalog:category', action),
          ),
        );
        assert.deepEqual(
          permissions,
          actions.map(() => false),
        );
      } finally {
        await app.bean.passport.signout();
      }
      // login as system admin
      await app.bean.passport.signinMock();
      // create
      const categoryId = await app.bean.executor.performAction(
        'post',
        '/commerce/catalog/category',
        { body: data },
      );
      assert.equal(!!categoryId, true);
      // findMany
      const selectRes: DtoCategorySelectRes = await app.bean.executor.performAction(
        'get',
        '/commerce/catalog/category',
      );
      assert.equal(selectRes.list.findIndex(item => item.name === data.name) > -1, true);
      // update
      const updateRes = await app.bean.executor.performAction(
        'patch',
        '/commerce/catalog/category/:id',
        {
          params: { id: categoryId },
          body: dataUpdate,
        },
      );
      assert.equal(updateRes, null);
      // findOne
      let category: EntityCategory = await app.bean.executor.performAction(
        'get',
        '/commerce/catalog/category/:id',
        { params: { id: categoryId } },
      );
      assert.equal(category.name, dataUpdate.name);
      // delete
      const deleteRes = await app.bean.executor.performAction(
        'delete',
        '/commerce/catalog/category/:id',
        { params: { id: category.id } },
      );
      assert.equal(deleteRes, null);
      // findOne
      category = await app.bean.executor.performAction('get', '/commerce/catalog/category/:id', {
        params: { id: category.id },
      });
      assert.equal(category, undefined);
      // logout
      await app.bean.passport.signout();
    });
  });
});
