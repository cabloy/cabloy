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

import {
  CheckoutPaymentIntent,
  Client,
  Environment,
  OrdersController,
  OrderStatus,
  PaymentsController,
} from '@cabloy/paypal-server-sdk';
import { BeanBase, useApp } from 'vona';
import { PayProvider } from 'vona-module-a-pay';

export interface IPayProviderPaypalClientRecord extends IPayProviderClientRecord {}

export interface IPayProviderPaypalClientOptions extends IPayProviderClientOptions {
  secretCredential: { clientId: string | undefined; clientSecret: string | undefined };
  webhookId: string | undefined;
}

const app = useApp();

export interface IPayProviderOptionsPaypal extends IDecoratorPayProviderOptions<
  IPayProviderPaypalClientRecord,
  IPayProviderPaypalClientOptions
> {}

@PayProvider<IPayProviderOptionsPaypal>({
  base: {
    capabilities: {
      redirectCheckout: true,
      embeddedCheckout: false,
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
      secretCredential: {
        clientId: app.meta.env.PAYPAL_CLIENT_ID,
        clientSecret: app.meta.env.PAYPAL_CLIENT_SECRET,
      },
      webhookId: app.meta.env.PAYPAL_WEBHOOK_ID,
    },
  },
})
export class PayProviderPaypal
  extends BeanBase
  implements IPayProviderExecute<IPayProviderPaypalClientOptions>
{
  async startPayment(
    input: IPayProviderPaymentInput,
    clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    if (input.providerOrderId) return await this.queryPayment(input, clientOptions);
    if (!input.returnUrl || !input.cancelUrl) {
      this.app.throw(422, 'PayPal payment requires return and cancel URLs');
    }
    const orders = new OrdersController(this._createClient(clientOptions));
    const response = await orders.createOrder({
      paypalRequestId: input.idempotencyKey,
      body: {
        intent: CheckoutPaymentIntent.Capture,
        applicationContext: { returnUrl: input.returnUrl, cancelUrl: input.cancelUrl },
        purchaseUnits: [
          {
            customId: String(input.paymentSessionId),
            invoiceId: input.businessReference,
            amount: {
              currencyCode: input.currency,
              value: formatMinorAmount(input.amountMinor, input.currency),
            },
          },
        ],
      },
    } as never);
    const order = response.result;
    const approvalUrl = order?.links?.find(item => item.rel === 'approve')?.href;
    if (!order?.id || !approvalUrl) this.app.throw(502, 'PayPal did not return an approval order');
    return {
      state: 'requires_action',
      providerPaymentId: order.id,
      providerOrderId: order.id,
      nextAction: { kind: 'redirect', url: approvalUrl },
    };
  }

  async queryPayment(
    input: IPayProviderPaymentInput,
    clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    if (!input.providerOrderId) return { state: 'requires_action' };
    const orders = new OrdersController(this._createClient(clientOptions));
    const response = await orders.getOrder({ id: input.providerOrderId });
    const order = response.result;
    if (!order?.id) this.app.throw(502, 'PayPal order query returned no order');
    const capture = order.purchaseUnits?.[0]?.payments?.captures?.[0];
    if (capture?.status === 'COMPLETED') {
      return {
        state: 'succeeded',
        providerPaymentId: order.id,
        providerOrderId: order.id,
        providerCaptureId: capture.id,
        nextAction: { kind: 'completed' },
      };
    }
    if (capture?.status === 'FAILED' || capture?.status === 'DECLINED') {
      return { state: 'failed', providerPaymentId: order.id, providerOrderId: order.id };
    }
    if (order.status === OrderStatus.Voided) {
      return { state: 'cancelled', providerPaymentId: order.id, providerOrderId: order.id };
    }
    if (capture?.status === 'PENDING') {
      return { state: 'processing', providerPaymentId: order.id, providerOrderId: order.id };
    }
    return { state: 'requires_action', providerPaymentId: order.id, providerOrderId: order.id };
  }

  async createRefund(
    input: IPayProviderRefundInput,
    clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderRefundSnapshot> {
    const payments = new PaymentsController(this._createClient(clientOptions));
    const response = await payments.refundCapturedPayment({
      captureId: input.providerCaptureId,
      paypalRequestId: input.idempotencyKey,
      body: {
        amount: {
          currencyCode: input.currency,
          value: formatMinorAmount(input.amountMinor, input.currency),
        },
      },
    } as never);
    return mapRefund(response.result?.status, response.result?.id);
  }

  async queryRefund(
    _input: IPayProviderRefundInput,
    _clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderRefundSnapshot> {
    this.app.throw(501, 'PayPal refund query requires a persisted provider refund identifier');
  }

  async verifyWebhook(
    _input: IPayProviderWebhookInput,
    _clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderVerifiedWebhook> {
    this.app.throw(501, 'PayPal webhook verification requires configured webhook verification');
  }

  private _createClient(clientOptions: IPayProviderPaypalClientOptions) {
    const { clientId, clientSecret } = clientOptions.secretCredential;
    if (!clientId || !clientSecret)
      this.app.throw(503, 'PayPal client credentials are not configured');
    return new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      timeout: 0,
      environment:
        clientOptions.environment === 'live' ? Environment.Production : Environment.Sandbox,
    });
  }
}

function formatMinorAmount(amountMinor: number, currency: string) {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0 || currency !== 'USD') {
    throw new Error('PayPal supports only nonnegative USD minor-unit amounts');
  }
  return `${Math.floor(amountMinor / 100)}.${String(amountMinor % 100).padStart(2, '0')}`;
}

function mapRefund(status?: string, providerRefundId?: string): IPayProviderRefundSnapshot {
  if (status === 'COMPLETED') return { state: 'succeeded', providerRefundId };
  if (status === 'FAILED') return { state: 'failed', providerRefundId };
  if (status === 'CANCELLED') return { state: 'cancelled', providerRefundId };
  return { state: 'pending', providerRefundId };
}

declare module 'vona-module-a-pay' {
  export interface IPayProviderRecord {
    'pay-paypal:paypal': IPayProviderOptionsPaypal;
  }
}
