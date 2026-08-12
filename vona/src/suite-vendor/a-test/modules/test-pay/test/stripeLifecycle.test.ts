import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

interface IFixture {
  categoryId?: number;
  productId?: number;
  skuId?: number;
  balanceId?: number;
  addressId?: number;
  cartId?: number;
  userId?: number;
  customerName?: string;
  orderId?: number;
  paymentAttemptId?: number;
  paymentSessionId?: number;
}

interface IGatewayState {
  checkoutSessionId?: string;
  paymentIntentId?: string;
  providerInvoiceReference?: string;
  providerCorrelationReference?: string;
  retrieveFailuresRemaining?: number;
  calls: Array<{ kind: string; input: unknown }>;
}

function createGateway(state: IGatewayState) {
  return {
    async createCheckoutSession(_options: unknown, input: any) {
      state.calls.push({ kind: 'createCheckoutSession', input });
      state.providerCorrelationReference = input.body.client_reference_id;
      state.providerInvoiceReference = input.body.metadata.providerInvoiceReference;
      state.checkoutSessionId = `stripe-checkout-${state.providerCorrelationReference}`;
      state.paymentIntentId = `stripe-payment-${state.providerCorrelationReference}`;
      return checkoutSessionRecord(state);
    },
    async retrieveCheckoutSession(_options: unknown, input: unknown) {
      state.calls.push({ kind: 'retrieveCheckoutSession', input });
      if (state.retrieveFailuresRemaining) {
        state.retrieveFailuresRemaining -= 1;
        throw new Error('transient Stripe Checkout retrieval failure');
      }
      return checkoutSessionRecord(state, { settled: true });
    },
    async constructWebhookEvent(_options: unknown, input: unknown) {
      state.calls.push({ kind: 'constructWebhookEvent', input });
      return {
        id: `evt_${state.providerCorrelationReference}`,
        type: 'checkout.session.completed',
        data: { object: checkoutSessionRecord(state, { settled: true }) },
      };
    },
  };
}

function checkoutSessionRecord(state: IGatewayState, options: { settled?: boolean } = {}) {
  return {
    id: state.checkoutSessionId,
    amount_total: 1299,
    currency: 'usd',
    livemode: false,
    status: options.settled ? 'complete' : 'open',
    payment_status: options.settled ? 'paid' : 'unpaid',
    url: `https://checkout.stripe.test/${state.checkoutSessionId}`,
    client_reference_id: state.providerCorrelationReference,
    metadata: {
      providerCorrelationReference: state.providerCorrelationReference,
      providerInvoiceReference: state.providerInvoiceReference,
    },
    ...(options.settled && {
      payment_intent: {
        id: state.paymentIntentId,
        amount: 1299,
        currency: 'usd',
        status: 'succeeded',
        metadata: {
          providerCorrelationReference: state.providerCorrelationReference,
          providerInvoiceReference: state.providerInvoiceReference,
        },
      },
    }),
  };
}

function providerState(gateway: ReturnType<typeof createGateway>) {
  return {
    'pay-stripe:stripe/default': {
      secretCredential: 'sk_test_lifecycle',
      secretWebhook: 'whsec_test_lifecycle',
      gateway,
    },
  } as never;
}

function providerExtraData(gateway: ReturnType<typeof createGateway>) {
  return {
    state: { payProviderClientOptions: providerState(gateway) } as never,
  };
}

async function cleanup(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  const payment = app.scope('commerce-payment');
  const catalog = app.scope('commerce-catalog');
  const member = app.scope('commerce-member');
  const pay = app.scope('a-pay');
  if (fixture.paymentSessionId !== undefined) {
    const refunds = await pay.model.refundOperation.select({
      where: { paymentSessionId: fixture.paymentSessionId },
    });
    for (const refund of refunds) {
      const providerOperation = await pay.model.providerOperation.get({
        refundOperationId: refund.id,
        kind: 'refund',
      });
      if (providerOperation) {
        await pay.model.providerOperationRecoveryAudit.delete({
          providerOperationId: providerOperation.id,
        });
      }
      await pay.model.providerOperation.delete({
        refundOperationId: refund.id,
      });
      await pay.model.outboxEvent.delete({ refundOperationId: refund.id });
      await pay.model.webhookInbox.delete({ refundOperationId: refund.id });
      await pay.model.refundOperation.delete({ id: refund.id });
    }
    await pay.model.providerOperation.delete({
      paymentSessionId: fixture.paymentSessionId,
    });
    await pay.model.outboxEvent.delete({
      paymentSessionId: fixture.paymentSessionId,
    });
    await pay.model.webhookInbox.delete({
      paymentSessionId: fixture.paymentSessionId,
    });
    await pay.model.paymentAudit.delete({
      paymentSessionId: fixture.paymentSessionId,
    });
  }
  if (fixture.orderId !== undefined) {
    const requests = await payment.model.refundRequest.select({
      where: { orderId: fixture.orderId },
    });
    for (const request of requests) {
      await payment.model.refundAudit.delete({ refundRequestId: request.id });
      await payment.model.refundAttempt.delete({ refundRequestId: request.id });
    }
    await payment.model.refundRequest.delete({ orderId: fixture.orderId });
    await trade.model.orderAudit.delete({ orderId: fixture.orderId });
    const lines = await trade.model.orderLine.select({
      where: { orderId: fixture.orderId },
    });
    for (const line of lines) await trade.model.stockReservation.delete({ orderLineId: line.id });
    await trade.model.orderLine.delete({ orderId: fixture.orderId });
    await trade.model.order.delete({ id: fixture.orderId });
  }
  if (fixture.paymentAttemptId !== undefined) {
    await payment.model.paymentAudit.delete({
      paymentAttemptId: fixture.paymentAttemptId,
    });
    await payment.model.paymentAttempt.delete({ id: fixture.paymentAttemptId });
  }
  if (fixture.paymentSessionId !== undefined) {
    await pay.model.paymentSession.delete({ id: fixture.paymentSessionId });
  }
  if (fixture.cartId !== undefined) {
    await trade.model.cartItem.delete({ cartId: fixture.cartId });
    await trade.model.cart.delete({ id: fixture.cartId });
  }
  if (fixture.addressId !== undefined) await member.model.address.delete({ id: fixture.addressId });
  if (fixture.balanceId !== undefined)
    await trade.model.stockBalance.delete({ id: fixture.balanceId });
  if (fixture.skuId !== undefined) await catalog.model.sku.delete({ id: fixture.skuId });
  if (fixture.productId !== undefined)
    await catalog.model.product.delete({ id: fixture.productId });
  if (fixture.categoryId !== undefined) {
    await catalog.model.category.delete({ id: fixture.categoryId });
  }
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

async function createCheckout(suffix: string): Promise<IFixture> {
  const fixture: IFixture = {};
  await app.bean.passport.signinMock();
  fixture.categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
    body: { name: `stripe-category-${suffix}`, published: true },
  });
  fixture.productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
    body: {
      categoryId: fixture.categoryId,
      title: `stripe-product-${suffix}`,
      published: true,
    },
  });
  fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
    body: {
      productId: fixture.productId,
      code: `stripe-sku-${suffix}`,
      priceCents: 1299,
      attributes: [],
      lifecycle: 'active',
    },
  });
  fixture.balanceId = (
    await app.scope('commerce-trade').service.stockBalance.adjustStock({
      skuId: fixture.skuId,
      delta: 1,
      reason: 'Stripe lifecycle fixture',
      correlationId: `stripe-stock-${suffix}`,
    })
  ).id as number;
  await app.bean.passport.signout();
  fixture.customerName = `stripe-customer-${suffix}`;
  const customer = await app.bean.user.register({ name: fixture.customerName }, true);
  fixture.userId = customer.id as number;
  await app.bean.passport.signinMock(fixture.customerName as any);
  const userId = app.bean.passport.currentUser!.id;
  fixture.addressId = await app.bean.executor.performAction(
    'post',
    '/commerce/member/address/createMine',
    {
      body: {
        recipientName: 'Stripe Customer',
        phone: '15555550137',
        countryCode: 'US',
        region: 'California',
        city: 'San Francisco',
        postalCode: '94105',
        addressLine1: '10 Market Street',
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
  const checkout = await app.scope('commerce-trade').service.order.checkout({
    addressId: fixture.addressId,
    correlationId: `stripe-checkout-${suffix}`,
    providerCandidateKey: 'stripe',
  });
  fixture.orderId = checkout.orderId as number;
  fixture.paymentAttemptId = checkout.paymentAttemptId as number;
  fixture.paymentSessionId = checkout.paymentSessionId as number;
  return fixture;
}

async function callbackToken(sessionId: number) {
  const session = await app.scope('a-pay').model.paymentSession.getById(sessionId);
  assert.ok(session);
  return (await app.scope('a-pay').service.paymentCallback.createUrls(session)).returnUrl;
}

async function consumeReturnCallback(sessionId: number, gateway: ReturnType<typeof createGateway>) {
  const state = new URL(await callbackToken(sessionId)).searchParams.get('state');
  assert.ok(state);
  await assert.rejects(
    app.bean.executor.performAction('get', '/pay/payment-callback/return', {
      query: { state },
      extraData: providerExtraData(gateway),
    }),
    { status: 302 },
  );
}

async function dispatchPaymentOutcome(paymentSessionId: number) {
  const pay = app.scope('a-pay');
  const outbox = await pay.model.outboxEvent.get({
    paymentSessionId,
    eventType: 'payment.outcome.v1',
  });
  assert.ok(outbox);
  await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
  await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
  return outbox;
}

describe('stripeLifecycle.test.ts', { concurrency: false, sequential: true }, () => {
  const releases: Array<() => void> = [];
  let originalServe: { protocol?: string; host?: string };

  before(async () => {
    for (const scene of ['a-commerce', 'a-pay']) releases.push(await acquireTestLock(scene));
    originalServe = { ...app.config.server.serve };
    (app.config.server.serve as any).protocol = 'http';
    (app.config.server.serve as any).host = 'localhost';
  });

  after(() => {
    Object.assign(app.config.server.serve, originalServe);
    for (const release of releases.reverse()) release();
  });

  it('starts Stripe Checkout and settles its return callback through Commerce', async () => {
    const state: IGatewayState = { calls: [] };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          const options = app.bean.payProvider.getOptions('pay-stripe:stripe', 'default') as any;
          assert.equal(options.secretCredential, 'sk_test_lifecycle');
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)));
          const pay = app.scope('a-pay');
          const selected = await pay.model.paymentSession.getById(fixture.paymentSessionId!);
          assert.equal(selected?.providerName, 'pay-stripe:stripe');
          assert.equal(selected?.environment, 'sandbox');
          const started = await pay.service.paymentSession.start(fixture.paymentSessionId!);
          assert.equal(started.state, 'requires_action');
          assert.deepEqual(started.nextAction, {
            kind: 'redirect',
            url: `https://checkout.stripe.test/${state.checkoutSessionId}`,
          });
          const operation = await pay.model.providerOperation.get({
            paymentSessionId: started.id,
            kind: 'start',
          });
          assert.equal(operation?.state, 'succeeded');
          assert.match(
            operation?.idempotencyKey ?? '',
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
          );
          assert.equal(operation?.providerRequestId, operation?.idempotencyKey);
          const createCall = state.calls.find(call => call.kind === 'createCheckoutSession') as any;
          assert.equal(createCall.input.idempotencyKey, operation?.idempotencyKey);
          assert.equal(
            createCall.input.body.client_reference_id,
            started.providerCorrelationReference,
          );
          assert.deepEqual(createCall.input.body.metadata, {
            paymentSessionId: String(started.id),
            providerCorrelationReference: started.providerCorrelationReference,
            providerInvoiceReference: started.providerInvoiceReference,
          });
          assert.equal(started.providerOrderId, state.checkoutSessionId);
          await consumeReturnCallback(started.id as number, gateway);
          const outbox = await dispatchPaymentOutcome(started.id as number);
          const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
          const attempt = await app
            .scope('commerce-payment')
            .model.paymentAttempt.getById(fixture.paymentAttemptId!);
          assert.deepEqual(
            [order?.state, attempt?.state, (await pay.model.outboxEvent.getById(outbox.id))?.state],
            ['paid', 'succeeded', 'dispatched'],
          );
          assert.equal(
            state.calls.filter(call => call.kind === 'retrieveCheckoutSession').length,
            1,
          );
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });

  it('deduplicates a signed Stripe payment webhook before Commerce settlement', async () => {
    const state: IGatewayState = { calls: [] };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)));
          const pay = app.scope('a-pay');
          const started = await pay.service.paymentSession.start(fixture.paymentSessionId!);
          const rawBody = JSON.stringify({
            id: `stripe-webhook-${started.id}`,
          });
          const verified = await pay.bean.payProvider.get('pay-stripe:stripe').verifyWebhook(
            {
              rawBody,
              body: JSON.parse(rawBody),
              headers: { 'stripe-signature': 'stripe-signature-test' },
            },
            pay.bean.payProvider.getOptions('pay-stripe:stripe', 'default'),
          );
          await pay.service.webhook.receive({
            providerName: 'pay-stripe:stripe',
            clientName: 'default',
            environment: 'sandbox',
            rawBody,
            verified,
          });
          await pay.service.webhook.receive({
            providerName: 'pay-stripe:stripe',
            clientName: 'default',
            environment: 'sandbox',
            rawBody,
            verified,
          });
          const inboxes = await pay.model.webhookInbox.select({
            where: { paymentSessionId: started.id },
          });
          assert.equal(inboxes.length, 1);
          const outboxes = await pay.model.outboxEvent.select({
            where: {
              paymentSessionId: started.id,
              eventType: 'payment.outcome.v1',
            },
          });
          assert.equal(outboxes.length, 1);
          const webhookCall = state.calls.find(
            call => call.kind === 'constructWebhookEvent',
          ) as any;
          assert.deepEqual(webhookCall.input, {
            rawBody,
            body: JSON.parse(rawBody),
            headers: { 'stripe-signature': 'stripe-signature-test' },
          });
          await pay.queue.outboxDispatch.pushAsync({
            outboxEventId: outboxes[0]!.id,
          });
          await pay.queue.outboxDispatch.pushAsync({
            outboxEventId: outboxes[0]!.id,
          });
          const dispatched = await pay.model.outboxEvent.getById(outboxes[0]!.id);
          assert.equal(
            dispatched?.state,
            'dispatched',
            dispatched?.errorSummary ?? 'outbox did not dispatch',
          );
          const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
          const attempt = await app
            .scope('commerce-payment')
            .model.paymentAttempt.getById(fixture.paymentAttemptId!);
          assert.deepEqual([order?.state, attempt?.state], ['paid', 'succeeded']);
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });

  it('recovers a transient Stripe Checkout retrieval failure through reconciliation', async () => {
    const state: IGatewayState = { retrieveFailuresRemaining: 1, calls: [] };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)));
          const pay = app.scope('a-pay');
          const started = await pay.service.paymentSession.start(fixture.paymentSessionId!);
          await consumeReturnCallback(started.id as number, gateway);
          const operation = await pay.model.providerOperation.get({
            paymentSessionId: started.id,
            kind: 'confirm',
          });
          assert.equal(operation?.state, 'reconciliation_required');
          assert.equal(operation?.errorSummary, 'Provider operation failed and will be reconciled');
          assert.ok(operation?.nextAttemptAt);
          assert.equal(
            await pay.model.outboxEvent.get({
              paymentSessionId: started.id,
              eventType: 'payment.outcome.v1',
            }),
            undefined,
          );
          assert.equal(
            (await app.scope('commerce-trade').model.order.getById(fixture.orderId!))?.state,
            'awaiting_payment',
          );
          await pay.model.providerOperation.updateById(operation!.id, {
            nextAttemptAt: new Date(Date.now() - 1_000),
          });
          assert.equal(await pay.service.providerOperation.queueDue(), 1);
          assert.equal((await pay.model.paymentSession.getById(started.id))?.state, 'succeeded');
          await dispatchPaymentOutcome(started.id as number);
          assert.equal(
            (await app.scope('commerce-trade').model.order.getById(fixture.orderId!))?.state,
            'paid',
          );
          assert.equal(
            state.calls.filter(call => call.kind === 'retrieveCheckoutSession').length,
            2,
          );
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });
});
