import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

async function createCatalog(
  prefix: string,
  lifecycle: 'draft' | 'active' | 'inactive' | 'archived',
) {
  await app.bean.passport.signinMock();
  try {
    const categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
      body: { name: `${prefix} category`, published: true },
    });
    const productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
      body: { categoryId, title: `${prefix} product`, published: true },
    });
    const skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
      body: { code: `${prefix}-sku`, productId, priceCents: 1299, lifecycle },
    });
    return { categoryId, productId, skuId };
  } finally {
    await app.bean.passport.signout();
  }
}

describe('catalog.test.ts', () => {
  it('enforces operator access and category/product relations', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        app.bean.passport.current!.roles = [];
        const permissions = await Promise.all([
          app.bean.permission.retrievePermissionAction('commerce-catalog:category', 'create'),
          app.bean.permission.retrievePermissionAction('commerce-catalog:product', 'create'),
          app.bean.permission.retrievePermissionAction('commerce-catalog:sku', 'create'),
        ]);
        assert.deepEqual(permissions, [false, false, false]);
      } finally {
        await app.bean.passport.signout();
      }

      await app.bean.passport.signinMock();
      try {
        await assert.rejects(() =>
          app.bean.executor.performAction('post', '/commerce/catalog/product', {
            body: { categoryId: 999999, title: 'Missing category', published: false },
          }),
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('stores integer cents and exposes only active SKUs to customers', async () => {
    await app.bean.executor.mockCtx(async () => {
      const active = await createCatalog('__catalog-active__', 'active');
      await createCatalog('__catalog-draft__', 'draft');
      await createCatalog('__catalog-inactive__', 'inactive');
      await createCatalog('__catalog-archived__', 'archived');

      const publicSkus = await app.bean.executor.performAction(
        'get',
        '/commerce/catalog/sku/active',
        {
          innerAccess: false,
        },
      );
      assert.equal(
        publicSkus.some((sku: any) => String(sku.id) === String(active.skuId)),
        true,
      );
      const catalogPublicSkus = publicSkus.filter((sku: any) => sku.code.startsWith('__catalog-'));
      assert.equal(
        catalogPublicSkus.every((sku: any) => sku.priceCents === 1299),
        true,
      );
      assert.equal(
        catalogPublicSkus.every((sku: any) => sku.lifecycle === undefined),
        true,
      );
    });
  });

  it('isolates catalog data and SKU uniqueness by tenant', async () => {
    let defaultSkuId: unknown;
    await app.bean.executor.mockCtx(async () => {
      const catalog = await createCatalog('__catalog-default__', 'active');
      defaultSkuId = catalog.skuId;

      await app.bean.passport.signinMock();
      try {
        await assert.rejects(() =>
          app.bean.executor.performAction('post', '/commerce/catalog/sku', {
            body: {
              code: '__catalog-default__-sku',
              productId: catalog.productId,
              priceCents: 2000,
              lifecycle: 'draft',
            },
          }),
        );
      } finally {
        await app.bean.passport.signout();
      }
    });

    await app.bean.executor.mockCtx(
      async () => {
        const catalog = await createCatalog('__catalog-share__', 'active');
        await app.bean.passport.signinMock();
        try {
          const duplicateCodeSkuId = await app.bean.executor.performAction(
            'post',
            '/commerce/catalog/sku',
            {
              body: {
                code: '__catalog-default__-sku',
                productId: catalog.productId,
                priceCents: 2500,
                lifecycle: 'active',
              },
            },
          );
          assert.equal(!!duplicateCodeSkuId, true);
        } finally {
          await app.bean.passport.signout();
        }

        const publicSkus = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/sku/active',
          {
            innerAccess: false,
          },
        );
        assert.equal(
          publicSkus.some((sku: any) => String(sku.id) === String(defaultSkuId)),
          false,
        );
        assert.equal(
          publicSkus.some((sku: any) => sku.code === '__catalog-share__-sku'),
          true,
        );
      },
      { instanceName: 'shareTest' as any },
    );
  });
});
