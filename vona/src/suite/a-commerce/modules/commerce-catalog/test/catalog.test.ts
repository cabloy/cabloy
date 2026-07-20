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

  it('stores integer cents and exposes only sellable products to customers', async () => {
    await app.bean.executor.mockCtx(async () => {
      const active = await createCatalog('__catalog-active__', 'active');
      const draft = await createCatalog('__catalog-draft__', 'draft');
      const inactive = await createCatalog('__catalog-inactive__', 'inactive');
      const archived = await createCatalog('__catalog-archived__', 'archived');
      const unpublishedProduct = await createCatalog('__catalog-unpublished-product__', 'active');
      const unpublishedCategory = await createCatalog('__catalog-unpublished-category__', 'active');
      const zeroStock = await createCatalog('__catalog-zero-stock__', 'active');

      for (const catalog of [
        active,
        draft,
        inactive,
        archived,
        unpublishedProduct,
        unpublishedCategory,
      ]) {
        await app.scope('commerce-trade').service.stockBalance.adjustStock({
          skuId: catalog.skuId,
          delta: 2,
          reason: 'catalog public fixture',
          correlationId: `catalog-public-${catalog.skuId}`,
        });
      }
      await app.scope('commerce-catalog').model.product.updateById(unpublishedProduct.productId, {
        published: false,
      });
      await app
        .scope('commerce-catalog')
        .model.category.updateById(unpublishedCategory.categoryId, {
          published: false,
        });

      const publicProducts = await app.bean.executor.performAction(
        'get',
        '/commerce/catalog/product/public',
        { innerAccess: false },
      );
      assert.equal(
        publicProducts.list.some((product: any) => String(product.id) === String(active.productId)),
        true,
      );
      for (const catalog of [
        draft,
        inactive,
        archived,
        unpublishedProduct,
        unpublishedCategory,
        zeroStock,
      ]) {
        assert.equal(
          publicProducts.list.some(
            (product: any) => String(product.id) === String(catalog.productId),
          ),
          false,
        );
      }
      const catalogPublicProduct = publicProducts.list.find(
        (product: any) => String(product.id) === String(active.productId),
      );
      assert.deepEqual(Object.keys(catalogPublicProduct).sort(), [
        'available',
        'categoryId',
        'categoryName',
        'description',
        'id',
        'priceCents',
        'skuAvailables',
        'title',
      ]);
      assert.equal(catalogPublicProduct.priceCents, 1299);
      assert.equal(catalogPublicProduct.available, 2);
    });
  });

  it('isolates catalog data and SKU uniqueness by tenant', async () => {
    let defaultProductId: unknown;
    await app.bean.executor.mockCtx(async () => {
      const catalog = await createCatalog('__catalog-default__', 'active');
      defaultProductId = catalog.productId;

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

        await app.scope('commerce-trade').service.stockBalance.adjustStock({
          skuId: catalog.skuId,
          delta: 1,
          reason: 'catalog tenant fixture',
          correlationId: `catalog-tenant-${catalog.skuId}`,
        });
        const publicProducts = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/public',
          {
            innerAccess: false,
          },
        );
        assert.equal(
          publicProducts.list.some(
            (product: any) => String(product.id) === String(defaultProductId),
          ),
          false,
        );
        assert.equal(
          publicProducts.list.some((product: any) => product.title === '__catalog-share__ product'),
          true,
        );
      },
      { instanceName: 'shareTest' as any },
    );
  });
});
