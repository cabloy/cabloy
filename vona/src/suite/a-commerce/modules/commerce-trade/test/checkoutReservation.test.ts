import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

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
}

async function cleanup(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  const payment = app.scope('commerce-payment');
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
}

describe('checkoutReservation.test.ts', { concurrency: false }, () => {
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
          '/commerce/member/address',
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
            '/commerce/member/address',
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
