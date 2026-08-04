import type {
  IDecoratorPayProviderOptions,
  IPayProviderClientOptions,
  IPayProviderClientRecord,
  IPayProviderExecute,
  IPayProviderPaymentInput,
  IPayProviderPaymentSnapshot,
  IPayProviderRefundInput,
  IPayProviderRefundSnapshot,
  IPayProviderVerifiedWebhook,
  IPayProviderWebhookInput,
} from 'vona-module-a-pay';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { BeanBase, useApp } from 'vona';
import { PayProvider } from 'vona-module-a-pay';
import { z } from 'zod';

const PaymentWebhookBodySchema = z.object({
  eventId: z.string().min(1).max(255),
  eventType: z.enum(['payment.succeeded', 'payment.failed', 'payment.cancelled']),
  paymentSessionId: z.string().min(1),
  state: z.enum(['succeeded', 'failed', 'cancelled']),
  amountMinor: z.number().int().nonnegative(),
  currency: z.string().length(3),
  providerPaymentId: z.string().min(1).max(255).optional(),
  providerCaptureId: z.string().min(1).max(255).optional(),
});

const RefundWebhookBodySchema = z.object({
  eventId: z.string().min(1).max(255),
  eventType: z.enum(['refund.pending', 'refund.succeeded', 'refund.failed', 'refund.cancelled']),
  refundOperationId: z.string().min(1),
  state: z.enum(['pending', 'succeeded', 'failed', 'cancelled']),
  amountMinor: z.number().int().positive(),
  currency: z.string().length(3),
  providerRefundId: z.string().min(1).max(255).optional(),
});

export interface IPayProviderMockClientRecord extends IPayProviderClientRecord {
  secondary: never;
}

export interface IPayProviderMockClientOptions extends IPayProviderClientOptions {
  secretCredential: string | undefined;
  secretWebhook: string | undefined;
}

const app = useApp();

export interface IPayProviderOptionsMock extends IDecoratorPayProviderOptions<
  IPayProviderMockClientRecord,
  IPayProviderMockClientOptions
> {}

@PayProvider<IPayProviderOptionsMock>({
  base: {
    capabilities: {
      redirectCheckout: false,
      embeddedCheckout: true,
      automaticCapture: true,
      manualCapture: false,
      refunds: true,
      partialRefunds: true,
      webhooks: true,
    },
  },
  clients: {
    default: {
      environment: 'sandbox',
      secretCredential: app.meta.env.PAY_MOCK_DEFAULT_CREDENTIAL,
      secretWebhook: app.meta.env.PAY_MOCK_DEFAULT_WEBHOOK,
    },
    secondary: {
      environment: 'sandbox',
      secretCredential: app.meta.env.PAY_MOCK_SECONDARY_CREDENTIAL,
      secretWebhook: app.meta.env.PAY_MOCK_SECONDARY_WEBHOOK,
    },
  },
})
export class PayProviderMock
  extends BeanBase
  implements IPayProviderExecute<IPayProviderMockClientOptions>
{
  async startPayment(
    input: IPayProviderPaymentInput,
    _clientOptions: IPayProviderMockClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    return {
      state: 'requires_action',
      providerPaymentId: `mock-payment-${input.paymentSessionId}`,
      nextAction: { kind: 'pending' },
    };
  }

  async queryPayment(
    input: IPayProviderPaymentInput,
    _clientOptions: IPayProviderMockClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    return {
      state: 'processing',
      providerPaymentId: `mock-payment-${input.paymentSessionId}`,
    };
  }

  async createRefund(
    input: IPayProviderRefundInput,
    _clientOptions: IPayProviderMockClientOptions,
  ): Promise<IPayProviderRefundSnapshot> {
    return {
      state: 'pending',
      providerRefundId: `mock-refund-${input.refundOperationId}`,
    };
  }

  async verifyWebhook(
    input: IPayProviderWebhookInput,
    clientOptions: IPayProviderMockClientOptions,
  ): Promise<IPayProviderVerifiedWebhook> {
    const signature = input.headers['x-pay-mock-signature'];
    const actual = Array.isArray(signature) ? signature[0] : signature;
    const secret = clientOptions.secretWebhook;
    const rawBody = input.rawBody;
    const expected =
      typeof secret === 'string' && secret && rawBody !== undefined
        ? createHmac('sha256', secret).update(rawBody).digest('hex')
        : undefined;
    if (!expected || !actual || !safeEqual(actual, expected)) {
      this.app.throw(401, 'mock webhook signature is invalid');
    }
    const payment = PaymentWebhookBodySchema.safeParse(input.body);
    if (payment.success) {
      const eventType = `payment.${payment.data.state}`;
      if (payment.data.eventType !== eventType)
        this.app.throw(400, 'mock webhook event type is invalid');
      return {
        eventId: payment.data.eventId,
        eventType,
        paymentSessionId: payment.data.paymentSessionId,
        payment: {
          state: payment.data.state,
          providerPaymentId: payment.data.providerPaymentId,
          providerCaptureId: payment.data.providerCaptureId,
        },
        summary: {
          amountMinor: payment.data.amountMinor,
          currency: payment.data.currency,
        },
      };
    }
    const refund = RefundWebhookBodySchema.safeParse(input.body);
    if (!refund.success) this.app.throw(400, 'mock webhook is invalid');
    const eventType = `refund.${refund.data.state}`;
    if (refund.data.eventType !== eventType)
      this.app.throw(400, 'mock webhook event type is invalid');
    return {
      eventId: refund.data.eventId,
      eventType,
      refundOperationId: refund.data.refundOperationId,
      refund: {
        state: refund.data.state,
        providerRefundId: refund.data.providerRefundId,
      },
      summary: {
        amountMinor: refund.data.amountMinor,
        currency: refund.data.currency,
      },
    };
  }
}

function safeEqual(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
  );
}
