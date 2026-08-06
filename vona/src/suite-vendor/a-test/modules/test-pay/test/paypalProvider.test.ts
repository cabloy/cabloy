import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('paypalProvider.test.ts', { concurrency: false }, () => {
  it('maps SDK camelCase payment and refund facts through the PayPal gateway', async () => {
    await app.bean.executor.mockCtx(async () => {
      const calls: Array<{ kind: string; input: unknown }> = [];
      const gateway = {
        async createOrder(_options: unknown, input: unknown) {
          calls.push({ kind: 'createOrder', input });
          return {
            id: 'order-1',
            links: [
              { rel: 'approve', href: 'https://www.sandbox.paypal.com/checkoutnow?token=order-1' },
            ],
          };
        },
        async captureOrder() {
          throw new Error('unexpected captureOrder');
        },
        async getOrder(_options: unknown, input: unknown) {
          calls.push({ kind: 'getOrder', input });
          return {
            id: 'order-1',
            purchaseUnits: [
              {
                customId: '101',
                invoiceId: 'business-1',
                amount: { currencyCode: 'USD', value: '12.99' },
                payee: { merchantId: 'merchant-1' },
                payments: {
                  captures: [
                    {
                      id: 'capture-1',
                      status: 'COMPLETED',
                      amount: { currencyCode: 'USD', value: '12.99' },
                    },
                  ],
                },
              },
            ],
          };
        },
        async refundCapturedPayment(_options: unknown, input: unknown) {
          calls.push({ kind: 'refundCapturedPayment', input });
          return {
            id: 'refund-1',
            customId: '201',
            invoiceId: 'refund-business-1',
            amount: { currencyCode: 'USD', value: '5.00' },
            status: 'COMPLETED',
            payee: { merchantId: 'merchant-1' },
          };
        },
        async getRefund() {
          throw new Error('unexpected getRefund');
        },
        async verifyWebhookSignature() {
          throw new Error('unexpected verifyWebhookSignature');
        },
      };
      const { provider, clientOptions } = app.bean.payProvider.resolveByName(
        'pay-paypal:paypal',
        'default',
      );
      const options = {
        ...clientOptions,
        secretCredential: { clientId: 'client-1', clientSecret: 'secret-1' },
        webhookId: 'webhook-1',
        merchantReference: 'merchant-1',
        gateway,
      };
      const paymentInput = {
        paymentSessionId: 101,
        businessReference: 'business-1',
        idempotencyKey: 'payment-key',
        amountMinor: 1299,
        currency: 'USD',
        providerOrderId: 'order-1',
      };
      const payment = await provider.queryPayment(paymentInput, options as never);
      assert.deepEqual(payment, {
        state: 'succeeded',
        providerPaymentId: 'order-1',
        providerOrderId: 'order-1',
        providerCaptureId: 'capture-1',
        nextAction: { kind: 'completed' },
      });
      const refund = await provider.createRefund(
        {
          paymentSessionId: 101,
          refundOperationId: 201,
          businessReference: 'refund-business-1',
          idempotencyKey: 'refund-key',
          amountMinor: 500,
          currency: 'USD',
          providerCaptureId: 'capture-1',
        },
        options as never,
      );
      assert.deepEqual(refund, { state: 'succeeded', providerRefundId: 'refund-1' });
      assert.deepEqual(
        calls.map(item => item.kind),
        ['getOrder', 'refundCapturedPayment'],
      );
      assert.deepEqual(calls[1]?.input, {
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
});
