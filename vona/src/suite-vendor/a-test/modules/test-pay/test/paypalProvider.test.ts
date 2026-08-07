import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

function createOptions(gateway: Record<string, unknown>) {
  const { clientOptions } = app.bean.payProvider.resolveByName('pay-paypal:paypal', 'default');
  return {
    ...clientOptions,
    secretCredential: { clientId: 'client-1', clientSecret: 'secret-1' },
    webhookId: 'webhook-1',
    merchantReference: 'merchant-1',
    gateway,
  } as never;
}

function orderRecord(
  status: string,
  captureStatus?: string,
  purchaseUnitOverrides: Record<string, unknown> = {},
) {
  return {
    id: 'order-1',
    status,
    purchaseUnits: [
      {
        customId: '101',
        invoiceId: 'business-1',
        amount: { currencyCode: 'USD', value: '12.99' },
        payee: { merchantId: 'merchant-1' },
        payments: captureStatus
          ? {
              captures: [
                {
                  id: 'capture-1',
                  status: captureStatus,
                  amount: { currencyCode: 'USD', value: '12.99' },
                },
              ],
            }
          : undefined,
        ...purchaseUnitOverrides,
      },
    ],
  };
}

const paymentInput = {
  paymentSessionId: 101,
  businessReference: 'business-1',
  idempotencyKey: 'payment-key',
  amountMinor: 1299,
  currency: 'USD',
  providerOrderId: 'order-1',
};

const refundInput = {
  paymentSessionId: 101,
  refundOperationId: 201,
  businessReference: 'refund-business-1',
  idempotencyKey: 'refund-key',
  amountMinor: 500,
  currency: 'USD',
  providerCaptureId: 'capture-1',
};

describe('paypalProvider.test.ts', { concurrency: false }, () => {
  it('resolves the authoritative Sandbox environment and creates an approval order', async () => {
    await app.bean.executor.mockCtx(async () => {
      const calls: Array<{ kind: string; input: unknown; options: unknown }> = [];
      const gateway = {
        async createOrder(options: unknown, input: unknown) {
          calls.push({ kind: 'createOrder', input, options });
          return {
            id: 'order-1',
            links: [
              { rel: 'approve', href: 'https://www.sandbox.paypal.com/checkoutnow?token=order-1' },
            ],
          };
        },
      };
      const { provider } = app.bean.payProvider.resolveByName('pay-paypal:paypal', 'default');
      const options = createOptions(gateway);
      const payment = await provider.startPayment(
        {
          ...paymentInput,
          providerOrderId: undefined,
          returnUrl: 'https://shop.test/pay/return',
          cancelUrl: 'https://shop.test/pay/cancel',
        },
        options,
      );

      assert.equal((options as any).environment, 'sandbox');
      assert.deepEqual(payment, {
        state: 'requires_action',
        providerPaymentId: 'order-1',
        providerOrderId: 'order-1',
        nextAction: {
          kind: 'redirect',
          url: 'https://www.sandbox.paypal.com/checkoutnow?token=order-1',
        },
      });
      assert.deepEqual(calls[0]?.input, {
        paypalRequestId: 'payment-key',
        body: {
          intent: 'CAPTURE',
          applicationContext: {
            returnUrl: 'https://shop.test/pay/return',
            cancelUrl: 'https://shop.test/pay/cancel',
          },
          purchaseUnits: [
            {
              customId: '101',
              invoiceId: 'business-1',
              amount: { currencyCode: 'USD', value: '12.99' },
            },
          ],
        },
      });
      assert.deepEqual(calls[0]?.options, {
        environment: 'sandbox',
        clientId: 'client-1',
        clientSecret: 'secret-1',
        webhookId: 'webhook-1',
      });
    });
  });

  it('rejects missing callback URLs and incomplete PayPal configuration', async () => {
    await app.bean.executor.mockCtx(async () => {
      const gateway = {
        async createOrder() {
          throw new Error('unexpected createOrder');
        },
        async getOrder() {
          throw new Error('unexpected getOrder');
        },
      };
      const { provider } = app.bean.payProvider.resolveByName('pay-paypal:paypal', 'default');
      const options = createOptions(gateway) as any;
      await assert.rejects(
        provider.startPayment({ ...paymentInput, providerOrderId: undefined }, options),
        { status: 422 },
      );
      await assert.rejects(
        provider.queryPayment(paymentInput, {
          ...options,
          secretCredential: { clientId: undefined, clientSecret: undefined },
        }),
        { status: 503 },
      );
    });
  });

  it('requests a complete PayPal capture representation', async () => {
    await app.bean.executor.mockCtx(async () => {
      const calls: unknown[] = [];
      const gateway = {
        async captureOrder(_options: unknown, input: unknown) {
          calls.push(input);
          return orderRecord('COMPLETED', 'COMPLETED');
        },
      };
      const { provider } = app.bean.payProvider.resolveByName('pay-paypal:paypal', 'default');
      const payment = await provider.confirmPayment(paymentInput, createOptions(gateway));

      assert.equal(payment.state, 'succeeded');
      assert.equal(payment.providerCaptureId, 'capture-1');
      assert.deepEqual(payment.nextAction, { kind: 'completed' });
      assert.deepEqual(calls, [
        {
          id: 'order-1',
          paypalRequestId: 'payment-key',
          prefer: 'return=representation',
        },
      ]);
    });
  });

  it('maps PayPal capture states and rejects conflicting order facts', async () => {
    await app.bean.executor.mockCtx(async () => {
      let result: unknown = orderRecord('CREATED');
      const gateway = {
        async getOrder() {
          return result;
        },
      };
      const { provider } = app.bean.payProvider.resolveByName('pay-paypal:paypal', 'default');
      const options = createOptions(gateway);

      for (const [captureStatus, state] of [
        ['COMPLETED', 'succeeded'],
        ['PENDING', 'processing'],
        ['FAILED', 'failed'],
        ['DECLINED', 'failed'],
      ] as const) {
        result = orderRecord('CREATED', captureStatus);
        const payment = await provider.queryPayment(paymentInput, options);
        assert.equal(payment.state, state);
      }
      result = orderRecord('VOIDED');
      assert.equal((await provider.queryPayment(paymentInput, options)).state, 'cancelled');
      result = orderRecord('CREATED', undefined);
      assert.equal((await provider.queryPayment(paymentInput, options)).state, 'requires_action');

      result = orderRecord('CREATED', 'COMPLETED', {
        amount: { currencyCode: 'USD', value: '13.99' },
      });
      await assert.rejects(provider.queryPayment(paymentInput, options), { status: 409 });
    });
  });

  it('maps refund statuses and preserves refund request facts', async () => {
    await app.bean.executor.mockCtx(async () => {
      const calls: unknown[] = [];
      let status = 'COMPLETED';
      function refundRecord() {
        return {
          id: 'refund-1',
          customId: '201',
          invoiceId: 'refund-business-1',
          amount: { currencyCode: 'USD', value: '5.00' },
          status,
          payee: { merchantId: 'merchant-1' },
        };
      }
      const gateway = {
        async refundCapturedPayment(_options: unknown, input: unknown) {
          calls.push(input);
          return refundRecord();
        },
        async getRefund() {
          return refundRecord();
        },
      };
      const { provider } = app.bean.payProvider.resolveByName('pay-paypal:paypal', 'default');
      const options = createOptions(gateway);
      for (const [nextStatus, state] of [
        ['COMPLETED', 'succeeded'],
        ['PENDING', 'pending'],
        ['FAILED', 'failed'],
        ['CANCELLED', 'cancelled'],
      ] as const) {
        status = nextStatus;
        assert.equal((await provider.createRefund(refundInput, options)).state, state);
        assert.equal(
          (await provider.queryRefund!({ ...refundInput, providerRefundId: 'refund-1' }, options))
            .state,
          state,
        );
      }
      assert.deepEqual(calls[0], {
        captureId: 'capture-1',
        paypalRequestId: 'refund-key',
        body: {
          amount: { currencyCode: 'USD', value: '5.00' },
          customId: '201',
          invoiceId: 'refund-business-1',
        },
      });
    });
  });

  it('passes webhook facts to the gateway and maps verified capture events', async () => {
    await app.bean.executor.mockCtx(async () => {
      const calls: unknown[] = [];
      const gateway = {
        async verifyWebhookSignature(options: unknown, input: unknown) {
          calls.push({ options, input });
        },
        async getOrder() {
          return orderRecord('COMPLETED', 'COMPLETED');
        },
      };
      const { provider } = app.bean.payProvider.resolveByName('pay-paypal:paypal', 'default');
      const options = createOptions(gateway);
      const webhookInput = {
        rawBody: '{"id":"event-1"}',
        body: {
          id: 'event-1',
          event_type: 'PAYMENT.CAPTURE.COMPLETED',
          resource: {
            id: 'capture-1',
            amount: { currency_code: 'USD', value: '12.99' },
            supplementary_data: { related_ids: { order_id: 'order-1' } },
          },
        },
        headers: { 'paypal-transmission-id': 'transmission-1' },
      };
      const verified = await provider.verifyWebhook(webhookInput, options);
      assert.equal(verified.eventId, 'event-1');
      assert.equal(verified.payment?.state, 'succeeded');
      assert.equal(verified.payment?.providerCaptureId, 'capture-1');
      assert.deepEqual(calls[0], {
        options: {
          environment: 'sandbox',
          clientId: 'client-1',
          clientSecret: 'secret-1',
          webhookId: 'webhook-1',
        },
        input: webhookInput,
      });
    });
  });
});
