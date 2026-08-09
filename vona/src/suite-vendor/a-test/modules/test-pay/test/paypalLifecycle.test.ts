import { ApiError } from '@cabloy/paypal-server-sdk';
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
  orderId?: string;
  captureId?: string;
  refundId?: string;
  orderStatus: string;
  captureStatus?: string;
  captureFailuresRemaining?: number;
  refundStatus: string;
  refundError?: Error;
  captureLookupError?: Error;
  refundAmount?: string;
  providerInvoiceReference?: string;
  providerCorrelationReference?: string;
  refundProviderInvoiceReference?: string;
  refundProviderCorrelationReference?: string;
  calls: Array<{ kind: string; input: unknown }>;
}

function createGateway(state: IGatewayState) {
  return {
    async createOrder(_options: unknown, input: any) {
      state.calls.push({ kind: 'createOrder', input });
      const unit = input.body.purchaseUnits[0];
      state.providerCorrelationReference = unit.customId;
      state.providerInvoiceReference = unit.invoiceId;
      state.orderId = `paypal-order-${String(unit.customId)}`;
      return {
        id: state.orderId,
        links: [{ rel: 'approve', href: `https://sandbox.paypal.test/${state.orderId}` }],
      };
    },
    async captureOrder(_options: unknown, input: any) {
      state.calls.push({ kind: 'captureOrder', input });
      if (state.captureFailuresRemaining) {
        state.captureFailuresRemaining -= 1;
        throw new Error('transient PayPal capture failure');
      }
      state.captureId = state.captureId ?? `paypal-capture-${state.orderId}`;
      state.orderStatus = 'COMPLETED';
      state.captureStatus ??= 'COMPLETED';
      return orderRecord(state);
    },
    async getOrder(_options: unknown, input: any) {
      state.calls.push({ kind: 'getOrder', input });
      return orderRecord(state);
    },
    async refundCapturedPayment(_options: unknown, input: any) {
      state.calls.push({ kind: 'refundCapturedPayment', input });
      if (state.refundError) throw state.refundError;
      state.refundProviderCorrelationReference = input.body.customId;
      state.refundProviderInvoiceReference = input.body.invoiceId;
      state.refundId = state.refundId ?? `paypal-refund-${input.body.customId}`;
      return refundRecord(state);
    },
    async getCapturedPayment(_options: unknown, input: any) {
      state.calls.push({ kind: 'getCapturedPayment', input });
      if (state.captureLookupError) throw state.captureLookupError;
      return { id: state.captureId };
    },
    async getRefund(_options: unknown, input: any) {
      state.calls.push({ kind: 'getRefund', input });
      return refundRecord(state);
    },
    async verifyWebhookSignature(_options: unknown, input: unknown) {
      state.calls.push({ kind: 'verifyWebhookSignature', input });
    },
  };
}

function orderRecord(state: IGatewayState) {
  return {
    id: state.orderId,
    status: state.orderStatus,
    links: [{ rel: 'approve', href: `https://sandbox.paypal.test/${state.orderId}` }],
    purchaseUnits: [
      {
        customId: state.providerCorrelationReference,
        invoiceId: state.providerInvoiceReference,
        amount: { currencyCode: 'USD', value: '12.99' },
        payee: { merchantId: 'merchant-test' },
        payments: state.captureStatus
          ? {
              captures: [
                {
                  id: state.captureId,
                  status: state.captureStatus,
                  amount: { currencyCode: 'USD', value: '12.99' },
                },
              ],
            }
          : undefined,
      },
    ],
  };
}

function refundRecord(state: IGatewayState) {
  return {
    id: state.refundId,
    customId: state.refundProviderCorrelationReference,
    invoiceId: state.refundProviderInvoiceReference,
    amount: { currencyCode: 'USD', value: state.refundAmount ?? '5.00' },
    status: state.refundStatus,
    payee: { merchantId: 'merchant-test' },
  };
}

function paypalApiError(statusCode: number) {
  return new ApiError(
    {
      request: {} as never,
      response: { statusCode, headers: {}, body: '' } as never,
    },
    'opaque provider error',
  );
}

function providerState(gateway: ReturnType<typeof createGateway>) {
  return {
    'pay-paypal:paypal/default': {
      secretCredential: { clientId: 'client-test', clientSecret: 'secret-test' },
      webhookId: 'webhook-test',
      merchantReference: 'merchant-test',
      gateway,
    },
  } as never;
}

function providerExtraData(gateway: ReturnType<typeof createGateway>) {
  return { state: { payProviderClientOptions: providerState(gateway) } as never };
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
      await pay.model.providerOperation.delete({ refundOperationId: refund.id });
      await pay.model.outboxEvent.delete({ refundOperationId: refund.id });
      await pay.model.webhookInbox.delete({ refundOperationId: refund.id });
      await pay.model.refundOperation.delete({ id: refund.id });
    }
    await pay.model.providerOperation.delete({ paymentSessionId: fixture.paymentSessionId });
    await pay.model.outboxEvent.delete({ paymentSessionId: fixture.paymentSessionId });
    await pay.model.webhookInbox.delete({ paymentSessionId: fixture.paymentSessionId });
    await pay.model.paymentAudit.delete({ paymentSessionId: fixture.paymentSessionId });
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
    const lines = await trade.model.orderLine.select({ where: { orderId: fixture.orderId } });
    for (const line of lines) await trade.model.stockReservation.delete({ orderLineId: line.id });
    await trade.model.orderLine.delete({ orderId: fixture.orderId });
    await trade.model.order.delete({ id: fixture.orderId });
  }
  if (fixture.paymentAttemptId !== undefined) {
    await payment.model.paymentAudit.delete({ paymentAttemptId: fixture.paymentAttemptId });
    await payment.model.paymentAttempt.delete({ id: fixture.paymentAttemptId });
  }
  if (fixture.paymentSessionId !== undefined)
    await pay.model.paymentSession.delete({ id: fixture.paymentSessionId });
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
  if (fixture.categoryId !== undefined)
    await catalog.model.category.delete({ id: fixture.categoryId });
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

async function createCheckout(suffix: string, providerCandidateKey = 'paypal'): Promise<IFixture> {
  const fixture: IFixture = {};
  await app.bean.passport.signinMock();
  fixture.categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
    body: { name: `paypal-category-${suffix}`, published: true },
  });
  fixture.productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
    body: { categoryId: fixture.categoryId, title: `paypal-product-${suffix}`, published: true },
  });
  fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
    body: {
      productId: fixture.productId,
      code: `paypal-sku-${suffix}`,
      priceCents: 1299,
      attributes: [],
      lifecycle: 'active',
    },
  });
  fixture.balanceId = (
    await app.scope('commerce-trade').service.stockBalance.adjustStock({
      skuId: fixture.skuId,
      delta: 1,
      reason: 'PayPal lifecycle fixture',
      correlationId: `paypal-stock-${suffix}`,
    })
  ).id as number;
  await app.bean.passport.signout();
  fixture.customerName = `paypal-customer-${suffix}`;
  const customer = await app.bean.user.register({ name: fixture.customerName }, true);
  fixture.userId = customer.id as number;
  await app.bean.passport.signinMock(fixture.customerName as any);
  const userId = app.bean.passport.currentUser!.id;
  fixture.addressId = await app.bean.executor.performAction(
    'post',
    '/commerce/member/address/createMine',
    {
      body: {
        recipientName: 'PayPal Customer',
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
  const checkout = await app.scope('commerce-trade').service.order.checkout({
    addressId: fixture.addressId,
    correlationId: `paypal-checkout-${suffix}`,
    providerCandidateKey,
  });
  fixture.orderId = checkout.orderId as number;
  fixture.paymentAttemptId = checkout.paymentAttemptId as number;
  fixture.paymentSessionId = checkout.paymentSessionId as number;
  return fixture;
}

async function callbackToken(sessionId: number, purpose: 'return' | 'cancel') {
  const session = await app.scope('a-pay').model.paymentSession.getById(sessionId);
  assert.ok(session);
  return (await app.scope('a-pay').service.paymentCallback.createUrls(session))[
    purpose === 'return' ? 'returnUrl' : 'cancelUrl'
  ];
}

describe('paypalLifecycle.test.ts', { concurrency: false, sequential: true }, () => {
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

  it('selects PayPal, starts an order, and settles a return callback through Commerce', async () => {
    const state: IGatewayState = {
      orderStatus: 'CREATED',
      refundStatus: 'PENDING',
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          const resolvedPaypalOptions = app.bean.payProvider.getOptions(
            'pay-paypal:paypal',
            'default',
          ) as any;
          assert.equal(resolvedPaypalOptions.secretCredential?.clientId, 'client-test');
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const session = await pay.model.paymentSession.getById(fixture.paymentSessionId!);
          assert.equal(session?.providerName, 'pay-paypal:paypal');
          assert.equal(session?.environment, 'sandbox');
          const started = await pay.service.paymentSession.start(fixture.paymentSessionId!);
          assert.equal(started.state, 'requires_action');
          assert.equal(started.nextAction?.kind, 'redirect');
          assert.equal(
            (await pay.model.providerOperation.get({ paymentSessionId: started.id, kind: 'start' }))
              ?.state,
            'succeeded',
          );
          const startOperation = await pay.model.providerOperation.get({
            paymentSessionId: started.id,
            kind: 'start',
          });
          assert.match(
            startOperation?.idempotencyKey ?? '',
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
          );
          assert.equal(startOperation?.providerRequestId, startOperation?.idempotencyKey);
          const createCall = state.calls.find(call => call.kind === 'createOrder') as any;
          assert.equal(createCall.input.paypalRequestId, startOperation?.idempotencyKey);
          assert.equal(
            createCall.input.body.purchaseUnits[0].customId,
            started.providerCorrelationReference,
          );
          assert.equal(
            createCall.input.body.purchaseUnits[0].invoiceId,
            started.providerInvoiceReference,
          );
          assert.notEqual(started.providerCorrelationReference, String(started.id));
          assert.notEqual(started.providerInvoiceReference, String(fixture.paymentAttemptId));

          const returnUrl = await callbackToken(started.id as number, 'return');
          const returnState = new URL(returnUrl).searchParams.get('state');
          assert.ok(returnState);
          await assert.rejects(
            app.bean.executor.performAction('get', '/pay/payment-callback/return', {
              query: { state: returnState },
              extraData: { state: { payProviderClientOptions: providerState(gateway) } as never },
            }),
            { status: 302 },
          );
          const outbox = await pay.model.outboxEvent.get({
            paymentSessionId: started.id,
            eventType: 'payment.outcome.v1',
          });
          assert.ok(outbox);
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
          const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
          const attempt = await app
            .scope('commerce-payment')
            .model.paymentAttempt.getById(fixture.paymentAttemptId!);
          assert.deepEqual(
            [order?.state, attempt?.state, (await pay.model.outboxEvent.getById(outbox.id))?.state],
            ['paid', 'succeeded', 'dispatched'],
          );
          const captureCall = state.calls.find(call => call.kind === 'captureOrder') as any;
          assert.equal(captureCall.input.id, started.providerOrderId);
          assert.equal(captureCall.input.prefer, 'return=representation');
          assert.equal(state.calls.filter(call => call.kind === 'captureOrder').length, 1);
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: { state: { payProviderClientOptions: providerState(gateway) } as never } },
    );
  });

  it('reconciles a pending PayPal return through the durable provider operation', async () => {
    const state: IGatewayState = {
      orderStatus: 'CREATED',
      captureStatus: 'PENDING',
      refundStatus: 'PENDING',
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const started = await pay.service.paymentSession.start(fixture.paymentSessionId!);
          const returnState = new URL(
            await callbackToken(started.id as number, 'return'),
          ).searchParams.get('state');
          assert.ok(returnState);
          await assert.rejects(
            app.bean.executor.performAction('get', '/pay/payment-callback/return', {
              query: { state: returnState },
              extraData: providerExtraData(gateway),
            }),
            { status: 302 },
          );
          const pendingSession = await pay.model.paymentSession.getById(started.id);
          const operation = await pay.model.providerOperation.get({
            paymentSessionId: started.id,
            kind: 'confirm',
          });
          assert.equal(pendingSession?.state, 'processing');
          assert.equal(operation?.state, 'reconciliation_required');
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

          state.captureStatus = 'COMPLETED';
          await pay.model.providerOperation.updateById(operation!.id, {
            nextAttemptAt: new Date(Date.now() - 1_000),
          });
          assert.equal(await pay.service.providerOperation.queueDue(), 1);
          const settledSession = await pay.model.paymentSession.getById(started.id);
          const outbox = await pay.model.outboxEvent.get({
            paymentSessionId: started.id,
            eventType: 'payment.outcome.v1',
          });
          assert.equal(settledSession?.state, 'succeeded');
          assert.ok(outbox);
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
          assert.equal(
            (await app.scope('commerce-trade').model.order.getById(fixture.orderId!))?.state,
            'paid',
          );
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });

  it('recovers a transient PayPal capture failure through the durable provider operation', async () => {
    const state: IGatewayState = {
      orderStatus: 'CREATED',
      captureFailuresRemaining: 1,
      refundStatus: 'PENDING',
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const started = await pay.service.paymentSession.start(fixture.paymentSessionId!);
          const returnState = new URL(
            await callbackToken(started.id as number, 'return'),
          ).searchParams.get('state');
          assert.ok(returnState);
          await assert.rejects(
            app.bean.executor.performAction('get', '/pay/payment-callback/return', {
              query: { state: returnState },
              extraData: providerExtraData(gateway),
            }),
            { status: 302 },
          );
          const operation = await pay.model.providerOperation.get({
            paymentSessionId: started.id,
            kind: 'confirm',
          });
          assert.equal(operation?.state, 'reconciliation_required');
          assert.equal(operation?.errorSummary, 'Provider operation failed and will be reconciled');
          assert.equal(
            await pay.model.outboxEvent.get({
              paymentSessionId: started.id,
              eventType: 'payment.outcome.v1',
            }),
            undefined,
          );

          await pay.model.providerOperation.updateById(operation!.id, {
            nextAttemptAt: new Date(Date.now() - 1_000),
          });
          assert.equal(await pay.service.providerOperation.queueDue(), 1);
          const outbox = await pay.model.outboxEvent.get({
            paymentSessionId: started.id,
            eventType: 'payment.outcome.v1',
          });
          assert.equal((await pay.model.paymentSession.getById(started.id))?.state, 'succeeded');
          assert.ok(outbox);
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
          assert.equal(
            (await app.scope('commerce-trade').model.order.getById(fixture.orderId!))?.state,
            'paid',
          );
          assert.equal(state.calls.filter(call => call.kind === 'captureOrder').length, 2);
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });

  it('verifies a PayPal capture webhook and creates one durable payment outcome', async () => {
    const state: IGatewayState = {
      orderStatus: 'COMPLETED',
      captureStatus: 'COMPLETED',
      refundStatus: 'PENDING',
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          const resolvedPaypalOptions = app.bean.payProvider.getOptions(
            'pay-paypal:paypal',
            'default',
          ) as any;
          assert.equal(resolvedPaypalOptions.secretCredential?.clientId, 'client-test');
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const session = await pay.model.paymentSession.getById(fixture.paymentSessionId!);
          assert.ok(session);
          state.providerCorrelationReference = session.providerCorrelationReference;
          state.providerInvoiceReference = session.providerInvoiceReference;
          state.orderId = `paypal-order-${session.providerCorrelationReference}`;
          state.captureId = `paypal-capture-${session.id}`;
          const rawBody = JSON.stringify({
            id: `paypal-event-${session.id}`,
            event_type: 'PAYMENT.CAPTURE.COMPLETED',
            resource: {
              id: state.captureId,
              amount: { currency_code: 'USD', value: '12.99' },
              supplementary_data: { related_ids: { order_id: state.orderId } },
            },
          });
          const verified = await pay.bean.payProvider.get('pay-paypal:paypal').verifyWebhook(
            {
              rawBody,
              body: JSON.parse(rawBody),
              headers: { 'paypal-transmission-id': 'transmission-test' },
            },
            pay.bean.payProvider.getOptions('pay-paypal:paypal', 'default'),
          );
          await pay.service.webhook.receive({
            providerName: 'pay-paypal:paypal',
            clientName: 'default',
            environment: 'sandbox',
            rawBody,
            verified,
          });
          const inboxes = await pay.model.webhookInbox.select({
            where: { paymentSessionId: session.id },
          });
          assert.equal(inboxes.length, 1);
          const outboxes = await pay.model.outboxEvent.select({
            where: { paymentSessionId: session.id, eventType: 'payment.outcome.v1' },
          });
          assert.equal(outboxes.length, 1);
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outboxes[0]!.id });
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outboxes[0]!.id });
          assert.equal(
            (await app.scope('commerce-trade').model.order.getById(fixture.orderId!))?.state,
            'paid',
          );
          assert.equal(
            state.calls.filter(call => call.kind === 'verifyWebhookSignature').length,
            1,
          );
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: { state: { payProviderClientOptions: providerState(gateway) } as never } },
    );
  });

  it('settles a VOIDED PayPal cancel callback through Commerce and releases stock', async () => {
    const state: IGatewayState = {
      orderStatus: 'CREATED',
      refundStatus: 'PENDING',
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const session = await pay.model.paymentSession.getById(fixture.paymentSessionId!);
          assert.ok(session);
          const started = await pay.service.paymentSession.start(session.id);
          state.orderStatus = 'VOIDED';
          const cancelUrl = await callbackToken(started.id as number, 'cancel');
          const cancelState = new URL(cancelUrl).searchParams.get('state');
          assert.ok(cancelState);
          await assert.rejects(
            app.bean.executor.performAction('get', '/pay/payment-callback/cancel', {
              query: { state: cancelState },
              extraData: providerExtraData(gateway),
            }),
            { status: 302 },
          );
          const operation = await pay.model.providerOperation.get({
            paymentSessionId: started.id,
            kind: 'query',
          });
          assert.equal(operation?.state, 'succeeded');
          const outbox = await pay.model.outboxEvent.get({
            paymentSessionId: started.id,
            eventType: 'payment.outcome.v1',
          });
          assert.ok(outbox);
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
          const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
          const attempt = await app
            .scope('commerce-payment')
            .model.paymentAttempt.getById(fixture.paymentAttemptId!);
          const line = await app
            .scope('commerce-trade')
            .model.orderLine.get({ orderId: fixture.orderId! });
          assert.equal(order?.state, 'cancelled');
          assert.equal(attempt?.state, 'cancelled');
          assert.equal(
            (
              await app
                .scope('commerce-trade')
                .model.stockReservation.get({ orderLineId: line!.id })
            )?.state,
            'released',
          );
          assert.equal(state.calls.filter(call => call.kind === 'getOrder').length, 1);
          assert.equal(state.calls.filter(call => call.kind === 'captureOrder').length, 0);
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });

  it('keeps a PayPal cancel callback nonterminal while the order remains CREATED', async () => {
    const state: IGatewayState = {
      orderStatus: 'CREATED',
      refundStatus: 'PENDING',
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const session = await pay.model.paymentSession.getById(fixture.paymentSessionId!);
          assert.ok(session);
          const started = await pay.service.paymentSession.start(session.id);
          const cancelUrl = await callbackToken(started.id as number, 'cancel');
          const cancelState = new URL(cancelUrl).searchParams.get('state');
          assert.ok(cancelState);
          await assert.rejects(
            app.bean.executor.performAction('get', '/pay/payment-callback/cancel', {
              query: { state: cancelState },
              extraData: providerExtraData(gateway),
            }),
            { status: 302 },
          );
          const reconciled = await pay.model.paymentSession.getById(started.id);
          assert.equal(reconciled?.state, 'requires_action');
          assert.deepEqual(reconciled?.nextAction, {
            kind: 'redirect',
            url: `https://sandbox.paypal.test/${state.orderId}`,
          });
          assert.equal(
            (await app.scope('commerce-trade').model.order.getById(fixture.orderId!))?.state,
            'awaiting_payment',
          );
          assert.equal(
            (
              await app
                .scope('commerce-payment')
                .model.paymentAttempt.getById(fixture.paymentAttemptId!)
            )?.state,
            'created',
          );
          assert.equal(
            (await pay.model.outboxEvent.get({
              paymentSessionId: started.id,
              eventType: 'payment.outcome.v1',
            })) as any,
            undefined,
          );
          assert.equal(state.calls.filter(call => call.kind === 'getOrder').length, 1);
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });

  it('keeps a pending PayPal cancel callback in durable reconciliation', async () => {
    const state: IGatewayState = {
      orderStatus: 'CREATED',
      captureId: 'paypal-capture-pending',
      captureStatus: 'PENDING',
      refundStatus: 'PENDING',
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const started = await pay.service.paymentSession.start(fixture.paymentSessionId!);
          const cancelState = new URL(
            await callbackToken(started.id as number, 'cancel'),
          ).searchParams.get('state');
          assert.ok(cancelState);
          await assert.rejects(
            app.bean.executor.performAction('get', '/pay/payment-callback/cancel', {
              query: { state: cancelState },
              extraData: providerExtraData(gateway),
            }),
            { status: 302 },
          );
          const reconciled = await pay.model.paymentSession.getById(started.id);
          const operation = await pay.model.providerOperation.get({
            paymentSessionId: started.id,
            kind: 'query',
          });
          assert.equal(reconciled?.state, 'processing');
          assert.equal(reconciled?.nextAction, undefined);
          assert.equal(operation?.state, 'reconciliation_required');
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
          assert.equal(state.calls.filter(call => call.kind === 'getOrder').length, 1);
          assert.equal(state.calls.filter(call => call.kind === 'captureOrder').length, 0);
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });

  it('rejects invalid PayPal callback state before provider or durable mutation', async () => {
    const state: IGatewayState = {
      orderStatus: 'CREATED',
      refundStatus: 'PENDING',
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const session = await pay.model.paymentSession.getById(fixture.paymentSessionId!);
          assert.ok(session);
          const started = await pay.service.paymentSession.start(session.id);
          const returnUrl = await callbackToken(started.id as number, 'return');
          const token = new URL(returnUrl).searchParams.get('state');
          assert.ok(token);
          const unsafeState = await app.bean.jwt.get('oauthstate').sign(
            {
              paymentSessionId: started.id,
              providerName: started.providerName,
              clientName: started.clientName,
              environment: started.environment,
              purpose: 'cancel',
              continuationPath: '//untrusted.example/providerResult=cancel',
            },
            { path: '/pay/payment-callback/cancel', expiresIn: '15m' },
          );
          await assert.rejects(
            app.bean.executor.performAction('get', '/pay/payment-callback/cancel', {
              query: { state: unsafeState },
              extraData: providerExtraData(gateway),
            }),
            { status: 401 },
          );
          await assert.rejects(
            app.bean.executor.performAction('get', '/pay/payment-callback/cancel', {
              query: { state: token },
              extraData: providerExtraData(gateway),
            }),
            { status: 401 },
          );
          assert.equal(state.calls.filter(call => call.kind === 'getOrder').length, 0);
          assert.equal(
            (await pay.model.providerOperation.select({ where: { paymentSessionId: started.id } }))
              .length,
            1,
          );
          assert.equal(
            (await pay.model.outboxEvent.select({ where: { paymentSessionId: started.id } }))
              .length,
            0,
          );
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });

  it('forwards raw PayPal webhook body and headers through the controller', async () => {
    const state: IGatewayState = {
      orderStatus: 'COMPLETED',
      captureStatus: 'COMPLETED',
      refundStatus: 'PENDING',
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const session = await pay.model.paymentSession.getById(fixture.paymentSessionId!);
          assert.ok(session);
          state.providerCorrelationReference = session.providerCorrelationReference;
          state.providerInvoiceReference = session.providerInvoiceReference;
          state.orderId = `paypal-order-${session.providerCorrelationReference}`;
          state.captureId = `paypal-capture-${session.id}`;
          const rawBody = JSON.stringify({
            id: `paypal-controller-event-${session.id}`,
            event_type: 'PAYMENT.CAPTURE.COMPLETED',
            resource: {
              id: state.captureId,
              amount: { currency_code: 'USD', value: '12.99' },
              supplementary_data: { related_ids: { order_id: state.orderId } },
            },
          });
          const headers = {
            'paypal-transmission-id': 'controller-transmission-test',
            'content-type': 'application/json',
          };
          app.ctx.request.rawBody = rawBody;
          app.ctx.req.headers = { ...app.ctx.req.headers, ...headers };
          const controller = app.bean._getBean('a-pay.controller.webhook' as never) as any;
          const result = await controller.receive(
            'pay-paypal:paypal',
            'default',
            JSON.parse(rawBody),
          );
          assert.deepEqual(result, { accepted: true });
          const verifyCall = state.calls.find(
            call => call.kind === 'verifyWebhookSignature',
          ) as any;
          assert.equal(verifyCall.input.rawBody, rawBody);
          assert.deepEqual(verifyCall.input.body, JSON.parse(rawBody));
          assert.equal(
            verifyCall.input.headers['paypal-transmission-id'],
            headers['paypal-transmission-id'],
          );
          const outbox = await pay.model.outboxEvent.get({
            paymentSessionId: session.id,
            eventType: 'payment.outcome.v1',
          });
          assert.ok(outbox);
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
          assert.equal(
            (await app.scope('commerce-trade').model.order.getById(fixture.orderId!))?.state,
            'paid',
          );
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });

  it('executes a PayPal refund and settles Commerce through one refund outbox event', async () => {
    const state: IGatewayState = {
      orderStatus: 'COMPLETED',
      captureStatus: 'COMPLETED',
      refundStatus: 'COMPLETED',
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          const resolvedPaypalOptions = app.bean.payProvider.getOptions(
            'pay-paypal:paypal',
            'default',
          ) as any;
          assert.equal(resolvedPaypalOptions.secretCredential?.clientId, 'client-test');
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const session = await pay.model.paymentSession.getById(fixture.paymentSessionId!);
          assert.ok(session);
          state.providerCorrelationReference = session.providerCorrelationReference;
          state.providerInvoiceReference = session.providerInvoiceReference;
          state.orderId = `paypal-order-${session.providerCorrelationReference}`;
          state.captureId = `paypal-capture-${session.id}`;
          await pay.model.paymentSession.updateById(session.id, {
            state: 'succeeded',
            providerOrderId: state.orderId,
            providerCaptureId: state.captureId,
            finalizedAt: new Date(),
          });
          await app.scope('commerce-trade').service.order.settlePaymentFromProvider({
            eventId: `paypal-paid-${session.id}`,
            paymentSessionId: session.id,
            businessReference: String(fixture.paymentAttemptId),
            providerName: 'pay-paypal:paypal',
            state: 'succeeded',
            providerCaptureId: state.captureId,
            amountMinor: 1299,
            currency: 'USD',
          });
          const refund = await pay.service.refundOperation.create({
            paymentSessionId: session.id,
            businessReference: `refund-${fixture.orderId}`,
            amountMinor: 500,
            currency: 'USD',
            idempotencyKey: `paypal-refund-${session.id}`,
            correlationId: `paypal-refund-correlation-${session.id}`,
          });
          state.refundProviderCorrelationReference = refund.providerCorrelationReference;
          state.refundProviderInvoiceReference = refund.providerInvoiceReference;
          await pay.service.refundOperation.submit(refund.id);
          const outbox = await pay.model.outboxEvent.get({
            refundOperationId: refund.id,
            eventType: 'refund.outcome.v1',
          });
          assert.ok(outbox);
          const refundProviderOperation = await pay.model.providerOperation.get({
            refundOperationId: refund.id,
            kind: 'refund',
          });
          assert.match(
            refundProviderOperation?.idempotencyKey ?? '',
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
          );
          assert.equal(
            refundProviderOperation?.providerRequestId,
            refundProviderOperation?.idempotencyKey,
          );
          const refundCall = state.calls.find(call => call.kind === 'refundCapturedPayment') as any;
          assert.equal(refundCall.input.paypalRequestId, refundProviderOperation?.idempotencyKey);
          assert.deepEqual(refundCall.input.body, {
            amount: { currencyCode: 'USD', value: '5.00' },
            customId: refund.providerCorrelationReference,
            invoiceId: refund.providerInvoiceReference,
          });
          assert.notEqual(refund.providerCorrelationReference, String(refund.id));
          assert.notEqual(refund.providerInvoiceReference, refund.businessReference);
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outbox.id });
          assert.equal((await pay.model.refundOperation.getById(refund.id))?.state, 'succeeded');
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: { state: { payProviderClientOptions: providerState(gateway) } as never } },
    );
  });

  it('settles a capture-refunded webhook with an alternate refund resource ID through Commerce', async () => {
    const state: IGatewayState = {
      orderStatus: 'COMPLETED',
      captureStatus: 'COMPLETED',
      refundStatus: 'COMPLETED',
      refundError: new Error('response lost after refund submission'),
      captureLookupError: paypalApiError(404),
      refundAmount: '12.99',
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const session = await pay.model.paymentSession.getById(fixture.paymentSessionId!);
          assert.ok(session);
          state.providerCorrelationReference = session.providerCorrelationReference;
          state.providerInvoiceReference = session.providerInvoiceReference;
          state.orderId = `paypal-order-${session.providerCorrelationReference}`;
          state.captureId = `paypal-capture-${session.id}`;
          await pay.model.paymentSession.updateById(session.id, {
            state: 'succeeded',
            providerOrderId: state.orderId,
            providerCaptureId: state.captureId,
            finalizedAt: new Date(),
          });
          await app.scope('commerce-trade').service.order.settlePaymentFromProvider({
            eventId: `paypal-paid-${session.id}`,
            paymentSessionId: session.id,
            businessReference: String(fixture.paymentAttemptId),
            providerName: 'pay-paypal:paypal',
            state: 'succeeded',
            providerCaptureId: state.captureId,
            amountMinor: 1299,
            currency: 'USD',
          });
          const order = app.scope('commerce-trade').service.order;
          await order.requestRefund(fixture.orderId!, {
            reason: 'PayPal capture-refunded webhook',
            idempotencyKey: `paypal-webhook-request-${session.id}`,
          });
          await app.bean.passport.signout();
          await app.bean.passport.signinMock();
          await order.approveRefund(fixture.orderId!, {
            reason: 'approved for provider submission',
            idempotencyKey: `paypal-webhook-approve-${session.id}`,
          });
          const executed = await order.executeRefund(fixture.orderId!);
          const refundOperation = await pay.model.refundOperation.getById(
            executed.refundOperationId!,
          );
          assert.ok(refundOperation);
          state.refundProviderCorrelationReference = refundOperation.providerCorrelationReference;
          state.refundProviderInvoiceReference = refundOperation.providerInvoiceReference;
          state.refundId = `paypal-refund-${refundOperation.providerCorrelationReference}`;
          const rawBody = JSON.stringify({
            id: `paypal-capture-refunded-${session.id}`,
            event_type: 'PAYMENT.CAPTURE.REFUNDED',
            resource: {
              id: state.refundId,
              amount: { currency_code: 'USD', value: '12.99' },
              status: 'REFUNDED',
              supplementary_data: { related_ids: { capture_id: state.captureId } },
            },
          });
          const verified = await pay.bean.payProvider.get('pay-paypal:paypal').verifyWebhook(
            {
              rawBody,
              body: JSON.parse(rawBody),
              headers: { 'paypal-transmission-id': 'webhook-refunded-test' },
            },
            pay.bean.payProvider.getOptions('pay-paypal:paypal', 'default'),
          );
          assert.equal(verified.refundOperationId, executed.refundOperationId);
          await pay.service.webhook.receive({
            providerName: 'pay-paypal:paypal',
            clientName: 'default',
            environment: 'sandbox',
            rawBody,
            verified,
          });
          await pay.service.webhook.receive({
            providerName: 'pay-paypal:paypal',
            clientName: 'default',
            environment: 'sandbox',
            rawBody,
            verified,
          });
          const outboxes = await pay.model.outboxEvent.select({
            where: {
              refundOperationId: executed.refundOperationId,
              eventType: 'refund.outcome.v1',
            },
          });
          assert.equal(outboxes.length, 1);
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outboxes[0]!.id });
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outboxes[0]!.id });
          const [settledOrder, request, attempt, reservation] = await Promise.all([
            app.scope('commerce-trade').model.order.getById(fixture.orderId!),
            app.scope('commerce-payment').model.refundRequest.getById(executed.refundRequestId!),
            app.scope('commerce-payment').model.refundAttempt.getById(executed.refundAttemptId!),
            app.scope('commerce-trade').model.stockReservation.get({
              orderLineId: (await app
                .scope('commerce-trade')
                .model.orderLine.get({ orderId: fixture.orderId! }))!.id,
            }),
          ]);
          assert.deepEqual(
            [settledOrder?.state, request?.state, attempt?.state, reservation?.state],
            ['refunded', 'refunded', 'succeeded', 'restored'],
          );
          assert.equal(state.calls.filter(call => call.kind === 'refundCapturedPayment').length, 1);
          assert.equal(state.calls.filter(call => call.kind === 'getCapturedPayment').length, 1);
          assert.equal(state.calls.filter(call => call.kind === 'getRefund').length, 1);
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });

  it('settles a definitive PayPal refund rejection through Commerce without restoring stock', async () => {
    const state: IGatewayState = {
      orderStatus: 'COMPLETED',
      captureStatus: 'COMPLETED',
      refundStatus: 'PENDING',
      refundError: paypalApiError(422),
      calls: [],
    };
    const gateway = createGateway(state);
    await app.bean.executor.mockCtx(
      async () => {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createCheckout(randomUUID().slice(0, 12)), {});
          const pay = app.scope('a-pay');
          const session = await pay.model.paymentSession.getById(fixture.paymentSessionId!);
          assert.ok(session);
          state.providerCorrelationReference = session.providerCorrelationReference;
          state.providerInvoiceReference = session.providerInvoiceReference;
          state.orderId = `paypal-order-${session.providerCorrelationReference}`;
          state.captureId = `paypal-capture-${session.id}`;
          await pay.model.paymentSession.updateById(session.id, {
            state: 'succeeded',
            providerOrderId: state.orderId,
            providerCaptureId: state.captureId,
            finalizedAt: new Date(),
          });
          await app.scope('commerce-trade').service.order.settlePaymentFromProvider({
            eventId: `paypal-paid-${session.id}`,
            paymentSessionId: session.id,
            businessReference: String(fixture.paymentAttemptId),
            providerName: 'pay-paypal:paypal',
            state: 'succeeded',
            providerCaptureId: state.captureId,
            amountMinor: 1299,
            currency: 'USD',
          });
          const order = app.scope('commerce-trade').service.order;
          await order.requestRefund(fixture.orderId!, {
            reason: 'PayPal rejected refund',
            idempotencyKey: `paypal-reject-request-${session.id}`,
          });
          await app.bean.passport.signout();
          await app.bean.passport.signinMock();
          const approved = await order.approveRefund(fixture.orderId!, {
            reason: 'approved for provider submission',
            idempotencyKey: `paypal-reject-approve-${session.id}`,
          });
          const executed = await order.executeRefund(fixture.orderId!);
          assert.deepEqual(
            [executed.orderState, executed.refundState, executed.refundAttemptState],
            ['refund_approved', 'approved', 'created'],
          );
          const [refund, providerOperation, outboxes] = await Promise.all([
            pay.model.refundOperation.getById(executed.refundOperationId!),
            pay.model.providerOperation.get({
              refundOperationId: executed.refundOperationId,
              kind: 'refund',
            }),
            pay.model.outboxEvent.select({
              where: {
                refundOperationId: executed.refundOperationId,
                eventType: 'refund.outcome.v1',
              },
            }),
          ]);
          assert.deepEqual([refund?.state, refund?.providerRefundId], ['failed', null]);
          assert.deepEqual(
            [
              providerOperation?.state,
              providerOperation?.errorCode,
              providerOperation?.errorSummary,
            ],
            ['succeeded', null, null],
          );
          assert.equal(outboxes.length, 1);
          assert.equal(outboxes[0]?.payload.state, 'failed');
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outboxes[0]!.id });
          await pay.queue.outboxDispatch.pushAsync({ outboxEventId: outboxes[0]!.id });
          const [settledOrder, request, attempt, line, balance] = await Promise.all([
            app.scope('commerce-trade').model.order.getById(fixture.orderId!),
            app.scope('commerce-payment').model.refundRequest.getById(executed.refundRequestId!),
            app.scope('commerce-payment').model.refundAttempt.getById(executed.refundAttemptId!),
            app.scope('commerce-trade').model.orderLine.get({ orderId: fixture.orderId! }),
            app.scope('commerce-trade').model.stockBalance.getById(fixture.balanceId!),
          ]);
          const reservation = await app
            .scope('commerce-trade')
            .model.stockReservation.get({ orderLineId: line!.id });
          const audits = await app
            .scope('commerce-trade')
            .model.orderAudit.select({ where: { orderId: fixture.orderId } });
          assert.deepEqual(
            [settledOrder?.state, request?.state, attempt?.state, reservation?.state],
            ['paid', 'failed', 'failed', 'consumed'],
          );
          assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [0, 0, 0]);
          assert.equal(audits.filter(item => item.operation === 'refund_failed').length, 1);
          assert.equal(state.calls.filter(call => call.kind === 'refundCapturedPayment').length, 1);
          assert.ok(approved.refundAttemptId);
        } finally {
          await cleanup(fixture);
          await app.bean.passport.signout();
        }
      },
      { extraData: providerExtraData(gateway) },
    );
  });
});
