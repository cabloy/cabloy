import type {
  IDecoratorPayProviderOptions,
  IPayProviderCapabilities,
  IPayProviderExecute,
  IPayProviderPaymentInput,
  IPayProviderPaymentSnapshot,
  IPayProviderRefundInput,
  IPayProviderRefundSnapshot,
  IPayProviderVerifiedWebhook,
  IPayProviderWebhookInput,
} from 'vona-module-a-pay';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { BeanBase } from 'vona';
import { PayProvider } from 'vona-module-a-pay';
import { z } from 'zod';

const WebhookBodySchema = z.object({
  eventId: z.string().min(1).max(255),
  eventType: z.enum(['payment.succeeded', 'payment.failed', 'payment.cancelled']),
  paymentSessionId: z.string().min(1),
  state: z.enum(['succeeded', 'failed', 'cancelled']),
  amountMinor: z.number().int().nonnegative(),
  currency: z.string().length(3),
  providerPaymentId: z.string().min(1).max(255).optional(),
  providerCaptureId: z.string().min(1).max(255).optional(),
});

export interface IPayProviderMockClientRecord {
  default: never;
}

export interface IPayProviderMockClientOptions {
  environment: 'sandbox' | 'live';
  credentialRef: string;
}

export interface IPayProviderOptionsMock extends IDecoratorPayProviderOptions<
  IPayProviderMockClientRecord,
  IPayProviderMockClientOptions
> {}

@PayProvider<IPayProviderOptionsMock>({
  clients: {
    default: {
      environment: 'sandbox',
      credentialRef: 'env://PAY_MOCK',
    },
  },
})
export class PayProviderMock extends BeanBase implements IPayProviderExecute {
  getCapabilities(): IPayProviderCapabilities {
    return {
      redirectCheckout: false,
      embeddedCheckout: true,
      automaticCapture: true,
      manualCapture: false,
      refunds: true,
      partialRefunds: true,
      webhooks: true,
    };
  }

  async startPayment(input: IPayProviderPaymentInput): Promise<IPayProviderPaymentSnapshot> {
    return {
      state: 'requires_action',
      providerPaymentId: `mock-payment-${input.paymentSessionId}`,
      nextAction: { kind: 'pending' },
    };
  }

  async queryPayment(input: IPayProviderPaymentInput): Promise<IPayProviderPaymentSnapshot> {
    return {
      state: 'processing',
      providerPaymentId: `mock-payment-${input.paymentSessionId}`,
    };
  }

  async createRefund(input: IPayProviderRefundInput): Promise<IPayProviderRefundSnapshot> {
    return {
      state: 'pending',
      providerRefundId: `mock-refund-${input.refundOperationId}`,
    };
  }

  async verifyWebhook(input: IPayProviderWebhookInput): Promise<IPayProviderVerifiedWebhook> {
    const signature = input.headers['x-pay-mock-signature'];
    const actual = Array.isArray(signature) ? signature[0] : signature;
    const secret = process.env.PAY_MOCK_WEBHOOK_SECRET;
    const rawBody = input.rawBody;
    const expected =
      secret && rawBody !== undefined
        ? createHmac('sha256', secret).update(rawBody).digest('hex')
        : undefined;
    if (!expected || !actual || !safeEqual(actual, expected)) {
      this.app.throw(401, 'mock webhook signature is invalid');
    }
    const body = WebhookBodySchema.safeParse(input.body);
    if (!body.success) this.app.throw(400, 'mock webhook is invalid');
    const eventType = `payment.${body.data.state}`;
    if (body.data.eventType !== eventType)
      this.app.throw(400, 'mock webhook event type is invalid');
    return {
      eventId: body.data.eventId,
      eventType,
      paymentSessionId: body.data.paymentSessionId,
      payment: {
        state: body.data.state,
        providerPaymentId: body.data.providerPaymentId,
        providerCaptureId: body.data.providerCaptureId,
      },
      summary: {
        amountMinor: body.data.amountMinor,
        currency: body.data.currency,
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
