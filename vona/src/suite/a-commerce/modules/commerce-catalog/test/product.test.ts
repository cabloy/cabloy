import type { TableIdentity } from 'table-identity';
import type {
  DtoCategoryCreate,
  DtoProductCreate,
  DtoProductSelectRes,
  DtoProductUpdate,
  EntityProduct,
} from 'vona-module-commerce-catalog';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';
import { $makeSchema, v } from 'vona-module-a-openapiutils';

interface IProductFixture {
  categoryId?: number;
  productIds: number[];
  skuIds: number[];
}

async function cleanupFixture(fixture: IProductFixture) {
  const scopeCatalog = app.scope('commerce-catalog');
  const scopeTrade = app.scope('commerce-trade');
  for (const skuId of fixture.skuIds) {
    await scopeTrade.model.stockAudit.delete({ skuId });
    await scopeTrade.model.stockReservation.delete({ skuId });
    await scopeTrade.model.stockBalance.delete({ skuId });
    await scopeCatalog.model.sku.delete({ id: skuId });
  }
  for (const productId of fixture.productIds) {
    await scopeCatalog.model.product.delete({ id: productId });
  }
  if (fixture.categoryId !== undefined) {
    await scopeCatalog.model.category.delete({ id: fixture.categoryId });
  }
}

describe('product.test.ts', { concurrency: false }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('a-commerce');
  });

  after(() => {
    releaseTestLock?.();
  });

  it('action:product', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IProductFixture = { productIds: [], skuIds: [] };
      const suffix = randomUUID().slice(0, 12);
      const categoryData: DtoCategoryCreate = {
        name: `__ProductCategory-${suffix}__`,
        published: true,
      };
      await app.bean.passport.signinMock();
      try {
        const categoryId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/category',
          {
            body: categoryData,
          },
        );
        fixture.categoryId = categoryId;
        const data: DtoProductCreate = {
          categoryId,
          title: `__Tom-${suffix}__`,
          published: false,
          description: 'This is a test',
          productContentForm: undefined,
        };
        const productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: data,
          },
        );
        fixture.productIds.push(productId);
        const dataUpdate: DtoProductUpdate = {
          categoryId,
          title: `__TomNew-${suffix}__`,
          published: true,
          description: 'This is a test',
          productContentForm: undefined,
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
        await cleanupFixture(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('keeps sellability scope outside public OR/NOT predicates and rejects projection overrides', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = randomUUID().slice(0, 12);
      const fixture: IProductFixture = { productIds: [], skuIds: [] };
      const catalog = app.scope('commerce-catalog');
      try {
        const category = await catalog.model.category.insert({
          name: `__QueryCategory-${suffix}__`,
          published: true,
        });
        fixture.categoryId = category.id as number;
        for (const [label, published, lifecycle, available] of [
          ['visible', true, 'active', 2],
          ['unpublished', false, 'active', 2],
          ['inactive', true, 'inactive', 2],
          ['empty', true, 'active', 0],
        ] as const) {
          const product = await catalog.model.product.insert({
            categoryId: category.id,
            title: `__QueryProduct-${suffix}-${label}__`,
            published,
          });
          fixture.productIds.push(product.id as number);
          const sku = await catalog.model.sku.insert({
            productId: product.id,
            code: `query-${suffix}-${label}`,
            priceCents: 100,
            lifecycle,
          });
          fixture.skuIds.push(sku.id as number);
          if (available) {
            await app.scope('commerce-trade').service.stockBalance.adjustStock({
              skuId: sku.id,
              delta: available,
              reason: 'public query regression',
              correlationId: `query-${suffix}-${label}`,
            });
          }
        }
        const publicCategoryId = $makeSchema(v.tableIdentity()).parse(category.id) as TableIdentity;
        const result = await catalog.service.product.selectPublic({
          where: {
            and: [
              { field: 'categoryId', op: 'eq', value: publicCategoryId },
              {
                or: [
                  { field: 'title', op: 'containsI', value: `__QueryProduct-${suffix}` },
                  { not: { field: 'title', op: 'containsI', value: 'not-a-fixture-product' } },
                ],
              },
            ],
          },
        });
        assert.equal(result.total, '1');
        assert.deepEqual(
          result.list.map(item => String(item.id)),
          [String(fixture.productIds[0])],
        );
        const scoped = await catalog.service.product.selectPublic({
          where: {
            and: [
              { field: 'categoryId', op: 'eq', value: publicCategoryId },
              { not: { field: 'title', op: 'containsI', value: 'not-a-fixture-product' } },
            ],
          },
        });
        assert.equal(scoped.total, '1');
        assert.deepEqual(
          scoped.list.map(item => String(item.id)),
          [String(fixture.productIds[0])],
        );
        assert.deepEqual(Object.keys(scoped.list[0]).sort(), [
          'available',
          'categoryId',
          'categoryName',
          'description',
          'id',
          'priceCents',
          'skuAvailables',
          'title',
        ]);
        assert.deepEqual(Object.keys(scoped.list[0].skuAvailables[0]).sort(), [
          'available',
          'code',
          'id',
          'priceCents',
        ]);
        for (const invalid of [
          { columns: ['id', 'published', 'iid', 'deleted'] },
          { include: { skus: true } },
          { where: { published: false } },
          { where: { field: 'published', op: 'eq', value: false } },
          { orders: [{ field: 'title', direction: 'asc' }] },
        ]) {
          await assert.rejects(
            () => catalog.service.product.selectPublic(invalid as never),
            (error: { code?: number }) => error.code === 422,
          );
        }
      } finally {
        await cleanupFixture(fixture);
      }
    });
  });

  it('loads all skus and only available skus through Product relations', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = randomUUID().slice(0, 12);
      const fixture: IProductFixture = { productIds: [], skuIds: [] };
      const scopeCatalog = app.scope('commerce-catalog');
      try {
        const category = await scopeCatalog.model.category.insert({
          name: `__ProductRelationsCategory-${suffix}__`,
          published: true,
        });
        fixture.categoryId = category.id as number;
        const product = await scopeCatalog.model.product.insert({
          categoryId: category.id,
          title: `__ProductRelations-${suffix}__`,
          published: true,
        });
        fixture.productIds.push(product.id as number);
        const productOther = await scopeCatalog.model.product.insert({
          categoryId: category.id,
          title: `__ProductRelationsOther-${suffix}__`,
          published: true,
        });
        fixture.productIds.push(productOther.id as number);
        const activeAvailable = await scopeCatalog.model.sku.insert({
          code: `__ProductRelationsActive-${suffix}__`,
          productId: product.id,
          priceCents: 100,
          lifecycle: 'active',
        });
        fixture.skuIds.push(activeAvailable.id as number);
        const activeZero = await scopeCatalog.model.sku.insert({
          code: `__ProductRelationsZero-${suffix}__`,
          productId: product.id,
          priceCents: 200,
          lifecycle: 'active',
        });
        fixture.skuIds.push(activeZero.id as number);
        const inactiveAvailable = await scopeCatalog.model.sku.insert({
          code: `__ProductRelationsInactive-${suffix}__`,
          productId: product.id,
          priceCents: 300,
          lifecycle: 'inactive',
        });
        fixture.skuIds.push(inactiveAvailable.id as number);
        const otherAvailable = await scopeCatalog.model.sku.insert({
          code: `__ProductRelationsOtherSku-${suffix}__`,
          productId: productOther.id,
          priceCents: 400,
          lifecycle: 'active',
        });
        fixture.skuIds.push(otherAvailable.id as number);
        for (const skuId of [activeAvailable.id, inactiveAvailable.id, otherAvailable.id]) {
          await app.scope('commerce-trade').service.stockBalance.adjustStock({
            skuId,
            delta: 1,
            reason: 'product relation fixture',
            correlationId: `product-relations-${suffix}-${skuId}`,
          });
        }
        const products = await scopeCatalog.model.product.select({
          where: { id: [product.id, productOther.id] },
          orders: [['id', 'asc']],
          include: { skus: true, skuAvailables: true },
        });
        const item = products.find(item => String(item.id) === String(product.id))!;
        const itemOther = products.find(item => String(item.id) === String(productOther.id))!;
        assert.deepEqual(
          item.skus.map(sku => String(sku.id)).sort(),
          [activeAvailable.id, activeZero.id, inactiveAvailable.id].map(String).sort(),
        );
        assert.deepEqual(
          item.skuAvailables.map(sku => String(sku.id)),
          [String(activeAvailable.id)],
        );
        assert.deepEqual(
          itemOther.skuAvailables.map(sku => String(sku.id)),
          [String(otherAvailable.id)],
        );
      } finally {
        await cleanupFixture(fixture);
      }
    });
  });
});
