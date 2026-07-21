import type { DtoStockAdjust, EntityStockBalance } from 'vona-module-commerce-trade';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const actionPath = '/commerce/trade/stockBalance/adjustStock';

interface IStockFixture {
  categoryId: number;
  productId: number;
  skuId: number;
}

type IStockFixturePartial = Partial<IStockFixture>;

function stockAdjust(skuId: number, delta: number, suffix: string): DtoStockAdjust {
  return {
    skuId,
    delta,
    reason: `test adjustment ${suffix}`,
    correlationId: `stock-test-${suffix}`,
  };
}

async function createSku(suffix: string): Promise<IStockFixture> {
  const fixture: IStockFixturePartial = {};
  try {
    fixture.categoryId = await app.bean.executor.performAction(
      'post',
      '/commerce/catalog/category',
      {
        body: { name: `stock-category-${suffix}`, published: true },
      },
    );
    fixture.productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
      body: { categoryId: fixture.categoryId, title: `stock-product-${suffix}`, published: true },
    });
    fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
      body: {
        productId: fixture.productId,
        code: `stock-sku-${suffix}`,
        priceCents: 100,
        lifecycle: 'active',
      },
    });
    return fixture as IStockFixture;
  } catch (error) {
    await dropStockFixture(fixture);
    throw error;
  }
}

async function dropStockFixture(fixture: IStockFixturePartial | undefined) {
  if (!fixture) return;
  const scopeTrade = app.scope('commerce-trade');
  const scopeCatalog = app.scope('commerce-catalog');
  if (fixture.skuId !== undefined) {
    await scopeTrade.model.stockAudit.delete({ skuId: fixture.skuId });
    await scopeTrade.model.stockReservation.delete({ skuId: fixture.skuId });
    await scopeTrade.model.stockBalance.delete({ skuId: fixture.skuId });
    await scopeCatalog.model.sku.delete({ id: fixture.skuId });
  }
  if (fixture.productId !== undefined) {
    await scopeCatalog.model.product.delete({ id: fixture.productId });
  }
  if (fixture.categoryId !== undefined) {
    await scopeCatalog.model.category.delete({ id: fixture.categoryId });
  }
}

async function adjustStock(stockAdjust: DtoStockAdjust): Promise<EntityStockBalance> {
  return await app.bean.executor.performAction('post', actionPath, { body: stockAdjust });
}

describe('stockBalance.test.ts', () => {
  it('action:stockBalance:adjustStock appends an audit with server-scoped balance', async () => {
    await app.bean.executor.mockCtx(async () => {
      let fixture: IStockFixture | undefined;
      await app.bean.passport.signinMock();
      try {
        fixture = await createSku(`${Date.now()}`);
        const balance = await adjustStock(
          stockAdjust(fixture.skuId, 8, `${fixture.skuId}-initial`),
        );
        assert.equal(balance.onHand, 8);
        assert.equal(balance.reserved, 0);
        assert.equal(balance.available, 8);

        const adjusted = await adjustStock(
          stockAdjust(fixture.skuId, -3, `${fixture.skuId}-decrement`),
        );
        assert.equal(adjusted.id, balance.id);
        assert.equal(adjusted.onHand, 5);
        assert.equal(adjusted.reserved, 0);
        assert.equal(adjusted.available, 5);

        const audits = await app.scope('commerce-trade').model.stockAudit.select({
          where: { skuId: fixture.skuId },
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
        await dropStockFixture(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('action:stockBalance:adjustStock rejects negative stock without an audit', async () => {
    await app.bean.executor.mockCtx(async () => {
      let fixture: IStockFixture | undefined;
      await app.bean.passport.signinMock();
      try {
        fixture = await createSku(`${Date.now()}`);
        const balance = await adjustStock(
          stockAdjust(fixture.skuId, 2, `${fixture.skuId}-initial`),
        );
        const [_, err] = await catchError(() =>
          adjustStock(stockAdjust(fixture.skuId, -3, `${fixture.skuId}-reject`)),
        );
        assert.match(err?.message ?? '', /negative/);

        const unchanged = await app.scope('commerce-trade').model.stockBalance.getById(balance.id);
        assert.equal(unchanged?.onHand, 2);
        assert.equal(unchanged?.available, 2);
        const audits = await app.scope('commerce-trade').model.stockAudit.select({
          where: { skuId: fixture.skuId },
        });
        assert.equal(audits.length, 1);
      } finally {
        await dropStockFixture(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('action:stockBalance:adjustStock rolls back the balance when audit insertion fails', async () => {
    await app.bean.executor.mockCtx(async () => {
      let fixture: IStockFixture | undefined;
      await app.bean.passport.signinMock();
      try {
        fixture = await createSku(`${Date.now()}`);
        const balance = await adjustStock(
          stockAdjust(fixture.skuId, 4, `${fixture.skuId}-initial`),
        );
        const modelStockAudit = app.scope('commerce-trade').model.stockAudit;
        const insert = modelStockAudit.insert.bind(modelStockAudit);
        (modelStockAudit as any).insert = async () => {
          throw new Error('audit insert failure');
        };
        try {
          const [_, err] = await catchError(() =>
            adjustStock(stockAdjust(fixture.skuId, 1, `${fixture.skuId}-rollback`)),
          );
          assert.match(err?.message ?? '', /audit insert failure/);
        } finally {
          (modelStockAudit as any).insert = insert;
        }

        const unchanged = await app.scope('commerce-trade').model.stockBalance.getById(balance.id);
        assert.equal(unchanged?.onHand, 4);
        assert.equal(unchanged?.available, 4);
      } finally {
        await dropStockFixture(fixture);
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
    let fixture: IStockFixture | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          fixture = await createSku(`${Date.now()}`);
          await adjustStock(stockAdjust(fixture.skuId, 5, `${fixture.skuId}-default`));
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(
        async () => {
          await app.bean.passport.signinMock();
          try {
            const [_, err] = await catchError(() =>
              adjustStock(stockAdjust(fixture!.skuId, 1, `${fixture!.skuId}-share`)),
            );
            assert.equal(err?.code, 404);
            assert.equal(
              await app.scope('commerce-trade').model.stockBalance.get({ skuId: fixture!.skuId }),
              undefined,
            );
            assert.deepEqual(
              await app.scope('commerce-trade').model.stockAudit.select({
                where: { skuId: fixture!.skuId },
              }),
              [],
            );
          } finally {
            await app.bean.passport.signout();
          }
        },
        { instanceName: 'shareTest' as any },
      );
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await dropStockFixture(fixture);
      });
    }
  });

  it('hides foreign stock balances and audits from operator read APIs', async () => {
    const suffix = `${Date.now()}`;
    let fixture: IStockFixture | undefined;
    let balanceId!: number;
    let auditId!: number;
    const reason = `stock read isolation ${suffix}`;
    const correlationId = `stock-read-isolation-${suffix}`;
    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          fixture = await createSku(suffix);
          const balance = await adjustStock({
            skuId: fixture.skuId,
            delta: 5,
            reason,
            correlationId,
          });
          balanceId = balance.id;
          const audits = await app.scope('commerce-trade').model.stockAudit.select({
            where: { skuId: fixture.skuId },
          });
          assert.equal(audits.length, 1);
          auditId = audits[0].id;
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(
        async () => {
          await app.bean.passport.signinMock();
          try {
            assert.equal(
              await app.bean.executor.performAction('get', '/commerce/trade/stockBalance/:id', {
                params: { id: balanceId },
              }),
              undefined,
            );
            const balances = await app.bean.executor.performAction(
              'get',
              '/commerce/trade/stockBalance',
            );
            assert.equal(
              balances.list.some(
                (balance: { id: unknown }) => String(balance.id) === String(balanceId),
              ),
              false,
            );
            assert.equal(
              await app.bean.executor.performAction('get', '/commerce/trade/stockAudit/:id', {
                params: { id: auditId },
              }),
              undefined,
            );
            const audits = await app.bean.executor.performAction(
              'get',
              '/commerce/trade/stockAudit',
            );
            assert.equal(
              audits.list.some((audit: { id: unknown }) => String(audit.id) === String(auditId)),
              false,
            );
          } finally {
            await app.bean.passport.signout();
          }
        },
        { instanceName: 'shareTest' as any },
      );

      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const balance = await app.bean.executor.performAction(
            'get',
            '/commerce/trade/stockBalance/:id',
            { params: { id: balanceId } },
          );
          assert.deepEqual(
            [balance.id, balance.skuId, balance.onHand, balance.reserved, balance.available],
            [balanceId, fixture!.skuId, 5, 0, 5],
          );
          const audit = await app.bean.executor.performAction(
            'get',
            '/commerce/trade/stockAudit/:id',
            { params: { id: auditId } },
          );
          assert.deepEqual(
            [
              audit.id,
              audit.stockBalanceId,
              audit.skuId,
              audit.operation,
              audit.delta,
              audit.reason,
              audit.correlationId,
              audit.onHand,
              audit.reserved,
              audit.available,
            ],
            [auditId, balanceId, fixture!.skuId, 'adjust', 5, reason, correlationId, 5, 0, 5],
          );
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await dropStockFixture(fixture);
      });
    }
  });
});
