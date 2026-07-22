import type { DtoCartAddItem, DtoCartUpdateItem } from 'vona-module-commerce-trade';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const actionPath = '/commerce/trade/cart';

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
  await app.bean.user.register({ name }, true);
  const token = await app.bean.passport.signinMock(name as any);
  return { token: token.accessToken, user: app.bean.passport.currentUser! };
}

async function createSellableSku(suffix: string) {
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
    return skuId;
  } finally {
    await app.bean.passport.signout();
  }
}

describe('cartOwnership.test.ts', () => {
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
      const skuId = await createSellableSku(suffix);
      const customerA = await registerAndSignin(`cart-a-${suffix}`);
      const customerB = await registerAndSignin(`cart-b-${suffix}`);

      const cart = await performAs(customerA.token, 'post', `${actionPath}/items`, {
        body: { ...cartItem(skuId, 2), userId: customerB.user.id, iid: 999999 } as any,
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
      assert.equal((await app.scope('commerce-trade').model.cartItem.getById(itemId))?.quantity, 3);

      const merged = await performAs(customerA.token, 'post', `${actionPath}/items`, {
        body: cartItem(skuId, 2),
      });
      assert.equal(merged.items.length, 1);
      assert.equal(merged.items[0].quantity, 5);

      const cleared = await performAs(customerA.token, 'delete', `${actionPath}/items`);
      assert.deepEqual(cleared.items, []);
    });
  });

  it('treats another instance cart as absent', async () => {
    let itemId!: number;
    let customerDefault!: Awaited<ReturnType<typeof registerAndSignin>>;
    await app.bean.executor.mockCtx(async () => {
      const suffix = createTestId();
      const skuId = await createSellableSku(suffix);
      customerDefault = await registerAndSignin(`cart-default-${suffix}`);
      const cart = await performAs(customerDefault.token, 'post', `${actionPath}/items`, {
        body: cartItem(skuId),
      });
      itemId = cart.items[0].id;
    });

    await app.bean.executor.mockCtx(
      async () => {
        const customer = await registerAndSignin(`cart-share-${Date.now()}`);
        assert.deepEqual(await performAs(customer.token, 'get', actionPath), { items: [] });
        assert.deepEqual(
          await performAs(customer.token, 'patch', `${actionPath}/items/:id`, {
            params: { id: itemId },
            body: { quantity: 2 },
          }),
          { items: [] },
        );
        assert.deepEqual(
          await performAs(customer.token, 'delete', `${actionPath}/items/:id`, {
            params: { id: itemId },
          }),
          { items: [] },
        );
      },
      { instanceName: 'shareTest' as any },
    );

    await app.bean.executor.mockCtx(async () => {
      const cart = await performAs(customerDefault.token, 'get', actionPath);
      assert.equal(cart.items.length, 1);
      assert.equal(cart.items[0].id, itemId);
    });
  });
});
