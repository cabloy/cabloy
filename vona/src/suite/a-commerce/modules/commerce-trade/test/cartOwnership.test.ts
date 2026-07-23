import type { DtoCartAddItem, DtoCartUpdateItem } from 'vona-module-commerce-trade';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { app } from 'vona-mock';

import { acquireTestLock } from './testLock.ts';

const actionPath = '/commerce/trade/cart';

interface ISellableSkuFixture {
  categoryId: number;
  productId: number;
  skuId: number;
}

function createTestId() {
  return randomUUID().slice(0, 12);
}

function cartItem(skuId: number, quantity = 1): DtoCartAddItem {
  return { skuId, quantity };
}

async function performAs(accessToken: string, method: string, path: string, options = {}) {
  return await app.bean.executor.newCtxIsolate(async () => {
    return await app.bean.executor.performAction(method, path, {
      ...options,
      authToken: accessToken,
      innerAccess: false,
    });
  });
}

async function registerAndSignin(name: string) {
  const user = await app.bean.user.register({ name }, true);
  const token = await app.bean.passport.signinMock(name as any);
  return { token: token.accessToken, user };
}

async function createSellableSku(suffix: string): Promise<ISellableSkuFixture> {
  await app.bean.passport.signinMock();
  try {
    const categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
      body: { name: `cart-category-${suffix}`, published: true },
    });
    const productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
      body: { categoryId, title: `cart-product-${suffix}`, published: true },
    });
    const skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
      body: {
        productId,
        code: `cart-sku-${suffix}`,
        priceCents: 100,
        lifecycle: 'active',
      },
    });
    await app.bean.executor.performAction('post', '/commerce/trade/stockBalance/adjustStock', {
      body: {
        skuId,
        delta: 10,
        reason: `cart stock ${suffix}`,
        correlationId: `cart-stock-${suffix}`,
      },
    });
    return { categoryId, productId, skuId };
  } finally {
    await app.bean.passport.signout();
  }
}

async function dropSellableSku(fixture: ISellableSkuFixture | undefined) {
  if (!fixture) return;
  const trade = app.scope('commerce-trade');
  const catalog = app.scope('commerce-catalog');
  await trade.model.stockAudit.delete({ skuId: fixture.skuId });
  await trade.model.stockReservation.delete({ skuId: fixture.skuId });
  await trade.model.stockBalance.delete({ skuId: fixture.skuId });
  await catalog.model.sku.delete({ id: fixture.skuId });
  await catalog.model.product.delete({ id: fixture.productId });
  await catalog.model.category.delete({ id: fixture.categoryId });
}

async function dropUser(userId: number | undefined) {
  if (userId === undefined) return;
  const trade = app.scope('commerce-trade');
  const carts = await trade.model.cart.select({ where: { userId } });
  for (const cart of carts) {
    await trade.model.cartItem.delete({ cartId: cart.id });
    await trade.model.cart.delete({ id: cart.id });
  }
  await app.scope('home-user').model.roleUser.delete({ userId });
  await app.bean.user.removeById(userId);
}

describe('cartOwnership.test.ts', { concurrency: false }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock();
  });

  after(() => {
    releaseTestLock?.();
  });

  it('denies anonymous cart actions', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const [method, path, options] of [
        ['get', actionPath, {}],
        ['post', `${actionPath}/items`, { body: cartItem(1) }],
        ['patch', `${actionPath}/items/:id`, { params: { id: 999999 }, body: { quantity: 1 } }],
        ['delete', `${actionPath}/items/:id`, { params: { id: 999999 } }],
        ['delete', `${actionPath}/items`, {}],
      ] as const) {
        const [_, err] = await catchError(() =>
          app.bean.executor.performAction(method, path, { ...options, innerAccess: false }),
        );
        assert.equal(err?.code, 401);
      }
    });
  });

  it('derives cart ownership from the authenticated customer and scopes every item action', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = createTestId();
      let sku: ISellableSkuFixture | undefined;
      let customerA: Awaited<ReturnType<typeof registerAndSignin>> | undefined;
      let customerB: Awaited<ReturnType<typeof registerAndSignin>> | undefined;
      try {
        sku = await createSellableSku(suffix);
        customerA = await registerAndSignin(`cart-a-${suffix}`);
        customerB = await registerAndSignin(`cart-b-${suffix}`);

        const cart = await performAs(customerA.token, 'post', `${actionPath}/items`, {
          body: { ...cartItem(sku.skuId, 2), userId: customerB.user.id, iid: 999999 } as any,
        });
        assert.equal(cart.items.length, 1);
        assert.equal(cart.items[0].quantity, 2);
        assert.equal(Object.hasOwn(cart, 'userId'), false);
        assert.equal(Object.hasOwn(cart, 'iid'), false);
        const itemId = cart.items[0].id;

        const persistedCart = await app.scope('commerce-trade').model.cart.getById(cart.id);
        assert.equal(String(persistedCart?.userId), String(customerA.user.id));
        assert.equal(persistedCart?.iid, app.ctx.instance.id);
        const persistedItem = await app.scope('commerce-trade').model.cartItem.getById(itemId);
        assert.equal(String(persistedItem?.cartId), String(cart.id));

        const updated = await performAs(customerA.token, 'patch', `${actionPath}/items/:id`, {
          params: { id: itemId },
          body: { quantity: 3 } satisfies DtoCartUpdateItem,
        });
        assert.equal(updated.items[0].quantity, 3);

        assert.deepEqual(await performAs(customerB.token, 'get', actionPath), { items: [] });
        assert.deepEqual(
          await performAs(customerB.token, 'patch', `${actionPath}/items/:id`, {
            params: { id: itemId },
            body: { quantity: 1 },
          }),
          { items: [] },
        );
        assert.deepEqual(
          await performAs(customerB.token, 'delete', `${actionPath}/items/:id`, {
            params: { id: itemId },
          }),
          { items: [] },
        );
        assert.equal(
          (await app.scope('commerce-trade').model.cartItem.getById(itemId))?.quantity,
          3,
        );

        const merged = await performAs(customerA.token, 'post', `${actionPath}/items`, {
          body: cartItem(sku.skuId, 2),
        });
        assert.equal(merged.items.length, 1);
        assert.equal(merged.items[0].quantity, 5);

        const cleared = await performAs(customerA.token, 'delete', `${actionPath}/items`);
        assert.deepEqual(cleared.items, []);
      } finally {
        await app.bean.passport.signout();
        await dropUser(customerB?.user.id as number | undefined);
        await dropUser(customerA?.user.id as number | undefined);
        await dropSellableSku(sku);
      }
    });
  });

  it('treats another instance cart as absent', async () => {
    const suffix = createTestId();
    let itemId!: number;
    let customerDefault: Awaited<ReturnType<typeof registerAndSignin>> | undefined;
    let customerShare: Awaited<ReturnType<typeof registerAndSignin>> | undefined;
    let sku: ISellableSkuFixture | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        sku = await createSellableSku(suffix);
        customerDefault = await registerAndSignin(`cart-default-${suffix}`);
        const cart = await performAs(customerDefault.token, 'post', `${actionPath}/items`, {
          body: cartItem(sku.skuId),
        });
        itemId = cart.items[0].id;
      });

      await app.bean.executor.mockCtx(
        async () => {
          try {
            customerShare = await registerAndSignin(`cart-share-${suffix}`);
            assert.deepEqual(await performAs(customerShare.token, 'get', actionPath), {
              items: [],
            });
            assert.deepEqual(
              await performAs(customerShare.token, 'patch', `${actionPath}/items/:id`, {
                params: { id: itemId },
                body: { quantity: 2 },
              }),
              { items: [] },
            );
            assert.deepEqual(
              await performAs(customerShare.token, 'delete', `${actionPath}/items/:id`, {
                params: { id: itemId },
              }),
              { items: [] },
            );
          } finally {
            await app.bean.passport.signout();
          }
        },
        { instanceName: 'shareTest' as any },
      );

      await app.bean.executor.mockCtx(async () => {
        try {
          const cart = await performAs(customerDefault!.token, 'get', actionPath);
          assert.equal(cart.items.length, 1);
          assert.equal(cart.items[0].id, itemId);
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(
        async () => {
          await dropUser(customerShare?.user.id as number | undefined);
        },
        { instanceName: 'shareTest' as any },
      );
      await app.bean.executor.mockCtx(async () => {
        await dropUser(customerDefault?.user.id as number | undefined);
        await dropSellableSku(sku);
      });
    }
  });
});
