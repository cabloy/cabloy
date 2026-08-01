import assert from 'node:assert';
import { createHmac, randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

interface IFixture {
  categoryId?: number;
  productId?: number;
  skuId?: number;
  balanceId?: number;
  templateId?: number;
  grantId?: number;
  addressId?: number;
  cartId?: number;
  userId?: number;
  customerName?: string;
  checkoutCorrelationId?: string;
  orderId?: number;
  paymentAttemptId?: number;
  paymentSessionId?: number;
}

async function cleanup(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  const payment = app.scope('commerce-payment');
  const promotion = app.scope('commerce-promotion');
  const catalog = app.scope('commerce-catalog');
  const member = app.scope('commerce-member');
  const pay = app.scope('a-pay');
  if (fixture.paymentSessionId !== undefined) {
    await pay.model.outboxEvent.delete({ paymentSessionId: fixture.paymentSessionId });
    await pay.model.paymentAudit.delete({ paymentSessionId: fixture.paymentSessionId });
    await pay.model.webhookInbox.delete({ paymentSessionId: fixture.paymentSessionId });
  }
  if (fixture.paymentAttemptId !== undefined)
    await payment.model.paymentAudit.delete({ paymentAttemptId: fixture.paymentAttemptId });
  if (fixture.paymentAttemptId !== undefined)
    await payment.model.paymentAttempt.delete({ id: fixture.paymentAttemptId });
  if (fixture.paymentSessionId !== undefined)
    await pay.model.paymentSession.delete({ id: fixture.paymentSessionId });
  if (fixture.orderId !== undefined)
    await trade.model.orderAudit.delete({ orderId: fixture.orderId });
  if (fixture.skuId !== undefined) await trade.model.stockAudit.delete({ skuId: fixture.skuId });
  if (fixture.orderId !== undefined) {
    const lines = await trade.model.orderLine.select({ where: { orderId: fixture.orderId } });
    for (const line of lines) await trade.model.stockReservation.delete({ orderLineId: line.id });
    await trade.model.orderLine.delete({ orderId: fixture.orderId });
    await trade.model.order.delete({ id: fixture.orderId });
  }
  if (fixture.cartId !== undefined) {
    await trade.model.cartItem.delete({ cartId: fixture.cartId });
    await trade.model.cart.delete({ id: fixture.cartId });
  }
  if (fixture.addressId !== undefined) await member.model.address.delete({ id: fixture.addressId });
  if (fixture.grantId !== undefined) {
    await promotion.model.couponAudit.delete({ couponGrantId: fixture.grantId });
    await promotion.model.couponGrant.delete({ id: fixture.grantId });
  }
  if (fixture.templateId !== undefined)
    await promotion.model.couponTemplate.delete({ id: fixture.templateId });
  if (fixture.balanceId !== undefined)
    await trade.model.stockBalance.delete({ id: fixture.balanceId });
  if (fixture.skuId !== undefined) await catalog.model.sku.delete({ id: fixture.skuId });
  if (fixture.productId !== undefined)
    await catalog.model.product.delete({ id: fixture.productId });
  if (fixture.categoryId !== undefined)
    await catalog.model.category.delete({ id: fixture.categoryId });
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

async function createCheckoutFixture(suffix: string, withCoupon = true): Promise<IFixture> {
  const fixture: IFixture = {};
  await app.bean.passport.signinMock();
  fixture.categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
    body: { name: `payment-category-${suffix}`, published: true },
  });
  fixture.productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
    body: {
      categoryId: fixture.categoryId,
      title: `payment-product-${suffix}`,
      published: true,
    },
  });
  fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
    body: {
      productId: fixture.productId,
      code: `payment-sku-${suffix}`,
      priceCents: 1299,
      attributes: [],
      lifecycle: 'active',
    },
  });
  fixture.balanceId = (
    await app.scope('commerce-trade').service.stockBalance.adjustStock({
      skuId: fixture.skuId,
      delta: 1,
      reason: 'payment outcome fixture',
      correlationId: `payment-stock-${suffix}`,
    })
  ).id as number;
  await app.bean.passport.signout();
  const customerName = `payment-customer-${suffix}`;
  fixture.customerName = customerName;
  const customer = await app.bean.user.register({ name: customerName }, true);
  fixture.userId = customer.id as number;
  await app.bean.passport.signinMock(customerName as any);
  const userId = app.bean.passport.currentUser!.id;
  if (withCoupon) {
    fixture.templateId = (
      await app.scope('commerce-promotion').model.couponTemplate.insert({
        name: `payment-coupon-${suffix}`,
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
    fixture.grantId = (
      await app.scope('commerce-promotion').service.coupon.issue({
        templateId: fixture.templateId,
        userId,
        correlationId: `payment-coupon-${suffix}`,
        reason: 'payment outcome fixture',
      })
    ).id as number;
  }
  fixture.addressId = await app.bean.executor.performAction(
    'post',
    '/commerce/member/address/createMine',
    {
      body: {
        recipientName: 'Payment Customer',
        phone: '15555550136',
        countryCode: 'US',
        region: 'California',
        city: 'San Francisco',
        postalCode: '94105',
        addressLine1: '9 Market Street',
      },
    },
  );
  const cart = await app.scope('commerce-trade').model.cart.insert({ userId });
  fixture.cartId = cart.id as number;
  await app.scope('commerce-trade').model.cartItem.insert({
    cartId: cart.id,
    skuId: fixture.skuId,
    quantity: 1,
  });
  fixture.checkoutCorrelationId = `payment-checkout-${suffix}`;
  const checkout = await app.scope('commerce-trade').service.order.checkout({
    addressId: fixture.addressId,
    couponGrantId: fixture.grantId,
    correlationId: fixture.checkoutCorrelationId,
  });
  fixture.orderId = checkout.orderId as number;
  fixture.paymentAttemptId = checkout.paymentAttemptId as number;
  fixture.paymentSessionId = checkout.paymentSessionId as number;
  return fixture;
}

describe('paymentOutcome.test.ts', { concurrency: false, sequential: true }, () => {
  it('delivers a signed webhook through the durable outbox to Commerce exactly once', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        const eventId = `provider-${randomUUID().slice(0, 12)}`;
        const rawBody = JSON.stringify({
          paymentSessionId: String(fixture.paymentSessionId),
          currency: 'USD',
          amountMinor: 799,
          eventType: 'payment.succeeded',
          eventId,
          state: 'succeeded',
          providerPaymentId: `payment-${eventId}`,
          providerCaptureId: `capture-${eventId}`,
        });
        const options = app.bean.payProvider.getOptions('pay-mock:mock', 'default');
        assert.equal(typeof options.secretWebhook, 'string');
        const signature = createHmac('sha256', options.secretWebhook).update(rawBody).digest('hex');
        const webhookPath = app.util.getAbsoluteUrlByApiPath('/pay/webhook/pay-mock:mock/default');
        const webhookUrl = webhookPath.startsWith('http')
          ? webhookPath
          : `http://127.0.0.1:${app.config.server.listen.port}${webhookPath}`;
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-pay-mock-signature': signature,
          },
          body: rawBody,
        });
        assert.equal(response.status, 200);
        const pay = app.scope('a-pay');
        const outbox = await pay.model.outboxEvent.get({
          paymentSessionId: fixture.paymentSessionId,
        });
        assert.ok(outbox);
        await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
        await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
        const [dispatched, order, attempt, line, balance, grant, paymentAudits] = await Promise.all(
          [
            pay.model.outboxEvent.getById(outbox.id),
            app.scope('commerce-trade').model.order.getById(fixture.orderId!),
            app.scope('commerce-payment').model.paymentAttempt.getById(fixture.paymentAttemptId!),
            app.scope('commerce-trade').model.orderLine.get({ orderId: fixture.orderId }),
            app.scope('commerce-trade').model.stockBalance.getById(fixture.balanceId!),
            app.scope('commerce-promotion').model.couponGrant.getById(fixture.grantId!),
            app.scope('commerce-payment').model.paymentAudit.select({
              where: { paymentAttemptId: fixture.paymentAttemptId },
            }),
          ],
        );
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: line?.id,
        });
        assert.deepEqual([dispatched?.state, dispatched?.attemptCount], ['dispatched', 1]);
        assert.equal(dispatched?.claimToken, undefined);
        assert.deepEqual(
          [order?.state, attempt?.state, reservation?.state],
          ['paid', 'succeeded', 'consumed'],
        );
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [0, 0, 0]);
        assert.equal(grant?.state, 'redeemed');
        assert.equal(paymentAudits.length, 1);
        assert.equal(paymentAudits[0]?.providerEventId, eventId);
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('settles a successful payment exactly once with stock and coupon consumption', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        const first = await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'succeeded',
            idempotencyKey: 'success-1',
          });
        const replay = await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'succeeded',
            idempotencyKey: 'success-1',
          });
        assert.deepEqual(replay, first);
        assert.deepEqual(
          [first.orderState, first.paymentAttemptState, first.payableTotalCents],
          ['paid', 'succeeded', 799],
        );
        const line = await app.scope('commerce-trade').model.orderLine.get({
          orderId: fixture.orderId,
        });
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: line?.id,
        });
        const balance = await app
          .scope('commerce-trade')
          .model.stockBalance.getById(fixture.balanceId!);
        const grant = await app
          .scope('commerce-promotion')
          .model.couponGrant.getById(fixture.grantId!);
        const paymentAudits = await app.scope('commerce-payment').model.paymentAudit.select({
          where: { paymentAttemptId: fixture.paymentAttemptId },
        });
        assert.equal(reservation?.state, 'consumed');
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [0, 0, 0]);
        assert.equal(grant?.state, 'redeemed');
        assert.equal(paymentAudits.length, 1);
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('settles a provider event without customer Passport authority', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        await app.bean.passport.signout();
        const event = {
          eventId: `provider-${randomUUID().slice(0, 12)}`,
          paymentSessionId: fixture.paymentSessionId!,
          businessReference: String(fixture.paymentAttemptId),
          providerName: 'pay-mock:mock',
          state: 'succeeded' as const,
          providerCaptureId: `capture-${randomUUID().slice(0, 12)}`,
          amountMinor: 799,
          currency: 'USD',
        };
        const first = await app
          .scope('commerce-trade')
          .service.order.settlePaymentFromProvider(event);
        const replay = await app
          .scope('commerce-trade')
          .service.order.settlePaymentFromProvider(event);
        assert.deepEqual(replay, first);
        assert.deepEqual([first.orderState, first.paymentAttemptState], ['paid', 'succeeded']);
        const audits = await app.scope('commerce-payment').model.paymentAudit.select({
          where: { paymentAttemptId: fixture.paymentAttemptId },
        });
        assert.equal(audits.length, 1);
        assert.equal(audits[0]?.providerEventId, event.eventId);
        assert.equal(audits[0]?.actorId, undefined);
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('accepts one concurrent PostgreSQL success event without duplicate effects', async t => {
    if (process.env.DATABASE_DEFAULT_CLIENT !== 'pg') {
      t.skip('requires PostgreSQL row-lock contention');
      return;
    }
    const fixture: IFixture = {};
    try {
      await app.bean.executor.mockCtx(async () => {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        await app.bean.passport.signout();
      });
      const settle = async () => {
        return await app.bean.executor.mockCtx(async () => {
          await app.bean.passport.signinMock(fixture.customerName as any);
          try {
            return await app
              .scope('commerce-trade')
              .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
                outcome: 'succeeded',
                idempotencyKey: 'concurrent-success-1',
              });
          } finally {
            await app.bean.passport.signout();
          }
        });
      };
      const results = await Promise.allSettled([settle(), settle()]);
      assert.equal(
        results.filter(result => result.status === 'fulfilled').length,
        2,
        JSON.stringify(results),
      );
      await app.bean.executor.mockCtx(async () => {
        const audits = await app.scope('commerce-payment').model.paymentAudit.select({
          where: { paymentAttemptId: fixture.paymentAttemptId },
        });
        assert.equal(audits.length, 1);
        const line = await app.scope('commerce-trade').model.orderLine.get({
          orderId: fixture.orderId,
        });
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: line?.id,
        });
        assert.equal(reservation?.state, 'consumed');
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await cleanup(fixture);
      });
    }
  });

  it('permits only one terminal outcome when payment success races expiry', async t => {
    if (process.env.DATABASE_DEFAULT_CLIENT !== 'pg') {
      t.skip('requires PostgreSQL row-lock contention');
      return;
    }
    const fixture: IFixture = {};
    const deadline = new Date(Date.now() + 60_000);
    try {
      await app.bean.executor.mockCtx(async () => {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        await app.scope('commerce-trade').model.order.updateById(fixture.orderId!, {
          reservationExpiresAt: deadline,
        });
        await app.bean.passport.signout();
      });
      const success = app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock(fixture.customerName as any);
        try {
          return await app
            .scope('commerce-trade')
            .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
              outcome: 'succeeded',
              idempotencyKey: 'expiry-race-1',
            });
        } finally {
          await app.bean.passport.signout();
        }
      });
      const expiry = app.bean.executor.mockCtx(async () => {
        return await app
          .scope('commerce-trade')
          .service.order.expireIfDue(fixture.orderId!, new Date(deadline.getTime() + 1));
      });
      await Promise.allSettled([success, expiry]);
      await app.bean.executor.mockCtx(async () => {
        const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
        const attempt = await app
          .scope('commerce-payment')
          .model.paymentAttempt.getById(fixture.paymentAttemptId!);
        const line = await app.scope('commerce-trade').model.orderLine.get({
          orderId: fixture.orderId,
        });
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: line?.id,
        });
        const grant = await app
          .scope('commerce-promotion')
          .model.couponGrant.getById(fixture.grantId!);
        if (order?.state === 'paid') {
          assert.deepEqual(
            [attempt?.state, reservation?.state, grant?.state],
            ['succeeded', 'consumed', 'redeemed'],
          );
        } else {
          assert.deepEqual(
            [order?.state, attempt?.state, reservation?.state],
            ['expired', 'cancelled', 'released'],
          );
          assert.ok(grant?.state === 'available' || grant?.state === 'expired');
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await cleanup(fixture);
      });
    }
  });

  it('rolls back every payment outcome stage without durable terminal effects', async () => {
    const stages = [
      'afterOrderState',
      'afterPaymentAttempt',
      'afterResourceTransition',
      'afterPaymentAudit',
      'afterOrderAudit',
    ] as const;
    await app.bean.executor.mockCtx(async () => {
      for (const stage of stages) {
        const fixture: IFixture = {};
        try {
          Object.assign(
            fixture,
            await createCheckoutFixture(`${randomUUID().slice(0, 8)}-${stage}`),
          );
          await assert.rejects(
            app.scope('commerce-trade').service.order.applyPaymentOutcomeForTest(
              fixture.paymentAttemptId!,
              {
                outcome: 'succeeded',
                idempotencyKey: `rollback-${stage}`,
              },
              currentStage => {
                if (currentStage === stage) throw new Error(`payment rollback proof: ${stage}`);
              },
            ),
            new RegExp(`payment rollback proof: ${stage}`),
          );

          const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
          const attempt = await app
            .scope('commerce-payment')
            .model.paymentAttempt.getById(fixture.paymentAttemptId!);
          const line = await app.scope('commerce-trade').model.orderLine.get({
            orderId: fixture.orderId,
          });
          const reservation = await app.scope('commerce-trade').model.stockReservation.get({
            orderLineId: line?.id,
          });
          const balance = await app
            .scope('commerce-trade')
            .model.stockBalance.getById(fixture.balanceId!);
          const grant = await app
            .scope('commerce-promotion')
            .model.couponGrant.getById(fixture.grantId!);
          const paymentAudits = await app.scope('commerce-payment').model.paymentAudit.select({
            where: { paymentAttemptId: fixture.paymentAttemptId },
          });
          const orderAudits = await app.scope('commerce-trade').model.orderAudit.select({
            where: { orderId: fixture.orderId },
            orders: [['id', 'asc']],
          });
          const stockAudits = await app.scope('commerce-trade').model.stockAudit.select({
            where: { skuId: fixture.skuId },
            orders: [['id', 'asc']],
          });
          const couponAudits = await app.scope('commerce-promotion').model.couponAudit.select({
            where: { couponGrantId: fixture.grantId },
            orders: [['id', 'asc']],
          });
          assert.deepEqual(
            [order?.state, attempt?.state, reservation?.state],
            ['awaiting_payment', 'created', 'reserved'],
          );
          assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [1, 1, 0]);
          assert.equal(grant?.state, 'reserved');
          assert.equal(paymentAudits.length, 0);
          assert.deepEqual(
            orderAudits.map(audit => audit.operation),
            ['created'],
          );
          assert.deepEqual(
            stockAudits.map(audit => audit.operation),
            ['adjust', 'reserve'],
          );
          assert.deepEqual(
            couponAudits.map(audit => audit.operation),
            ['issue', 'reserve'],
          );
        } finally {
          await cleanup(fixture);
        }
      }
      await app.bean.passport.signout();
    });
  });

  it('denies anonymous customer payment and order actions', async () => {
    await app.bean.executor.mockCtx(async () => {
      const requests = [
        () =>
          app.bean.executor.performAction('get', '/commerce/trade/order/mine', {
            innerAccess: false,
          }),
        () =>
          app.bean.executor.performAction('get', '/commerce/trade/order/viewMine/1', {
            innerAccess: false,
          }),
        () =>
          app.bean.executor.performAction('get', '/commerce/trade/order/1', {
            innerAccess: false,
          }),
        () =>
          app.bean.executor.performAction('get', '/payment-session/1', {
            innerAccess: false,
          }),
      ];
      for (const request of requests) {
        await assert.rejects(request(), (error: any) => error.code === 401);
      }
    });
  });

  it('hides a customer order and payment attempt from another customer', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        const foreignName = `payment-foreign-${randomUUID().slice(0, 12)}`;
        const foreign = await app.bean.user.register({ name: foreignName }, true);
        try {
          await app.bean.passport.signout();
          await app.bean.passport.signinMock(foreignName as any);
          assert.equal(
            await app.scope('commerce-trade').service.order.viewMine(fixture.orderId!),
            undefined,
          );
          assert.equal(
            (await app.scope('commerce-trade').service.order.mine()).list.some(
              order => String(order.id) === String(fixture.orderId),
            ),
            false,
          );
          await assert.rejects(
            app
              .scope('commerce-trade')
              .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
                outcome: 'succeeded',
                idempotencyKey: 'foreign-payment-1',
              }),
            (error: any) => error.code === 404,
          );
          const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
          const attempt = await app
            .scope('commerce-payment')
            .model.paymentAttempt.getById(fixture.paymentAttemptId!);
          const paymentAudits = await app.scope('commerce-payment').model.paymentAudit.select({
            where: { paymentAttemptId: fixture.paymentAttemptId },
          });
          assert.deepEqual([order?.state, attempt?.state], ['awaiting_payment', 'created']);
          assert.equal(paymentAudits.length, 0);
        } finally {
          await app.bean.passport.signout();
          await app.scope('home-user').model.roleUser.delete({ userId: foreign.id });
          await app.bean.user.removeById(foreign.id);
        }
      } finally {
        await app.bean.passport.signinMock(fixture.customerName as any);
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('treats a foreign-instance order and payment attempt as absent', async () => {
    const fixture: IFixture = {};
    let foreignUserId: number | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        await app.bean.passport.signout();
      });
      await app.bean.executor.mockCtx(
        async () => {
          const foreignName = `payment-instance-${randomUUID().slice(0, 12)}`;
          const foreign = await app.bean.user.register({ name: foreignName }, true);
          foreignUserId = foreign.id as number;
          await app.bean.passport.signinMock(foreignName as any);
          try {
            assert.equal(
              await app.scope('commerce-trade').service.order.viewMine(fixture.orderId!),
              undefined,
            );
            assert.equal(
              (await app.scope('commerce-trade').service.order.mine()).list.some(
                order => String(order.id) === String(fixture.orderId),
              ),
              false,
            );
            await assert.rejects(
              app
                .scope('commerce-trade')
                .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
                  outcome: 'succeeded',
                  idempotencyKey: 'foreign-instance-payment-1',
                }),
              (error: any) => error.code === 404,
            );
            assert.equal(
              (
                await app.scope('commerce-payment').model.paymentAudit.select({
                  where: { paymentAttemptId: fixture.paymentAttemptId },
                })
              ).length,
              0,
            );
          } finally {
            await app.bean.passport.signout();
          }
        },
        { instanceName: 'shareTest' as any },
      );
      await app.bean.executor.mockCtx(async () => {
        const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
        const attempt = await app
          .scope('commerce-payment')
          .model.paymentAttempt.getById(fixture.paymentAttemptId!);
        assert.deepEqual([order?.state, attempt?.state], ['awaiting_payment', 'created']);
      });
    } finally {
      await app.bean.executor.mockCtx(
        async () => {
          if (foreignUserId !== undefined) {
            await app.scope('home-user').model.roleUser.delete({ userId: foreignUserId });
            await app.bean.user.removeById(foreignUserId);
          }
        },
        { instanceName: 'shareTest' as any },
      );
      await app.bean.executor.mockCtx(async () => {
        await cleanup(fixture);
      });
    }
  });

  it('replays checkout correlation with its terminal payment result', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        const settled = await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'succeeded',
            idempotencyKey: 'terminal-checkout-replay-1',
          });
        const replay = await app.scope('commerce-trade').service.order.checkout({
          addressId: fixture.addressId!,
          couponGrantId: fixture.grantId,
          correlationId: fixture.checkoutCorrelationId!,
        });
        assert.deepEqual(
          [replay.orderId, replay.paymentAttemptId, replay.state, replay.paymentAttemptState],
          [
            settled.orderId,
            settled.paymentAttemptId,
            settled.orderState,
            settled.paymentAttemptState,
          ],
        );
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('rejects conflicting payment event reuse without another transition', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'succeeded',
            idempotencyKey: 'conflict-1',
          });
        await assert.rejects(
          app.scope('commerce-trade').service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'failed',
            idempotencyKey: 'conflict-1',
          }),
          (error: any) => error.code === 409,
        );
        const paymentAudits = await app.scope('commerce-payment').model.paymentAudit.select({
          where: { paymentAttemptId: fixture.paymentAttemptId },
        });
        assert.equal(paymentAudits.length, 1);
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('cancels payment exactly once and releases the unpaid order resources', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        const first = await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'cancelled',
            idempotencyKey: 'cancel-1',
          });
        const replay = await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'cancelled',
            idempotencyKey: 'cancel-1',
          });
        assert.deepEqual(replay, first);
        assert.deepEqual([first.orderState, first.paymentAttemptState], ['cancelled', 'cancelled']);
        const line = await app.scope('commerce-trade').model.orderLine.get({
          orderId: fixture.orderId,
        });
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: line?.id,
        });
        const grant = await app
          .scope('commerce-promotion')
          .model.couponGrant.getById(fixture.grantId!);
        assert.equal(reservation?.state, 'released');
        assert.equal(grant?.state, 'available');
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('releases a failed payment exactly once and cancels the order', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        const first = await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'failed',
            idempotencyKey: 'failure-1',
          });
        const replay = await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'failed',
            idempotencyKey: 'failure-1',
          });
        assert.deepEqual(replay, first);
        assert.deepEqual([first.orderState, first.paymentAttemptState], ['cancelled', 'failed']);
        const line = await app.scope('commerce-trade').model.orderLine.get({
          orderId: fixture.orderId,
        });
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: line?.id,
        });
        const balance = await app
          .scope('commerce-trade')
          .model.stockBalance.getById(fixture.balanceId!);
        const grant = await app
          .scope('commerce-promotion')
          .model.couponGrant.getById(fixture.grantId!);
        assert.equal(reservation?.state, 'released');
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [1, 0, 1]);
        assert.equal(grant?.state, 'available');
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });
});
