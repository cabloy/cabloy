import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

function createOptions(gateway: Record<string, unknown>) {
  const { clientOptions } = app.bean.payProvider.resolveByName('pay-stripe:stripe', 'default');
  return {
    ...clientOptions,
    secretCredential: 'sk_test_1',
    secretWebhook: 'whsec_1',
    gateway,
  } as never;
}

const paymentInput = {
  paymentSessionId: 101,
  businessReference: 'business-1',
  providerInvoiceReference: 'payment-invoice-reference',
  providerCorrelationReference: 'payment-correlation-reference',
  idempotencyKey: 'payment-key',
  amountMinor: 1299,
  currency: 'USD',
  providerOrderId: 'cs_1',
};

const refundInput = {
  paymentSessionId: 101,
  refundOperationId: 201,
  businessReference: 'refund-business-1',
  providerInvoiceReference: 'refund-invoice-reference',
  providerCorrelationReference: 'refund-correlation-reference',
  idempotencyKey: 'refund-key',
  amountMinor: 500,
  currency: 'USD',
  providerCaptureId: 'pi_1',
};

function checkoutSession(overrides: Record<string, unknown> = {}) {
  return {
    id: 'cs_1',
    amount_total: 1299,
    currency: 'usd',
    livemode: false,
    status: 'open',
    payment_status: 'unpaid',
    url: 'https://checkout.stripe.test/c/pay/cs_1',
    client_reference_id: 'payment-correlation-reference',
    metadata: {
      paymentSessionId: '101',
      providerCorrelationReference: 'payment-correlation-reference',
      providerInvoiceReference: 'payment-invoice-reference',
    },
    ...overrides,
  };
}

function paymentIntent(status: string, overrides: Record<string, unknown> = {}) {
  return {
    id: 'pi_1',
    amount: 1299,
    currency: 'usd',
    status,
    metadata: {
      paymentSessionId: '101',
      providerCorrelationReference: 'payment-correlation-reference',
      providerInvoiceReference: 'payment-invoice-reference',
    },
    ...overrides,
  };
}

function refundRecord(status: string, overrides: Record<string, unknown> = {}) {
  return {
    id: 're_1',
    amount: 500,
    currency: 'usd',
    payment_intent: 'pi_1',
    status,
    metadata: {
      paymentSessionId: '101',
      refundOperationId: '201',
      providerCorrelationReference: 'refund-correlation-reference',
      providerInvoiceReference: 'refund-invoice-reference',
    },
    ...overrides,
  };
}

describe('stripeProvider.test.ts', { concurrency: false }, () => {
  it('creates a hosted Checkout Session with durable references and redirect action', async () => {
    await app.bean.executor.mockCtx(async () => {
      const calls: unknown[] = [];
      const gateway = {
        async createCheckoutSession(_options: unknown, input: unknown) {
          calls.push(input);
          return checkoutSession();
        },
      };
      const { provider } = app.bean.payProvider.resolveByName('pay-stripe:stripe', 'default');
      const payment = await provider.startPayment(
        {
          ...paymentInput,
          providerOrderId: undefined,
          returnUrl: 'https://shop.test/pay/return',
          cancelUrl: 'https://shop.test/pay/cancel',
        },
        createOptions(gateway),
      );

      assert.deepEqual(payment, {
        state: 'requires_action',
        providerPaymentId: 'cs_1',
        providerOrderId: 'cs_1',
        nextAction: {
          kind: 'redirect',
          url: 'https://checkout.stripe.test/c/pay/cs_1',
        },
      });
      assert.deepEqual(calls, [
        {
          idempotencyKey: 'payment-key',
          body: {
            mode: 'payment',
            success_url: 'https://shop.test/pay/return',
            cancel_url: 'https://shop.test/pay/cancel',
            client_reference_id: 'payment-correlation-reference',
            metadata: {
              paymentSessionId: '101',
              providerCorrelationReference: 'payment-correlation-reference',
              providerInvoiceReference: 'payment-invoice-reference',
            },
            payment_intent_data: {
              metadata: {
                paymentSessionId: '101',
                providerCorrelationReference: 'payment-correlation-reference',
                providerInvoiceReference: 'payment-invoice-reference',
              },
            },
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency: 'usd',
                  unit_amount: 1299,
                  product_data: { name: 'Payment payment-invoice-reference' },
                },
              },
            ],
          },
        },
      ]);
    });
  });

  it('maps Checkout and PaymentIntent facts without trusting conflicting resources', async () => {
    await app.bean.executor.mockCtx(async () => {
      let result: unknown = checkoutSession({
        payment_intent: paymentIntent('succeeded'),
      });
      const gateway = {
        async retrieveCheckoutSession() {
          return result;
        },
      };
      const { provider } = app.bean.payProvider.resolveByName('pay-stripe:stripe', 'default');
      const options = createOptions(gateway);

      const payment = await provider.queryPayment(paymentInput, options);
      assert.deepEqual(payment, {
        state: 'succeeded',
        providerPaymentId: 'pi_1',
        providerOrderId: 'cs_1',
        providerCaptureId: 'pi_1',
        nextAction: { kind: 'completed' },
      });
      result = checkoutSession({ amount_total: 1399 });
      await assert.rejects(provider.queryPayment(paymentInput, options), {
        status: 409,
      });
    });
  });

  it('maps full and partial Stripe refunds and preserves ambiguous failures', async () => {
    await app.bean.executor.mockCtx(async () => {
      let status = 'succeeded';
      let error: Error | undefined;
      const gateway = {
        async createRefund(_options: unknown, input: unknown) {
          if (error) {
            throw new Error(`Stripe gateway failed: ${error.message}`, {
              cause: error,
            });
          }
          assert.deepEqual(input, {
            idempotencyKey: 'refund-key',
            body: {
              payment_intent: 'pi_1',
              amount: 500,
              metadata: {
                paymentSessionId: '101',
                refundOperationId: '201',
                providerCorrelationReference: 'refund-correlation-reference',
                providerInvoiceReference: 'refund-invoice-reference',
              },
            },
          });
          return refundRecord(status);
        },
        async retrieveRefund() {
          return refundRecord(status);
        },
      };
      const { provider } = app.bean.payProvider.resolveByName('pay-stripe:stripe', 'default');
      const options = createOptions(gateway);
      for (const [nextStatus, state] of [
        ['succeeded', 'succeeded'],
        ['pending', 'pending'],
        ['failed', 'failed'],
        ['canceled', 'cancelled'],
      ] as const) {
        status = nextStatus;
        assert.equal((await provider.createRefund(refundInput, options)).state, state);
        assert.equal(
          (await provider.queryRefund!({ ...refundInput, providerRefundId: 're_1' }, options))
            .state,
          state,
        );
      }
      error = new Error('transport failure');
      await assert.rejects(provider.createRefund(refundInput, options), /transport failure/);
    });
  });

  it('maps signed terminal Stripe webhook facts through its gateway', async () => {
    await app.bean.executor.mockCtx(async () => {
      const gateway = {
        async constructWebhookEvent(_options: unknown, input: unknown) {
          assert.deepEqual(input, {
            rawBody: '{"id":"evt_1"}',
            body: {},
            headers: { 'stripe-signature': 'sig' },
          });
          return {
            id: 'evt_1',
            type: 'checkout.session.async_payment_failed',
            data: { object: checkoutSession() },
          };
        },
      };
      const pay = app.scope('a-pay');
      const originalGet = pay.model.paymentSession.get;
      (pay.model.paymentSession as any).get = async () => ({
        ...paymentInput,
        id: 101,
        providerOrderId: 'cs_1',
      });
      try {
        const { provider } = app.bean.payProvider.resolveByName('pay-stripe:stripe', 'default');
        const verified = await provider.verifyWebhook(
          {
            rawBody: '{"id":"evt_1"}',
            body: {},
            headers: { 'stripe-signature': 'sig' },
          },
          createOptions(gateway),
        );
        assert.equal(verified.paymentSessionId, 101);
        assert.equal(verified.payment?.state, 'failed');
      } finally {
        (pay.model.paymentSession as any).get = originalGet;
      }
    });
  });
});
