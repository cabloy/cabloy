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
import { z } from 'zod';

export interface IPayProviderPaypalClientRecord extends IPayProviderClientRecord {}

export interface IPayProviderPaypalClientOptions extends IPayProviderClientOptions {
  secretCredential: { clientId: string | undefined; clientSecret: string | undefined };
  webhookId: string | undefined;
}

const app = useApp();
const PaypalWebhookSchema = z.object({
  id: z.string().min(1).max(255),
  event_type: z.string().min(1).max(255),
  resource: z.record(z.string(), z.unknown()),
});

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
      environment: app.meta.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'live',
      secretCredential: {
        clientId: app.meta.env.PAYPAL_CLIENT_ID,
        clientSecret: app.meta.env.PAYPAL_CLIENT_SECRET,
      },
      webhookId: app.meta.env.PAYPAL_WEBHOOK_ID,
      merchantReference: app.meta.env.PAYPAL_MERCHANT_REFERENCE,
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
    this._assertReady(clientOptions);
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

  async confirmPayment(
    input: IPayProviderPaymentInput,
    clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    this._assertReady(clientOptions);
    if (!input.providerOrderId) this.app.throw(409, 'PayPal payment has no provider order');
    const orders = new OrdersController(this._createClient(clientOptions));
    const response = await orders.captureOrder({
      id: input.providerOrderId,
      paypalRequestId: input.idempotencyKey,
    } as never);
    return this._mapOrder(response.result, input, clientOptions);
  }

  async queryPayment(
    input: IPayProviderPaymentInput,
    clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    this._assertReady(clientOptions);
    if (!input.providerOrderId) this.app.throw(409, 'PayPal payment has no provider order');
    const orders = new OrdersController(this._createClient(clientOptions));
    const response = await orders.getOrder({ id: input.providerOrderId });
    return this._mapOrder(response.result, input, clientOptions);
  }

  async createRefund(
    input: IPayProviderRefundInput,
    clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderRefundSnapshot> {
    this._assertReady(clientOptions);
    const payments = new PaymentsController(this._createClient(clientOptions));
    const response = await payments.refundCapturedPayment({
      captureId: input.providerCaptureId,
      paypalRequestId: input.idempotencyKey,
      body: {
        amount: {
          currencyCode: input.currency,
          value: formatMinorAmount(input.amountMinor, input.currency),
        },
        customId: String(input.refundOperationId),
        invoiceId: input.businessReference,
      },
    } as never);
    return this._mapRefund(response.result, input, clientOptions);
  }

  async queryRefund(
    input: IPayProviderRefundInput,
    clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderRefundSnapshot> {
    this._assertReady(clientOptions);
    if (!input.providerRefundId)
      this.app.throw(409, 'PayPal refund has no provider refund identifier');
    const payments = new PaymentsController(this._createClient(clientOptions));
    const response = await payments.getRefund({ refundId: input.providerRefundId });
    return this._mapRefund(response.result, input, clientOptions);
  }

  async verifyWebhook(
    input: IPayProviderWebhookInput,
    clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderVerifiedWebhook> {
    this._assertReady(clientOptions);
    const webhook = PaypalWebhookSchema.safeParse(input.body);
    if (!webhook.success) this.app.throw(400, 'PayPal webhook is invalid');
    await this._verifyWebhookSignature(input, clientOptions);
    return await this._mapWebhook(webhook.data, clientOptions);
  }

  private async _mapWebhook(
    event: z.infer<typeof PaypalWebhookSchema>,
    clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderVerifiedWebhook> {
    const resource = event.resource;
    const amount = parsePaypalAmount(resource.amount);
    const currency = parsePaypalCurrency(resource.amount);
    const resourceId = readString(resource.id);
    if (!resourceId || !amount || !currency)
      this.app.throw(400, 'PayPal webhook has invalid resource');

    if (event.event_type.startsWith('PAYMENT.CAPTURE.REFUND_')) {
      const refundOperationId = readString(readField(resource, 'customId', 'custom_id'));
      const captureId = readNestedString(resource, [
        'supplementary_data',
        'related_ids',
        'capture_id',
      ]);
      if (!refundOperationId || !captureId)
        this.app.throw(400, 'PayPal refund webhook is not correlated');
      const refund = await this.$scope.pay.model.refundOperation.getById(
        refundOperationId as never,
      );
      if (!refund) this.app.throw(404, 'PayPal refund operation not found');
      const session = await this.$scope.pay.model.paymentSession.getById(refund.paymentSessionId);
      if (!session || session.providerCaptureId !== captureId) {
        this.app.throw(409, 'PayPal refund webhook capture conflicts');
      }
      const snapshot = this._mapRefund(
        resource,
        {
          paymentSessionId: session.id,
          refundOperationId: refund.id,
          businessReference: refund.businessReference,
          idempotencyKey: '',
          amountMinor: refund.amountMinor,
          currency: refund.currency,
          providerCaptureId: captureId,
          providerRefundId: resourceId,
        },
        clientOptions,
      );
      return {
        eventId: event.id,
        eventType: event.event_type,
        refundOperationId: refund.id,
        refund: snapshot,
        summary: { amountMinor: amount, currency },
      };
    }

    if (event.event_type.startsWith('PAYMENT.CAPTURE.')) {
      const orderId = readNestedString(resource, ['supplementaryData', 'relatedIds', 'orderId']);
      if (!orderId) this.app.throw(400, 'PayPal capture webhook has no order identifier');
      const orders = new OrdersController(this._createClient(clientOptions));
      const order = (await orders.getOrder({ id: orderId })).result;
      const input = this._inputFromOrder(order, orderId);
      const payment = this._mapOrder(order, input, clientOptions);
      if (!['succeeded', 'failed', 'cancelled'].includes(payment.state)) {
        this.app.throw(400, 'PayPal capture webhook is not terminal');
      }
      if (payment.providerCaptureId && payment.providerCaptureId !== resourceId) {
        this.app.throw(409, 'PayPal capture webhook conflicts with order capture');
      }
      return {
        eventId: event.id,
        eventType: event.event_type,
        paymentSessionId: input.paymentSessionId,
        payment,
        summary: { amountMinor: amount, currency },
      };
    }
    this.app.throw(400, 'PayPal webhook event type is unsupported');
  }

  private _inputFromOrder(order: unknown, providerOrderId: string): IPayProviderPaymentInput {
    const orderRecord = asRecord(order);
    const unit = asArray(readField(orderRecord, 'purchaseUnits', 'purchase_units'))[0];
    const unitRecord = asRecord(unit);
    const customId = readString(readField(unitRecord, 'customId', 'custom_id'));
    const businessReference = readString(readField(unitRecord, 'invoiceId', 'invoice_id'));
    const amountMinor = parsePaypalAmount(readField(unitRecord, 'amount'));
    const currency = parsePaypalCurrency(readField(unitRecord, 'amount'));
    if (!customId || !businessReference || amountMinor === undefined || !currency) {
      this.app.throw(400, 'PayPal order is not correlated');
    }
    return {
      paymentSessionId: customId as never,
      businessReference,
      idempotencyKey: '',
      amountMinor,
      currency,
      providerOrderId,
    };
  }

  private _mapOrder(
    order: unknown,
    input: IPayProviderPaymentInput,
    clientOptions: IPayProviderPaypalClientOptions,
  ): IPayProviderPaymentSnapshot {
    const orderRecord = asRecord(order);
    const orderId = readString(orderRecord.id);
    if (!orderId || orderId !== input.providerOrderId) {
      this.app.throw(409, 'PayPal order identifier conflicts');
    }
    const units = asArray(readField(orderRecord, 'purchaseUnits', 'purchase_units'));
    if (units.length !== 1) this.app.throw(409, 'PayPal order has an invalid purchase-unit count');
    const unit = asRecord(units[0]);
    if (
      readString(readField(unit, 'customId', 'custom_id')) !== String(input.paymentSessionId) ||
      readString(readField(unit, 'invoiceId', 'invoice_id')) !== input.businessReference ||
      parsePaypalAmount(readField(unit, 'amount')) !== input.amountMinor ||
      parsePaypalCurrency(readField(unit, 'amount')) !== input.currency
    ) {
      this.app.throw(409, 'PayPal order facts conflict with the payment session');
    }
    this._assertMerchant(unit, clientOptions);
    const captures = asArray(readField(asRecord(readField(unit, 'payments')), 'captures'));
    if (captures.length > 1) this.app.throw(409, 'PayPal order has multiple captures');
    const capture = asRecord(captures[0]);
    const captureId = readString(capture.id);
    const captureStatus = readString(capture.status);
    if (captureId) {
      if (
        parsePaypalAmount(capture.amount) !== input.amountMinor ||
        parsePaypalCurrency(capture.amount) !== input.currency
      ) {
        this.app.throw(409, 'PayPal capture facts conflict with the payment session');
      }
      if (captureStatus === 'COMPLETED') {
        return {
          state: 'succeeded',
          providerPaymentId: orderId,
          providerOrderId: orderId,
          providerCaptureId: captureId,
          nextAction: { kind: 'completed' },
        };
      }
      if (captureStatus === 'FAILED' || captureStatus === 'DECLINED') {
        return {
          state: 'failed',
          providerPaymentId: orderId,
          providerOrderId: orderId,
          providerCaptureId: captureId,
        };
      }
      if (captureStatus === 'PENDING') {
        return {
          state: 'processing',
          providerPaymentId: orderId,
          providerOrderId: orderId,
          providerCaptureId: captureId,
        };
      }
    }
    if (orderRecord.status === OrderStatus.Voided) {
      return { state: 'cancelled', providerPaymentId: orderId, providerOrderId: orderId };
    }
    return { state: 'requires_action', providerPaymentId: orderId, providerOrderId: orderId };
  }

  private _mapRefund(
    refund: unknown,
    input: IPayProviderRefundInput,
    clientOptions: IPayProviderPaypalClientOptions,
  ): IPayProviderRefundSnapshot {
    const record = asRecord(refund);
    const providerRefundId = readString(record.id);
    if (!providerRefundId) this.app.throw(502, 'PayPal refund returned no identifier');
    if (
      (input.providerRefundId && input.providerRefundId !== providerRefundId) ||
      readString(readField(record, 'customId', 'custom_id')) !== String(input.refundOperationId) ||
      readString(record.invoice_id) !== input.businessReference ||
      parsePaypalAmount(record.amount) !== input.amountMinor ||
      parsePaypalCurrency(record.amount) !== input.currency
    ) {
      this.app.throw(409, 'PayPal refund facts conflict with the refund operation');
    }
    this._assertMerchant(record, clientOptions);
    return mapRefund(readString(record.status), providerRefundId);
  }

  private async _verifyWebhookSignature(
    input: IPayProviderWebhookInput,
    clientOptions: IPayProviderPaypalClientOptions,
  ) {
    const webhookId = clientOptions.webhookId;
    if (!webhookId) this.app.throw(503, 'PayPal webhook ID is not configured');
    const headers = input.headers;
    const transmissionId = getHeader(headers, 'paypal-transmission-id');
    const transmissionTime = getHeader(headers, 'paypal-transmission-time');
    const certUrl = getHeader(headers, 'paypal-cert-url');
    const authAlgo = getHeader(headers, 'paypal-auth-algo');
    const transmissionSig = getHeader(headers, 'paypal-transmission-sig');
    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
      this.app.throw(401, 'PayPal webhook transmission headers are invalid');
    }
    const { clientId, clientSecret } = clientOptions.secretCredential;
    const apiBaseUrl =
      clientOptions.environment === 'sandbox'
        ? 'https://api-m.sandbox.paypal.com'
        : 'https://api-m.paypal.com';
    const tokenResponse = await fetch(`${apiBaseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const token = asRecord(tokenResponse.ok ? await tokenResponse.json() : undefined);
    const accessToken = readString(token.access_token);
    if (!accessToken) this.app.throw(401, 'PayPal webhook verification authentication failed');
    const response = await fetch(`${apiBaseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: input.body,
      }),
    });
    if (!response.ok) this.app.throw(401, 'PayPal webhook verification failed');
    const result = asRecord(await response.json());
    if (readString(result.verification_status) !== 'SUCCESS') {
      this.app.throw(401, 'PayPal webhook signature is invalid');
    }
  }

  private _assertReady(clientOptions: IPayProviderPaypalClientOptions) {
    const { clientId, clientSecret } = clientOptions.secretCredential;
    if (
      !clientId ||
      !clientSecret ||
      !clientOptions.webhookId ||
      !clientOptions.merchantReference
    ) {
      this.app.throw(503, 'PayPal is not fully configured');
    }
  }

  private _assertMerchant(
    value: Record<string, unknown>,
    clientOptions: IPayProviderPaypalClientOptions,
  ) {
    const merchantId =
      readNestedString(value, ['payee', 'merchantId']) ??
      readNestedString(value, ['payee', 'merchant_id']) ??
      readNestedString(value, ['sellerReceivableBreakdown', 'payee', 'merchantId']) ??
      readNestedString(value, ['seller_receivable_breakdown', 'payee', 'merchant_id']);
    if (!merchantId || merchantId !== clientOptions.merchantReference) {
      this.app.throw(409, 'PayPal merchant reference conflicts');
    }
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

function mapRefund(
  status: string | undefined,
  providerRefundId: string,
): IPayProviderRefundSnapshot {
  if (status === 'COMPLETED') return { state: 'succeeded', providerRefundId };
  if (status === 'FAILED') return { state: 'failed', providerRefundId };
  if (status === 'CANCELLED') return { state: 'cancelled', providerRefundId };
  return { state: 'pending', providerRefundId };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}

function readField(record: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    if (record[key] !== undefined) return record[key];
  }
  return undefined;
}

function readNestedString(value: unknown, path: string[]) {
  let current: unknown = value;
  for (const key of path) {
    const record = asRecord(current);
    current = record[key] ?? record[camelToSnake(key)];
  }
  return readString(current);
}

function camelToSnake(value: string) {
  return value.replace(/[A-Z]/g, character => `_${character.toLowerCase()}`);
}

function parsePaypalAmount(value: unknown): number | undefined {
  const amount = asRecord(value);
  if (readString(amount.currency_code) !== 'USD') return undefined;
  const decimal = readString(amount.value);
  if (!decimal || !/^\d+\.\d{2}$/.test(decimal)) return undefined;
  const [whole, fractional] = decimal.split('.');
  const result = Number(whole) * 100 + Number(fractional);
  return Number.isSafeInteger(result) ? result : undefined;
}

function parsePaypalCurrency(value: unknown) {
  const currency = readString(asRecord(value).currency_code);
  return currency === 'USD' ? currency : undefined;
}

function getHeader(headers: Record<string, string | string[] | undefined>, key: string) {
  const value = headers[key];
  return Array.isArray(value) ? value[0] : value;
}

declare module 'vona-module-a-pay' {
  export interface IPayProviderRecord {
    'pay-paypal:paypal': IPayProviderOptionsPaypal;
  }
}
