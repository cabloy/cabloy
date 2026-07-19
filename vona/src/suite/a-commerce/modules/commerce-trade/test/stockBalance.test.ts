import type { DtoStockAdjust, EntityStockBalance } from 'vona-module-commerce-trade';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const actionPath = '/commerce/trade/stockBalance/adjustStock';

function stockAdjust(skuId: number, delta: number, suffix: string): DtoStockAdjust {
  return {
    skuId,
    delta,
    reason: `test adjustment ${suffix}`,
    correlationId: `stock-test-${suffix}`,
  };
}

async function createSku(suffix: string): Promise<number> {
  const categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
    body: { name: `stock-category-${suffix}`, published: true },
  });
  const productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
    body: { categoryId, title: `stock-product-${suffix}`, published: true },
  });
  return await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
    body: {
      productId,
      code: `stock-sku-${suffix}`,
      priceCents: 100,
      lifecycle: 'active',
    },
  });
}

async function adjustStock(stockAdjust: DtoStockAdjust): Promise<EntityStockBalance> {
  return await app.bean.executor.performAction('post', actionPath, { body: stockAdjust });
}

describe('stockBalance.test.ts', () => {
  it('action:stockBalance:adjustStock appends an audit with server-scoped balance', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const skuId = await createSku(`${Date.now()}`);
        const balance = await adjustStock(stockAdjust(skuId, 8, `${skuId}-initial`));
        assert.equal(balance.onHand, 8);
        assert.equal(balance.reserved, 0);
        assert.equal(balance.available, 8);

        const adjusted = await adjustStock(stockAdjust(skuId, -3, `${skuId}-decrement`));
        assert.equal(adjusted.id, balance.id);
        assert.equal(adjusted.onHand, 5);
        assert.equal(adjusted.reserved, 0);
        assert.equal(adjusted.available, 5);

        const audits = await app.scope('commerce-trade').model.stockAudit.select({
          where: { skuId },
        });
        assert.equal(audits.length, 2);
        assert.deepEqual(
          audits.map(item => [item.delta, item.onHand, item.reserved, item.available]),
          [
            [8, 8, 0, 8],
            [-3, 5, 0, 5],
          ],
        );
        assert.equal(audits[1].stockBalanceId, balance.id);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:stockBalance:adjustStock rejects negative stock without an audit', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const skuId = await createSku(`${Date.now()}`);
        const balance = await adjustStock(stockAdjust(skuId, 2, `${skuId}-initial`));
        const [_, err] = await catchError(() =>
          adjustStock(stockAdjust(skuId, -3, `${skuId}-reject`)),
        );
        assert.match(err?.message ?? '', /negative/);

        const unchanged = await app.scope('commerce-trade').model.stockBalance.getById(balance.id);
        assert.equal(unchanged?.onHand, 2);
        assert.equal(unchanged?.available, 2);
        const audits = await app.scope('commerce-trade').model.stockAudit.select({
          where: { skuId },
        });
        assert.equal(audits.length, 1);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:stockBalance:adjustStock rolls back the balance when audit insertion fails', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const skuId = await createSku(`${Date.now()}`);
        const balance = await adjustStock(stockAdjust(skuId, 4, `${skuId}-initial`));
        const modelStockAudit = app.scope('commerce-trade').model.stockAudit;
        const insert = modelStockAudit.insert.bind(modelStockAudit);
        (modelStockAudit as any).insert = async () => {
          throw new Error('audit insert failure');
        };
        try {
          const [_, err] = await catchError(() =>
            adjustStock(stockAdjust(skuId, 1, `${skuId}-rollback`)),
          );
          assert.match(err?.message ?? '', /audit insert failure/);
        } finally {
          (modelStockAudit as any).insert = insert;
        }

        const unchanged = await app.scope('commerce-trade').model.stockBalance.getById(balance.id);
        assert.equal(unchanged?.onHand, 4);
        assert.equal(unchanged?.available, 4);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:stockBalance:adjustStock treats a missing SKU as not found', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const skuId = 999999999;
        const [_, err] = await catchError(() =>
          adjustStock(stockAdjust(skuId, 1, `${skuId}-missing`)),
        );
        assert.equal(err?.code, 404);
        assert.equal(
          await app.scope('commerce-trade').model.stockBalance.get({ skuId }),
          undefined,
        );
        assert.deepEqual(
          await app.scope('commerce-trade').model.stockAudit.select({ where: { skuId } }),
          [],
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:stockBalance:adjustStock treats a cross-instance SKU as not found', async () => {
    let skuId!: number;
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        skuId = await createSku(`${Date.now()}`);
        await adjustStock(stockAdjust(skuId, 5, `${skuId}-default`));
      } finally {
        await app.bean.passport.signout();
      }
    });

    await app.bean.executor.mockCtx(
      async () => {
        await app.bean.passport.signinMock();
        try {
          const [_, err] = await catchError(() =>
            adjustStock(stockAdjust(skuId, 1, `${skuId}-share`)),
          );
          assert.equal(err?.code, 404);
          assert.equal(
            await app.scope('commerce-trade').model.stockBalance.get({ skuId }),
            undefined,
          );
          assert.deepEqual(
            await app.scope('commerce-trade').model.stockAudit.select({ where: { skuId } }),
            [],
          );
        } finally {
          await app.bean.passport.signout();
        }
      },
      { instanceName: 'shareTest' as any },
    );
  });
});
