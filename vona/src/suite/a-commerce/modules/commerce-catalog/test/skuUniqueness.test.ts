import type { TableIdentity } from 'table-identity';

import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

interface ISkuFixture {
  categoryId?: TableIdentity;
  productIds: TableIdentity[];
  codes: string[];
}

async function runInContext<T>(operation: () => Promise<T>): Promise<T> {
  return await app.bean.executor.mockCtx(operation);
}

async function createFixture(fixture: ISkuFixture, suffix: string, products = 1) {
  await runInContext(async () => {
    const catalog = app.scope('commerce-catalog');
    const category = await catalog.model.category.insert({
      name: `sku-unique-category-${suffix}`,
      published: false,
    });
    fixture.categoryId = category.id;
    for (let index = 0; index < products; index++) {
      const product = await catalog.model.product.insert({
        categoryId: category.id,
        title: `sku-unique-product-${suffix}-${index}`,
        published: false,
      });
      fixture.productIds.push(product.id);
    }
  });
}

async function cleanupFixture(fixture: ISkuFixture) {
  await runInContext(async () => {
    const catalog = app.scope('commerce-catalog');
    for (const productId of fixture.productIds) {
      for (const code of fixture.codes) {
        const skus = await catalog.model.sku.select(
          { where: { productId, code } },
          { disableDeleted: true },
        );
        for (const sku of skus) {
          await catalog.model.sku.delete({ id: sku.id }, { disableDeleted: true });
        }
      }
      await catalog.model.product.delete({ id: productId }, { disableDeleted: true });
    }
    if (fixture.categoryId !== undefined) {
      await catalog.model.category.delete({ id: fixture.categoryId }, { disableDeleted: true });
    }
  });
}

function assertOneBusinessConflict(results: PromiseSettledResult<unknown>[]) {
  assert.equal(
    results.filter(result => result.status === 'fulfilled').length,
    1,
    JSON.stringify(results),
  );
  const rejected = results.filter(result => result.status === 'rejected');
  assert.equal(rejected.length, 1, JSON.stringify(results));
  assert.equal((rejected[0] as PromiseRejectedResult).reason?.code, 409);
}

describe('skuUniqueness.test.ts', { concurrency: false }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('a-commerce');
  });

  after(() => {
    releaseTestLock?.();
  });

  it('keeps exactly one SKU after competing same-tenant creates across products', async () => {
    const fixture: ISkuFixture = { productIds: [], codes: [] };
    const suffix = randomUUID().slice(0, 12);
    const code = `sku-unique-create-${suffix}`;
    fixture.codes.push(code);
    try {
      await createFixture(fixture, suffix, 2);
      const results = await Promise.allSettled(
        fixture.productIds.map(productId =>
          runInContext(() =>
            app.scope('commerce-catalog').service.sku.create({
              productId,
              code,
              priceCents: 100,
              lifecycle: 'draft',
            }),
          ),
        ),
      );
      assertOneBusinessConflict(results);
      await runInContext(async () => {
        const skus = await app.scope('commerce-catalog').model.sku.select({ where: { code } });
        assert.equal(skus.length, 1);
        assert.ok(
          fixture.productIds.some(productId => String(productId) === String(skus[0]!.productId)),
        );
      });
    } finally {
      await cleanupFixture(fixture);
    }
  });

  it('keeps exactly one target code after competing updates', async () => {
    const fixture: ISkuFixture = { productIds: [], codes: [] };
    const suffix = randomUUID().slice(0, 12);
    const targetCode = `sku-unique-update-${suffix}`;
    const sourceCodes = [0, 1].map(index => `sku-unique-source-${suffix}-${index}`);
    fixture.codes.push(targetCode, ...sourceCodes);
    try {
      await createFixture(fixture, suffix, 2);
      const sourceIds = await runInContext(async () => {
        const catalog = app.scope('commerce-catalog');
        const skus = [];
        for (let index = 0; index < 2; index++) {
          skus.push(
            await catalog.service.sku.create({
              productId: fixture.productIds[index]!,
              code: sourceCodes[index]!,
              priceCents: 100,
              lifecycle: 'draft',
            }),
          );
        }
        return skus.map(sku => sku.id);
      });
      const results = await Promise.allSettled(
        sourceIds.map((skuId, index) =>
          runInContext(() =>
            app.scope('commerce-catalog').service.sku.update(skuId, {
              productId: fixture.productIds[index]!,
              code: targetCode,
              priceCents: 200,
              lifecycle: 'draft',
            }),
          ),
        ),
      );
      assertOneBusinessConflict(results);
      await runInContext(async () => {
        const catalog = app.scope('commerce-catalog');
        const targetSkus = await catalog.model.sku.select({ where: { code: targetCode } });
        assert.equal(targetSkus.length, 1);
        const allSkus = await catalog.model.sku.select({ where: { id: sourceIds } });
        assert.equal(allSkus.length, 2);
        assert.equal(allSkus.filter(sku => sourceCodes.includes(sku.code!)).length, 1);
        assert.equal(allSkus.find(sku => sku.code === targetCode)?.priceCents, 200);
      });
    } finally {
      await cleanupFixture(fixture);
    }
  });
});
