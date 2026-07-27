import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

interface IFixture {
  categoryId?: number;
  productId?: number;
  skuId?: number;
  balanceId?: number;
  cartId?: number;
  cartItemId?: number;
  addressId?: number;
  orderId?: number;
  orderLineId?: number;
  paymentAttemptId?: number;
  orderAuditId?: number;
  reservationId?: number;
  stockAuditIds?: number[];
  couponTemplateId?: number;
  couponGrantId?: number;
  userId?: number;
}

async function cleanup(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  const payment = app.scope('commerce-payment');
  const promotion = app.scope('commerce-promotion');
  const member = app.scope('commerce-member');
  const catalog = app.scope('commerce-catalog');
  if (fixture.paymentAttemptId !== undefined)
    await payment.model.paymentAttempt.delete({ id: fixture.paymentAttemptId });
  if (fixture.orderAuditId !== undefined)
    await trade.model.orderAudit.delete({ id: fixture.orderAuditId });
  if (fixture.skuId !== undefined) await trade.model.stockAudit.delete({ skuId: fixture.skuId });
  if (fixture.reservationId !== undefined)
    await trade.model.stockReservation.delete({ id: fixture.reservationId });
  if (fixture.orderLineId !== undefined)
    await trade.model.orderLine.delete({ id: fixture.orderLineId });
  if (fixture.orderId !== undefined) await trade.model.order.delete({ id: fixture.orderId });
  if (fixture.cartItemId !== undefined)
    await trade.model.cartItem.delete({ id: fixture.cartItemId });
  if (fixture.cartId !== undefined) await trade.model.cart.delete({ id: fixture.cartId });
  if (fixture.balanceId !== undefined)
    await trade.model.stockBalance.delete({ id: fixture.balanceId });
  if (fixture.skuId !== undefined) await catalog.model.sku.delete({ id: fixture.skuId });
  if (fixture.productId !== undefined)
    await catalog.model.product.delete({ id: fixture.productId });
  if (fixture.categoryId !== undefined)
    await catalog.model.category.delete({ id: fixture.categoryId });
  if (fixture.addressId !== undefined) await member.model.address.delete({ id: fixture.addressId });
  if (fixture.couponGrantId !== undefined) {
    await promotion.model.couponAudit.delete({ couponGrantId: fixture.couponGrantId });
    await promotion.model.couponGrant.delete({ id: fixture.couponGrantId });
  }
  if (fixture.couponTemplateId !== undefined)
    await promotion.model.couponTemplate.delete({ id: fixture.couponTemplateId });
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

describe('checkoutReservation.test.ts', { concurrency: false }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('a-commerce');
  });

  after(() => {
    releaseTestLock?.();
  });

  it('denies anonymous checkout and persists the authenticated action result', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      const suffix = randomUUID().slice(0, 12);
      const customerName = `checkout-action-${suffix}`;
      try {
        const [_, anonymousError] = await catchError(() =>
          app.bean.executor.performAction('post', '/commerce/trade/checkout', {
            body: { addressId: 1, correlationId: `checkout-anonymous-${suffix}` },
            innerAccess: false,
          }),
        );
        assert.equal(anonymousError?.code, 401);

        await app.bean.passport.signinMock();
        fixture.categoryId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/category',
          { body: { name: `checkout-action-category-${suffix}`, published: true } },
        );
        fixture.productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: {
              categoryId: fixture.categoryId,
              title: `checkout-action-product-${suffix}`,
              published: true,
            },
          },
        );
        fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
          body: {
            productId: fixture.productId,
            code: `checkout-action-sku-${suffix}`,
            priceCents: 1299,
            attributes: [],
            lifecycle: 'active',
          },
        });
        fixture.balanceId = (
          await app.scope('commerce-trade').service.stockBalance.adjustStock({
            skuId: fixture.skuId,
            delta: 1,
            reason: 'checkout action fixture',
            correlationId: `checkout-action-stock-${suffix}`,
          })
        ).id as number;
        await app.bean.passport.signout();

        await app.bean.user.register({ name: customerName }, true);
        const token = await app.bean.passport.signinMock(customerName as any);
        fixture.userId = app.bean.passport.currentUser!.id as number;
        fixture.addressId = await app.bean.executor.performAction(
          'post',
          '/commerce/member/address/createMine',
          {
            body: {
              recipientName: 'Checkout Action Customer',
              phone: '15555550131',
              countryCode: 'US',
              region: 'California',
              city: 'San Francisco',
              postalCode: '94105',
              addressLine1: '4 Market Street',
            },
          },
        );
        const cart = await app
          .scope('commerce-trade')
          .model.cart.insert({ userId: fixture.userId });
        fixture.cartId = cart.id as number;
        fixture.cartItemId = (
          await app.scope('commerce-trade').model.cartItem.insert({
            cartId: cart.id,
            skuId: fixture.skuId,
            quantity: 1,
          })
        ).id as number;

        const correlationId = `checkout-action-${suffix}`;
        const result = await app.bean.executor.newCtxIsolate(async () => {
          return await app.bean.executor.performAction('post', '/commerce/trade/checkout', {
            authToken: token.accessToken,
            innerAccess: false,
            body: { addressId: fixture.addressId, correlationId },
          });
        });
        fixture.orderId = result.orderId as number;
        fixture.paymentAttemptId = result.paymentAttemptId as number;
        assert.deepEqual(
          {
            state: result.state,
            paymentAttemptState: result.paymentAttemptState,
            currency: result.currency,
            payableTotalCents: result.payableTotalCents,
          },
          {
            state: 'awaiting_payment',
            paymentAttemptState: 'created',
            currency: 'USD',
            payableTotalCents: 1299,
          },
        );
        const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId);
        const paymentAttempt = await app
          .scope('commerce-payment')
          .model.paymentAttempt.getById(fixture.paymentAttemptId);
        const line = await app.scope('commerce-trade').model.orderLine.get({
          orderId: fixture.orderId,
        });
        fixture.orderLineId = line?.id as number;
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: line?.id,
        });
        fixture.reservationId = reservation?.id as number;
        const audit = await app.scope('commerce-trade').model.orderAudit.get({
          orderId: fixture.orderId,
        });
        fixture.orderAuditId = audit?.id as number;
        assert.equal(order?.state, result.state);
        assert.equal(order?.payableTotalCents, result.payableTotalCents);
        assert.equal(paymentAttempt?.orderId, result.orderId);
        assert.equal(paymentAttempt?.state, result.paymentAttemptState);
        assert.equal(paymentAttempt?.amountCents, result.payableTotalCents);
        assert.equal(reservation?.state, 'reserved');
        assert.equal(audit?.operation, 'created');
        assert.equal(
          await app.scope('commerce-trade').model.cartItem.getById(fixture.cartItemId),
          undefined,
        );
      } finally {
        await app.bean.passport.signout();
        await cleanup(fixture);
      }
    });
  });

  it('rejects foreign address and coupon grant IDs without checkout partial writes', async () => {
    const suffix = randomUUID().slice(0, 12);
    const local: IFixture = {};
    const foreign: IFixture = {};
    const customerName = `checkout-local-${suffix}`;
    let accessToken!: string;
    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          local.categoryId = await app.bean.executor.performAction(
            'post',
            '/commerce/catalog/category',
            { body: { name: `checkout-foreign-category-${suffix}`, published: true } },
          );
          local.productId = await app.bean.executor.performAction(
            'post',
            '/commerce/catalog/product',
            {
              body: {
                categoryId: local.categoryId,
                title: `checkout-foreign-product-${suffix}`,
                published: true,
              },
            },
          );
          local.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
            body: {
              productId: local.productId,
              code: `checkout-foreign-sku-${suffix}`,
              priceCents: 1299,
              attributes: [],
              lifecycle: 'active',
            },
          });
          local.balanceId = (
            await app.scope('commerce-trade').service.stockBalance.adjustStock({
              skuId: local.skuId,
              delta: 1,
              reason: 'checkout foreign fixture',
              correlationId: `checkout-foreign-stock-${suffix}`,
            })
          ).id as number;
        } finally {
          await app.bean.passport.signout();
        }

        await app.bean.user.register({ name: customerName }, true);
        const token = await app.bean.passport.signinMock(customerName as any);
        accessToken = token.accessToken;
        local.userId = app.bean.passport.currentUser!.id as number;
        local.addressId = await app.bean.executor.performAction(
          'post',
          '/commerce/member/address/createMine',
          {
            body: {
              recipientName: 'Local Checkout Customer',
              phone: '15555550132',
              countryCode: 'US',
              region: 'California',
              city: 'San Francisco',
              postalCode: '94105',
              addressLine1: '5 Market Street',
            },
          },
        );
        const cart = await app.scope('commerce-trade').model.cart.insert({ userId: local.userId });
        local.cartId = cart.id as number;
        local.cartItemId = (
          await app.scope('commerce-trade').model.cartItem.insert({
            cartId: cart.id,
            skuId: local.skuId,
            quantity: 1,
          })
        ).id as number;
      });

      await app.bean.executor.mockCtx(
        async () => {
          const foreignName = `checkout-foreign-${suffix}`;
          await app.bean.user.register({ name: foreignName }, true);
          await app.bean.passport.signinMock(foreignName as any);
          try {
            foreign.userId = app.bean.passport.currentUser!.id as number;
            foreign.addressId = await app.bean.executor.performAction(
              'post',
              '/commerce/member/address/createMine',
              {
                body: {
                  recipientName: 'Foreign Checkout Customer',
                  phone: '15555550133',
                  countryCode: 'US',
                  region: 'California',
                  city: 'Oakland',
                  postalCode: '94607',
                  addressLine1: '6 Broadway',
                },
              },
            );
            foreign.couponTemplateId = (
              await app.scope('commerce-promotion').model.couponTemplate.insert({
                name: `checkout-foreign-coupon-${suffix}`,
                state: 'active',
                currency: 'USD',
                discountCents: 500,
                minSpendCents: 1000,
                validFrom: new Date(Date.now() - 1_000),
                validUntil: new Date(Date.now() + 60_000),
                issuedCount: 0,
                redeemedCount: 0,
              })
            ).id as number;
            foreign.couponGrantId = (
              await app.scope('commerce-promotion').service.coupon.issue({
                templateId: foreign.couponTemplateId,
                userId: foreign.userId,
                correlationId: `checkout-foreign-coupon-${suffix}`,
                reason: 'checkout foreign fixture',
              })
            ).id as number;
          } finally {
            await app.bean.passport.signout();
          }
        },
        { instanceName: 'shareTest' as any },
      );

      await app.bean.executor.mockCtx(async () => {
        const assertNoPartialWrites = async (correlationId: string) => {
          assert.equal(
            await app.scope('commerce-trade').model.order.get({ correlationId }),
            undefined,
          );
          assert.equal(
            await app.scope('commerce-trade').model.stockReservation.get({ skuId: local.skuId }),
            undefined,
          );
          assert.equal(
            (await app.scope('commerce-trade').model.cartItem.getById(local.cartItemId))?.quantity,
            1,
          );
          const balance = await app
            .scope('commerce-trade')
            .model.stockBalance.getById(local.balanceId!);
          assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [1, 0, 1]);
          assert.equal(
            await app
              .scope('commerce-payment')
              .model.paymentAttempt.get({ correlationId: `${correlationId}:payment` }),
            undefined,
          );
        };
        for (const [label, body] of [
          [
            'address',
            { addressId: foreign.addressId!, correlationId: `checkout-foreign-address-${suffix}` },
          ],
          [
            'coupon',
            {
              addressId: local.addressId!,
              couponGrantId: foreign.couponGrantId!,
              correlationId: `checkout-foreign-coupon-${suffix}`,
            },
          ],
        ] as const) {
          const [_, error] = await catchError(() =>
            app.bean.executor.newCtxIsolate(async () => {
              return await app.bean.executor.performAction('post', '/commerce/trade/checkout', {
                authToken: accessToken,
                innerAccess: false,
                body,
              });
            }),
          );
          assert.equal(error?.code, 404, `${label}: ${String(error)}`);
          await assertNoPartialWrites(body.correlationId);
        }
      });
    } finally {
      await app.bean.executor.mockCtx(
        async () => {
          await cleanup(foreign);
        },
        { instanceName: 'shareTest' as any },
      );
      await app.bean.executor.mockCtx(async () => {
        await cleanup(local);
      });
    }
  });

  it('keeps checkout snapshots and payment amount after source facts change', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      const suffix = randomUUID().slice(0, 12);
      const customerName = `checkout-snapshot-${suffix}`;
      try {
        await app.bean.passport.signinMock();
        fixture.categoryId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/category',
          { body: { name: `checkout-snapshot-category-${suffix}`, published: true } },
        );
        fixture.productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: {
              categoryId: fixture.categoryId,
              title: `checkout-snapshot-product-${suffix}`,
              published: true,
            },
          },
        );
        fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
          body: {
            productId: fixture.productId,
            code: `checkout-snapshot-sku-${suffix}`,
            priceCents: 1299,
            attributes: [{ name: 'Color', value: 'Black' }],
            lifecycle: 'active',
          },
        });
        fixture.balanceId = (
          await app.scope('commerce-trade').service.stockBalance.adjustStock({
            skuId: fixture.skuId,
            delta: 1,
            reason: 'checkout snapshot fixture',
            correlationId: `checkout-snapshot-stock-${suffix}`,
          })
        ).id as number;
        await app.bean.passport.signout();

        await app.bean.user.register({ name: customerName }, true);
        const token = await app.bean.passport.signinMock(customerName as any);
        fixture.userId = app.bean.passport.currentUser!.id as number;
        fixture.couponTemplateId = (
          await app.scope('commerce-promotion').model.couponTemplate.insert({
            name: `checkout-snapshot-coupon-${suffix}`,
            state: 'active',
            currency: 'USD',
            discountCents: 500,
            minSpendCents: 1000,
            validFrom: new Date(Date.now() - 1_000),
            validUntil: new Date(Date.now() + 60_000),
            issuedCount: 0,
            redeemedCount: 0,
          })
        ).id as number;
        fixture.couponGrantId = (
          await app.scope('commerce-promotion').service.coupon.issue({
            templateId: fixture.couponTemplateId,
            userId: fixture.userId,
            correlationId: `checkout-snapshot-coupon-${suffix}`,
            reason: 'checkout snapshot fixture',
          })
        ).id as number;
        fixture.addressId = await app.bean.executor.performAction(
          'post',
          '/commerce/member/address/createMine',
          {
            body: {
              recipientName: 'Checkout Snapshot Customer',
              phone: '15555550134',
              countryCode: 'US',
              region: 'California',
              city: 'San Francisco',
              postalCode: '94105',
              addressLine1: '7 Market Street',
            },
          },
        );
        const cart = await app
          .scope('commerce-trade')
          .model.cart.insert({ userId: fixture.userId });
        fixture.cartId = cart.id as number;
        fixture.cartItemId = (
          await app.scope('commerce-trade').model.cartItem.insert({
            cartId: cart.id,
            skuId: fixture.skuId,
            quantity: 1,
          })
        ).id as number;

        const result = await app.bean.executor.newCtxIsolate(async () => {
          return await app.bean.executor.performAction('post', '/commerce/trade/checkout', {
            authToken: token.accessToken,
            innerAccess: false,
            body: {
              addressId: fixture.addressId,
              couponGrantId: fixture.couponGrantId,
              correlationId: `checkout-snapshot-${suffix}`,
            },
          });
        });
        fixture.orderId = result.orderId as number;
        fixture.paymentAttemptId = result.paymentAttemptId as number;
        const line = await app.scope('commerce-trade').model.orderLine.get({
          orderId: fixture.orderId,
        });
        fixture.orderLineId = line?.id as number;
        fixture.reservationId = (
          await app.scope('commerce-trade').model.stockReservation.get({ orderLineId: line?.id })
        )?.id as number;
        fixture.orderAuditId = (
          await app.scope('commerce-trade').model.orderAudit.get({ orderId: fixture.orderId })
        )?.id as number;
        assert.equal(result.payableTotalCents, 799);

        await app.scope('commerce-catalog').model.product.updateById(fixture.productId, {
          title: 'Changed checkout product',
          published: false,
        });
        await app.scope('commerce-catalog').model.sku.updateById(fixture.skuId, {
          code: 'changed-checkout-sku',
          priceCents: 9999,
          attributes: [{ name: 'Color', value: 'Blue' }],
          lifecycle: 'inactive',
        });
        await app.scope('commerce-member').model.address.updateById(fixture.addressId, {
          city: 'Oakland',
          addressLine1: 'Changed checkout address',
        });
        await app
          .scope('commerce-promotion')
          .model.couponTemplate.updateById(fixture.couponTemplateId, {
            name: 'Changed checkout coupon',
            discountCents: 1,
            minSpendCents: 0,
            state: 'disabled',
          });

        const snapshot = await app
          .scope('commerce-trade')
          .service.order.viewSnapshot(fixture.orderId);
        const paymentAttempt = await app
          .scope('commerce-payment')
          .model.paymentAttempt.getById(fixture.paymentAttemptId);
        assert.equal(snapshot?.order.addressSnapshot.city, 'San Francisco');
        assert.equal(snapshot?.order.addressSnapshot.addressLine1, '7 Market Street');
        assert.equal(
          snapshot?.order.couponSnapshot?.templateName,
          `checkout-snapshot-coupon-${suffix}`,
        );
        assert.equal(snapshot?.order.couponSnapshot?.fixedDiscountCents, 500);
        assert.equal(snapshot?.order.discountCents, 500);
        assert.equal(snapshot?.order.payableTotalCents, 799);
        assert.equal(snapshot?.lines[0].skuCodeSnapshot, `checkout-snapshot-sku-${suffix}`);
        assert.equal(snapshot?.lines[0].titleSnapshot, `checkout-snapshot-product-${suffix}`);
        assert.deepEqual(snapshot?.lines[0].skuAttributesSnapshot, [
          { name: 'Color', value: 'Black' },
        ]);
        assert.equal(snapshot?.lines[0].unitPriceCents, 1299);
        assert.equal(snapshot?.lines[0].lineTotalCents, 1299);
        assert.equal(paymentAttempt?.amountCents, 799);
        assert.equal(paymentAttempt?.currency, 'USD');
      } finally {
        await app.bean.passport.signout();
        await cleanup(fixture);
      }
    });
  });

  it('creates an atomic checkout from the persisted cart and replays its correlation', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      const suffix = randomUUID().slice(0, 12);
      try {
        await app.bean.passport.signinMock();
        const userId = app.bean.passport.currentUser!.id;
        fixture.categoryId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/category',
          {
            body: { name: `checkout-category-${suffix}`, published: true },
          },
        );
        fixture.productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: {
              categoryId: fixture.categoryId,
              title: `checkout-product-${suffix}`,
              published: true,
            },
          },
        );
        fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
          body: {
            productId: fixture.productId,
            code: `checkout-sku-${suffix}`,
            priceCents: 1299,
            attributes: [],
            lifecycle: 'active',
          },
        });
        const balance = await app.scope('commerce-trade').service.stockBalance.adjustStock({
          skuId: fixture.skuId,
          delta: 1,
          reason: 'checkout fixture',
          correlationId: `checkout-stock-${suffix}`,
        });
        fixture.balanceId = balance.id as number;
        const auditsBefore = await app.scope('commerce-trade').model.stockAudit.select({
          where: { skuId: fixture.skuId },
        });
        fixture.stockAuditIds = auditsBefore.map(item => item.id as number);
        fixture.addressId = await app.bean.executor.performAction(
          'post',
          '/commerce/member/address/createMine',
          {
            body: {
              recipientName: 'Checkout Customer',
              phone: '15555550123',
              countryCode: 'US',
              region: 'California',
              city: 'San Francisco',
              postalCode: '94105',
              addressLine1: '1 Market Street',
            },
          },
        );
        const cart = await app.scope('commerce-trade').model.cart.insert({ userId });
        fixture.cartId = cart.id as number;
        const cartItem = await app.scope('commerce-trade').model.cartItem.insert({
          cartId: cart.id,
          skuId: fixture.skuId,
          quantity: 1,
        });
        fixture.cartItemId = cartItem.id as number;

        const result = await app.scope('commerce-trade').service.order.checkout({
          addressId: fixture.addressId,
          correlationId: `checkout-${suffix}`,
        });
        fixture.orderId = result.orderId as number;
        fixture.paymentAttemptId = result.paymentAttemptId as number;
        assert.equal(result.state, 'awaiting_payment');
        assert.equal(result.payableTotalCents, 1299);
        assert.equal(
          await app.scope('commerce-trade').model.cartItem.getById(cartItem.id),
          undefined,
        );
        const line = await app
          .scope('commerce-trade')
          .model.orderLine.get({ orderId: result.orderId });
        fixture.orderLineId = line?.id as number;
        const reservation = await app
          .scope('commerce-trade')
          .model.stockReservation.get({ orderLineId: line?.id });
        fixture.reservationId = reservation?.id as number;
        assert.equal(reservation?.state, 'reserved');
        const audit = await app
          .scope('commerce-trade')
          .model.orderAudit.get({ orderId: result.orderId });
        fixture.orderAuditId = audit?.id as number;
        assert.equal(audit?.operation, 'created');
        const replay = await app.scope('commerce-trade').service.order.checkout({
          addressId: fixture.addressId,
          correlationId: `checkout-${suffix}`,
        });
        assert.equal(replay.orderId, result.orderId);
        assert.equal(replay.paymentAttemptId, result.paymentAttemptId);
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('allows exactly one independently authenticated customer to checkout the final unit', async t => {
    if (process.env.DATABASE_DEFAULT_CLIENT !== 'pg') {
      t.skip('requires PostgreSQL row-lock contention');
      return;
    }

    const suffix = randomUUID().slice(0, 12);
    const fixture: {
      categoryId?: number;
      productId?: number;
      skuId?: number;
      balanceId?: number;
      customers: Array<{
        name: string;
        userId: number;
        addressId: number;
        cartId: number;
        cartItemId: number;
        correlationId: string;
      }>;
    } = { customers: [] };

    const createCustomerCheckout = async (name: string, index: number) => {
      return await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({ name }, true);
        const trade = app.scope('commerce-trade');
        await app.bean.passport.signinMock(name as any);
        try {
          const addressId = await app.bean.executor.performAction(
            'post',
            '/commerce/member/address/createMine',
            {
              body: {
                recipientName: `Checkout Contention Customer ${index}`,
                phone: `1555555012${index}`,
                countryCode: 'US',
                region: 'California',
                city: 'San Francisco',
                postalCode: '94105',
                addressLine1: `${index} Market Street`,
              },
            },
          );
          const cart = await trade.model.cart.insert({ userId: user.id });
          const cartItem = await trade.model.cartItem.insert({
            cartId: cart.id,
            skuId: fixture.skuId!,
            quantity: 1,
          });
          return {
            name,
            userId: user.id as number,
            addressId,
            cartId: cart.id as number,
            cartItemId: cartItem.id as number,
            correlationId: `checkout-contention-${suffix}-${index}`,
          };
        } finally {
          await app.bean.passport.signout();
        }
      });
    };

    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const trade = app.scope('commerce-trade');
          fixture.categoryId = await app.bean.executor.performAction(
            'post',
            '/commerce/catalog/category',
            { body: { name: `checkout-contention-category-${suffix}`, published: true } },
          );
          fixture.productId = await app.bean.executor.performAction(
            'post',
            '/commerce/catalog/product',
            {
              body: {
                categoryId: fixture.categoryId,
                title: `checkout-contention-product-${suffix}`,
                published: true,
              },
            },
          );
          fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
            body: {
              productId: fixture.productId,
              code: `checkout-contention-sku-${suffix}`,
              priceCents: 1299,
              attributes: [],
              lifecycle: 'active',
            },
          });
          const balance = await trade.service.stockBalance.adjustStock({
            skuId: fixture.skuId,
            delta: 1,
            reason: 'checkout contention fixture',
            correlationId: `checkout-contention-stock-${suffix}`,
          });
          fixture.balanceId = balance.id as number;
        } finally {
          await app.bean.passport.signout();
        }
      });

      fixture.customers.push(
        await createCustomerCheckout(`checkout-contention-a-${suffix}`, 1),
        await createCustomerCheckout(`checkout-contention-b-${suffix}`, 2),
      );
      assert.notEqual(fixture.customers[0].userId, fixture.customers[1].userId);
      assert.notEqual(fixture.customers[0].addressId, fixture.customers[1].addressId);
      assert.notEqual(fixture.customers[0].cartId, fixture.customers[1].cartId);

      const checkoutInContext = async (customer: (typeof fixture.customers)[number]) => {
        return await app.bean.executor.mockCtx(async () => {
          await app.bean.passport.signinMock(customer.name as any);
          try {
            return await app.scope('commerce-trade').service.order.checkout({
              addressId: customer.addressId,
              correlationId: customer.correlationId,
            });
          } finally {
            await app.bean.passport.signout();
          }
        });
      };
      const results = await Promise.allSettled(fixture.customers.map(checkoutInContext));
      assert.equal(
        results.filter(result => result.status === 'fulfilled').length,
        1,
        JSON.stringify(results),
      );
      assert.equal(
        results.filter(result => result.status === 'rejected').length,
        1,
        JSON.stringify(results),
      );
      const rejected = results.find(result => result.status === 'rejected');
      assert.equal(
        (rejected as PromiseRejectedResult | undefined)?.reason?.code,
        409,
        String((rejected as PromiseRejectedResult | undefined)?.reason),
      );

      const winningIndex = results.findIndex(result => result.status === 'fulfilled');
      assert.notEqual(winningIndex, -1);
      const winningResult = results[winningIndex];
      assert.equal(winningResult.status, 'fulfilled');
      if (winningResult.status !== 'fulfilled') throw new Error('expected a successful checkout');
      const winner = fixture.customers[winningIndex];
      const loser = fixture.customers[winningIndex === 0 ? 1 : 0];

      await app.bean.executor.mockCtx(async () => {
        const trade = app.scope('commerce-trade');
        const payment = app.scope('commerce-payment');
        const winningOrder = await trade.model.order.get({ correlationId: winner.correlationId });
        const losingOrder = await trade.model.order.get({ correlationId: loser.correlationId });
        assert.ok(winningOrder);
        assert.equal(winningOrder.id, winningResult.value.orderId);
        assert.equal(losingOrder, undefined);

        const lines = await trade.model.orderLine.select({ where: { orderId: winningOrder.id } });
        assert.equal(lines.length, 1);
        assert.equal(String(lines[0].skuId), String(fixture.skuId));
        assert.equal(lines[0].quantity, 1);
        const reservations = await trade.model.stockReservation.select({
          where: { skuId: fixture.skuId },
        });
        assert.equal(reservations.length, 1);
        assert.equal(String(reservations[0].orderLineId), String(lines[0].id));
        assert.equal(reservations[0].state, 'reserved');

        const paymentAttempt = await payment.model.paymentAttempt.get({ orderId: winningOrder.id });
        assert.equal(paymentAttempt?.id, winningResult.value.paymentAttemptId);
        assert.equal(paymentAttempt?.state, 'created');
        const orderAudits = await trade.model.orderAudit.select({
          where: { orderId: winningOrder.id },
        });
        assert.deepEqual(
          orderAudits.map(audit => audit.operation),
          ['created'],
        );
        const stockAudits = await trade.model.stockAudit.select({
          where: { skuId: fixture.skuId },
          orders: [['id', 'asc']],
        });
        assert.deepEqual(
          stockAudits.map(audit => audit.operation),
          ['adjust', 'reserve'],
        );
        assert.equal(
          stockAudits.some(audit => audit.correlationId === `${winner.correlationId}:line:0`),
          true,
        );

        const balance = await trade.model.stockBalance.getById(fixture.balanceId!);
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [1, 1, 0]);
        assert.equal(await trade.model.cartItem.getById(winner.cartItemId), undefined);
        assert.equal((await trade.model.cartItem.getById(loser.cartItemId))?.quantity, 1);
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        const trade = app.scope('commerce-trade');
        const payment = app.scope('commerce-payment');
        const catalog = app.scope('commerce-catalog');
        const member = app.scope('commerce-member');
        for (const customer of fixture.customers) {
          const orders = await trade.model.order.select({
            where: { correlationId: customer.correlationId },
          });
          for (const order of orders) {
            await payment.model.paymentAttempt.delete({ orderId: order.id });
            await trade.model.orderAudit.delete({ orderId: order.id });
            const lines = await trade.model.orderLine.select({ where: { orderId: order.id } });
            for (const line of lines)
              await trade.model.stockReservation.delete({ orderLineId: line.id });
            await trade.model.orderLine.delete({ orderId: order.id });
            await trade.model.order.delete({ id: order.id });
          }
          await trade.model.cartItem.delete({ cartId: customer.cartId });
          await trade.model.cart.delete({ id: customer.cartId });
          await member.model.address.delete({ id: customer.addressId });
        }
        if (fixture.skuId !== undefined) {
          await trade.model.stockReservation.delete({ skuId: fixture.skuId });
          await trade.model.stockAudit.delete({ skuId: fixture.skuId });
        }
        if (fixture.balanceId !== undefined)
          await trade.model.stockBalance.delete({ id: fixture.balanceId });
        if (fixture.skuId !== undefined) await catalog.model.sku.delete({ id: fixture.skuId });
        if (fixture.productId !== undefined)
          await catalog.model.product.delete({ id: fixture.productId });
        if (fixture.categoryId !== undefined)
          await catalog.model.category.delete({ id: fixture.categoryId });
        for (const customer of fixture.customers) {
          await app.scope('home-user').model.roleUser.delete({ userId: customer.userId });
          await app.bean.user.removeById(customer.userId);
        }
      });
    }
  });
});
