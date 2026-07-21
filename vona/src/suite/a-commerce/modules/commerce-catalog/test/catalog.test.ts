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
      const publicProduct = await app.bean.executor.performAction(
        'get',
        '/commerce/catalog/product/public/:id',
        { params: { id: active.productId }, innerAccess: false },
      );
      assert.equal(String(publicProduct.id), String(active.productId));
      for (const catalog of [
        draft,
        inactive,
        archived,
        unpublishedProduct,
        unpublishedCategory,
        zeroStock,
      ]) {
        const publicProduct = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/public/:id',
          { params: { id: catalog.productId }, innerAccess: false },
        );
        assert.equal(publicProduct, undefined);
      }
    });
  });

  it('paginates and aggregates public Products without duplicate roots', async () => {
    await app.bean.executor.mockCtx(async () => {
      const first = await createCatalog('__catalog-page-first__', 'active');
      const second = await createCatalog('__catalog-page-second__', 'active');
      const scopeCatalog = app.scope('commerce-catalog');
      const additionalSku = await scopeCatalog.model.sku.insert({
        code: '__catalog-page-first-additional-sku__',
        productId: first.productId,
        priceCents: 999,
        lifecycle: 'active',
      });
      const inactiveSku = await scopeCatalog.model.sku.insert({
        code: '__catalog-page-first-inactive-sku__',
        productId: first.productId,
        priceCents: 100,
        lifecycle: 'inactive',
      });
      for (const [skuId, delta] of [
        [first.skuId, 2],
        [additionalSku.id, 3],
        [inactiveSku.id, 4],
        [second.skuId, 1],
      ] as const) {
        await app.scope('commerce-trade').service.stockBalance.adjustStock({
          skuId,
          delta,
          reason: 'catalog pagination fixture',
          correlationId: `catalog-pagination-${skuId}`,
        });
      }
      const query = { title: '__catalog-page-', pageSize: 1 };
      const pageOne = await app.bean.executor.performAction(
        'get',
        '/commerce/catalog/product/public',
        {
          query: { ...query, pageNo: 1 },
          innerAccess: false,
        },
      );
      const pageTwo = await app.bean.executor.performAction(
        'get',
        '/commerce/catalog/product/public',
        {
          query: { ...query, pageNo: 2 },
          innerAccess: false,
        },
      );
      assert.equal(pageOne.total, '2');
      assert.equal(pageOne.pageCount, 2);
      assert.equal(pageOne.pageSize, 1);
      assert.equal(pageOne.pageNo, 1);
      assert.equal(pageTwo.total, '2');
      assert.equal(pageTwo.pageNo, 2);
      assert.notEqual(String(pageOne.list[0].id), String(pageTwo.list[0].id));
      const firstPublicProduct = [pageOne, pageTwo]
        .flatMap(page => page.list)
        .find(product => String(product.id) === String(first.productId));
      assert.equal(firstPublicProduct.priceCents, 999);
      assert.equal(firstPublicProduct.available, 5);
      assert.deepEqual(
        firstPublicProduct.skuAvailables.map(sku => String(sku.id)).sort(),
        [first.skuId, additionalSku.id].map(String).sort(),
      );
      const categoryProducts = await app.bean.executor.performAction(
        'get',
        '/commerce/catalog/product/public',
        {
          query: { categoryId: first.categoryId },
          innerAccess: false,
        },
      );
      assert.equal(categoryProducts.total, '1');
      assert.equal(String(categoryProducts.list[0].id), String(first.productId));
    });
  });

  it('refreshes public eligibility after Category, SKU, and stock changes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const catalog = await createCatalog('__catalog-cache__', 'active');
      const query = { title: '__catalog-cache__' };
      const selectPublic = async () => {
        return await app.bean.executor.performAction('get', '/commerce/catalog/product/public', {
          query,
          innerAccess: false,
        });
      };
      await app.scope('commerce-trade').service.stockBalance.adjustStock({
        skuId: catalog.skuId,
        delta: 1,
        reason: 'catalog cache fixture',
        correlationId: `catalog-cache-add-${catalog.skuId}`,
      });
      assert.equal((await selectPublic()).total, '1');
      await app.scope('commerce-trade').service.stockBalance.adjustStock({
        skuId: catalog.skuId,
        delta: -1,
        reason: 'catalog cache fixture',
        correlationId: `catalog-cache-remove-${catalog.skuId}`,
      });
      assert.equal((await selectPublic()).total, '0');
      await app.scope('commerce-trade').service.stockBalance.adjustStock({
        skuId: catalog.skuId,
        delta: 1,
        reason: 'catalog cache fixture',
        correlationId: `catalog-cache-restore-${catalog.skuId}`,
      });
      assert.equal((await selectPublic()).total, '1');
      await app.scope('commerce-catalog').model.sku.updateById(catalog.skuId, {
        lifecycle: 'inactive',
      });
      assert.equal((await selectPublic()).total, '0');
      await app.scope('commerce-catalog').model.sku.updateById(catalog.skuId, {
        lifecycle: 'active',
      });
      assert.equal((await selectPublic()).total, '1');
      await app.scope('commerce-catalog').model.category.updateById(catalog.categoryId, {
        published: false,
      });
      assert.equal((await selectPublic()).total, '0');
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
        const foreignProduct = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/public/:id',
          { params: { id: defaultProductId }, innerAccess: false },
        );
        assert.equal(foreignProduct, undefined);
        const publicProduct = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/public/:id',
          { params: { id: catalog.productId }, innerAccess: false },
        );
        assert.equal(String(publicProduct.id), String(catalog.productId));
      },
      { instanceName: 'shareTest' as any },
    );
  });

  it('treats foreign operator catalogue resources as absent', async () => {
    const prefix = `__catalog-foreign-${Date.now()}__`;
    let defaultCatalog!: Awaited<ReturnType<typeof createCatalog>>;
    await app.bean.executor.mockCtx(async () => {
      defaultCatalog = await createCatalog(prefix, 'active');
    });

    await app.bean.executor.mockCtx(
      async () => {
        await app.bean.passport.signinMock();
        try {
          const resources = [
            ['category', defaultCatalog.categoryId, { name: 'foreign category', published: false }],
            [
              'product',
              defaultCatalog.productId,
              {
                categoryId: defaultCatalog.categoryId,
                title: 'foreign product',
                published: false,
              },
            ],
            [
              'sku',
              defaultCatalog.skuId,
              {
                productId: defaultCatalog.productId,
                code: 'foreign-sku',
                priceCents: 100,
                lifecycle: 'inactive',
              },
            ],
          ] as const;
          for (const [resource, id, body] of resources) {
            assert.equal(
              await app.bean.executor.performAction('get', `/commerce/catalog/${resource}/:id`, {
                params: { id },
              }),
              undefined,
            );
            const selected = await app.bean.executor.performAction(
              'get',
              `/commerce/catalog/${resource}`,
            );
            assert.equal(
              selected.list.some((item: { id: unknown }) => String(item.id) === String(id)),
              false,
            );
            const update = () =>
              app.bean.executor.performAction('patch', `/commerce/catalog/${resource}/:id`, {
                params: { id },
                body,
              });
            if (resource === 'category') {
              assert.equal(await update(), null);
            } else {
              await assert.rejects(update);
            }
            assert.equal(
              await app.bean.executor.performAction('delete', `/commerce/catalog/${resource}/:id`, {
                params: { id },
              }),
              null,
            );
          }
        } finally {
          await app.bean.passport.signout();
        }
      },
      { instanceName: 'shareTest' as any },
    );

    await app.bean.executor.mockCtx(async () => {
      const category = await app
        .scope('commerce-catalog')
        .model.category.getById(defaultCatalog.categoryId);
      const product = await app
        .scope('commerce-catalog')
        .model.product.getById(defaultCatalog.productId);
      const sku = await app.scope('commerce-catalog').model.sku.getById(defaultCatalog.skuId);
      assert.equal(category?.name, `${prefix} category`);
      assert.equal(product?.title, `${prefix} product`);
      assert.equal(sku?.code, `${prefix}-sku`);
    });
  });
});
