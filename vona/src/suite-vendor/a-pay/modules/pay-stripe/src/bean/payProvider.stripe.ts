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

import Stripe from 'stripe';
import { BeanBase, useApp } from 'vona';
import { PayProvider, ProviderOperationFailure } from 'vona-module-a-pay';

import type { IStripeGateway, IStripeGatewayOptions } from '../lib/stripeGateway.ts';

import { createStripeGateway, StripeGatewayError } from '../lib/stripeGateway.ts';

export interface IPayProviderStripeClientRecord extends IPayProviderClientRecord {}

export interface IPayProviderStripeClientOptions extends IPayProviderClientOptions {
  secretCredential: string | undefined;
  secretWebhook: string | undefined;
  gateway?: IStripeGateway;
}

const app = useApp();

export interface IPayProviderOptionsStripe extends IDecoratorPayProviderOptions<
  IPayProviderStripeClientRecord,
  IPayProviderStripeClientOptions
> {}

@PayProvider<IPayProviderOptionsStripe>({
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
      environment: app.meta.env.STRIPE_ENVIRONMENT as 'sandbox' | 'live',
      secretCredential: app.meta.env.STRIPE_SECRET_KEY,
      secretWebhook: app.meta.env.STRIPE_WEBHOOK_SECRET,
      merchantReference: app.meta.env.STRIPE_MERCHANT_REFERENCE,
    },
  },
})
export class PayProviderStripe
  extends BeanBase
  implements IPayProviderExecute<IPayProviderStripeClientOptions>
{
  async startPayment(
    input: IPayProviderPaymentInput,
    clientOptions: IPayProviderStripeClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    if (input.providerOrderId) return await this.queryPayment(input, clientOptions);
    if (!input.returnUrl || !input.cancelUrl) {
      this.app.throw(500, 'Stripe payment requires return and cancel URLs');
    }
    const gatewayOptions = this._gatewayOptions(clientOptions);
    assertStripeMoney(input.amountMinor, input.currency);
    const body = {
      mode: 'payment',
      success_url: input.returnUrl,
      cancel_url: input.cancelUrl,
      client_reference_id: input.providerCorrelationReference,
      metadata: this._paymentMetadata(input),
      payment_intent_data: { metadata: this._paymentMetadata(input) },
      managed_payments: { enabled: false },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: input.currency.toLowerCase(),
            unit_amount: input.amountMinor,
            product_data: { name: `Payment ${input.providerInvoiceReference}` },
          },
        },
      ],
    } satisfies Stripe.Checkout.SessionCreateParams;
    let checkoutSession: unknown;
    try {
      checkoutSession = await this._gateway(clientOptions).createCheckoutSession(gatewayOptions, {
        idempotencyKey: input.idempotencyKey,
        body,
      });
    } catch (error) {
      this._throwTerminalPaymentFailure(error);
    }
    return this._mapCheckoutSession(checkoutSession, input, clientOptions, true);
  }

  async confirmPayment(
    input: IPayProviderPaymentInput,
    clientOptions: IPayProviderStripeClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    return await this.queryPayment(input, clientOptions);
  }

  async queryPayment(
    input: IPayProviderPaymentInput,
    clientOptions: IPayProviderStripeClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    const gatewayOptions = this._gatewayOptions(clientOptions);
    if (!input.providerOrderId) this.app.throw(409, 'Stripe payment has no Checkout Session');
    const checkoutSession = await this._gateway(clientOptions).retrieveCheckoutSession(
      gatewayOptions,
      { id: input.providerOrderId },
    );
    return this._mapCheckoutSession(checkoutSession, input, clientOptions);
  }

  async createRefund(
    input: IPayProviderRefundInput,
    clientOptions: IPayProviderStripeClientOptions,
  ): Promise<IPayProviderRefundSnapshot> {
    const gatewayOptions = this._gatewayOptions(clientOptions);
    assertStripeMoney(input.amountMinor, input.currency);
    try {
      const refund = await this._gateway(clientOptions).createRefund(gatewayOptions, {
        idempotencyKey: input.idempotencyKey,
        body: {
          payment_intent: input.providerCaptureId,
          amount: input.amountMinor,
          metadata: this._refundMetadata(input),
        },
      });
      return this._mapRefund(refund, input);
    } catch (error) {
      if (this._isDefinitiveRefundRejection(error)) return { state: 'failed' };
      throw error;
    }
  }

  async queryRefund(
    input: IPayProviderRefundInput,
    clientOptions: IPayProviderStripeClientOptions,
  ): Promise<IPayProviderRefundSnapshot> {
    const gatewayOptions = this._gatewayOptions(clientOptions);
    if (!input.providerRefundId)
      this.app.throw(409, 'Stripe refund has no provider refund identifier');
    const refund = await this._gateway(clientOptions).retrieveRefund(gatewayOptions, {
      id: input.providerRefundId,
    });
    return this._mapRefund(refund, input);
  }

  async verifyWebhook(
    input: IPayProviderWebhookInput,
    clientOptions: IPayProviderStripeClientOptions,
  ): Promise<IPayProviderVerifiedWebhook> {
    const gatewayOptions = this._gatewayOptions(clientOptions);
    let event: Record<string, unknown>;
    try {
      event = asRecord(
        await this._gateway(clientOptions).constructWebhookEvent(gatewayOptions, input),
      );
    } catch (error) {
      this._throwGatewayError(error);
    }
    const eventId = readString(event.id);
    const eventType = readString(event.type);
    const resource = asRecord(asRecord(event.data).object);
    if (!eventId || !eventType || !Object.keys(resource).length) {
      this.app.throw(400, 'Stripe webhook is invalid');
    }
    if (eventType.startsWith('checkout.session.')) {
      return await this._mapCheckoutWebhook(eventId, eventType, resource, clientOptions);
    }
    if (eventType.startsWith('payment_intent.')) {
      return await this._mapPaymentIntentWebhook(eventId, eventType, resource);
    }
    if (eventType.startsWith('refund.')) {
      return await this._mapRefundWebhook(eventId, eventType, resource);
    }
    return { eventId, eventType, ignored: true, summary: { amountMinor: 0, currency: 'USD' } };
  }

  private async _mapCheckoutWebhook(
    eventId: string,
    eventType: string,
    checkoutSession: Record<string, unknown>,
    clientOptions: IPayProviderStripeClientOptions,
  ): Promise<IPayProviderVerifiedWebhook> {
    const input = await this._inputFromCheckoutSession(checkoutSession);
    const payment = await this._mapCheckoutSession(checkoutSession, input, clientOptions);
    if (eventType === 'checkout.session.async_payment_failed') {
      return {
        eventId,
        eventType,
        paymentSessionId: input.paymentSessionId,
        payment: { ...payment, state: 'failed' },
        summary: { amountMinor: input.amountMinor, currency: input.currency },
      };
    }
    if (!['succeeded', 'failed', 'cancelled'].includes(payment.state)) {
      return {
        eventId,
        eventType,
        ignored: true,
        summary: { amountMinor: input.amountMinor, currency: input.currency },
      };
    }
    return {
      eventId,
      eventType,
      paymentSessionId: input.paymentSessionId,
      payment,
      summary: { amountMinor: input.amountMinor, currency: input.currency },
    };
  }

  private async _mapPaymentIntentWebhook(
    eventId: string,
    eventType: string,
    paymentIntent: Record<string, unknown>,
  ): Promise<IPayProviderVerifiedWebhook> {
    const metadata = asRecord(paymentIntent.metadata);
    const providerCorrelationReference = readString(metadata.providerCorrelationReference);
    const providerInvoiceReference = readString(metadata.providerInvoiceReference);
    if (!providerCorrelationReference || !providerInvoiceReference) {
      this.app.throw(400, 'Stripe PaymentIntent webhook is not correlated');
    }
    const session = await this.$scope.pay.model.paymentSession.get({
      providerCorrelationReference,
    });
    if (!session || session.providerInvoiceReference !== providerInvoiceReference) {
      this.app.throw(400, 'Stripe PaymentIntent webhook is not correlated');
    }
    const payment = this._mapPaymentIntent(paymentIntent, {
      paymentSessionId: session.id,
      businessReference: session.businessReference,
      providerInvoiceReference: session.providerInvoiceReference,
      providerCorrelationReference: session.providerCorrelationReference,
      idempotencyKey: '',
      amountMinor: session.amountMinor,
      currency: session.currency,
      providerOrderId: session.providerOrderId,
    });
    const terminalPayment =
      eventType === 'payment_intent.payment_failed'
        ? { ...payment, state: 'failed' as const }
        : payment;
    if (!['succeeded', 'failed', 'cancelled'].includes(terminalPayment.state)) {
      return {
        eventId,
        eventType,
        ignored: true,
        summary: { amountMinor: session.amountMinor, currency: session.currency },
      };
    }
    return {
      eventId,
      eventType,
      paymentSessionId: session.id,
      payment: terminalPayment,
      summary: { amountMinor: session.amountMinor, currency: session.currency },
    };
  }

  private async _mapRefundWebhook(
    eventId: string,
    eventType: string,
    refundResource: Record<string, unknown>,
  ): Promise<IPayProviderVerifiedWebhook> {
    const refundId = readString(refundResource.id);
    const metadata = asRecord(refundResource.metadata);
    const providerCorrelationReference = readString(metadata.providerCorrelationReference);
    if (!refundId || !providerCorrelationReference) {
      this.app.throw(400, 'Stripe refund webhook is not correlated');
    }
    const refund = await this.$scope.pay.model.refundOperation.get({
      providerCorrelationReference,
    });
    if (!refund) this.app.throw(400, 'Stripe refund webhook is not correlated');
    const session = await this.$scope.pay.model.paymentSession.getById(refund.paymentSessionId);
    if (!session?.providerCaptureId) this.app.throw(409, 'Stripe refund webhook payment conflicts');
    const snapshot = this._mapRefund(refundResource, {
      paymentSessionId: session.id,
      refundOperationId: refund.id,
      businessReference: refund.businessReference,
      providerInvoiceReference: refund.providerInvoiceReference,
      providerCorrelationReference: refund.providerCorrelationReference,
      idempotencyKey: '',
      amountMinor: refund.amountMinor,
      currency: refund.currency,
      providerCaptureId: session.providerCaptureId,
      providerRefundId: refundId,
    });
    return {
      eventId,
      eventType,
      refundOperationId: refund.id,
      refund: snapshot,
      summary: { amountMinor: refund.amountMinor, currency: refund.currency },
    };
  }

  private async _inputFromCheckoutSession(
    checkoutSession: Record<string, unknown>,
  ): Promise<IPayProviderPaymentInput> {
    const metadata = asRecord(checkoutSession.metadata);
    const providerCorrelationReference = readString(metadata.providerCorrelationReference);
    const providerInvoiceReference = readString(metadata.providerInvoiceReference);
    const providerOrderId = readString(checkoutSession.id);
    if (!providerCorrelationReference || !providerInvoiceReference || !providerOrderId) {
      this.app.throw(400, 'Stripe Checkout Session is not correlated');
    }
    const session = await this.$scope.pay.model.paymentSession.get({
      providerCorrelationReference,
    });
    if (!session || session.providerInvoiceReference !== providerInvoiceReference) {
      this.app.throw(400, 'Stripe Checkout Session is not correlated');
    }
    return {
      paymentSessionId: session.id,
      businessReference: session.businessReference,
      providerInvoiceReference: session.providerInvoiceReference,
      providerCorrelationReference: session.providerCorrelationReference,
      idempotencyKey: '',
      amountMinor: session.amountMinor,
      currency: session.currency,
      providerOrderId,
    };
  }

  private _mapCheckoutSession(
    checkoutSession: unknown,
    input: IPayProviderPaymentInput,
    clientOptions: IPayProviderStripeClientOptions,
    requireRedirect = false,
  ): IPayProviderPaymentSnapshot {
    const record = asRecord(checkoutSession);
    const providerOrderId = readString(record.id);
    const amountMinor = readInteger(record.amount_total);
    const currency = readString(record.currency)?.toUpperCase();
    const metadata = asRecord(record.metadata);
    if (
      !providerOrderId ||
      (input.providerOrderId && input.providerOrderId !== providerOrderId) ||
      amountMinor !== input.amountMinor ||
      currency !== input.currency ||
      readString(record.client_reference_id) !== input.providerCorrelationReference ||
      readString(metadata.providerCorrelationReference) !== input.providerCorrelationReference ||
      readString(metadata.providerInvoiceReference) !== input.providerInvoiceReference ||
      !this._matchesEnvironment(record, clientOptions)
    ) {
      this.app.throw(409, 'Stripe Checkout Session facts conflict with the payment session');
    }
    const paymentIntent = asRecord(record.payment_intent);
    const paymentIntentId =
      readString(record.payment_intent) ?? readString(paymentIntent.id) ?? undefined;
    if (paymentIntentId && Object.keys(paymentIntent).length) {
      return this._mapPaymentIntent(paymentIntent, { ...input, providerOrderId }, providerOrderId);
    }
    if (record.status === 'expired') {
      return { state: 'cancelled', providerPaymentId: providerOrderId, providerOrderId };
    }
    if (record.payment_status === 'paid' && paymentIntentId) {
      return {
        state: 'succeeded',
        providerPaymentId: paymentIntentId,
        providerOrderId,
        providerCaptureId: paymentIntentId,
        nextAction: { kind: 'completed' },
      };
    }
    const url = readString(record.url);
    if (requireRedirect && !url) this.app.throw(502, 'Stripe did not return a Checkout URL');
    return {
      state: 'requires_action',
      providerPaymentId: providerOrderId,
      providerOrderId,
      ...(url && { nextAction: { kind: 'redirect' as const, url } }),
    };
  }

  private _mapPaymentIntent(
    paymentIntent: Record<string, unknown>,
    input: IPayProviderPaymentInput,
    providerOrderId = input.providerOrderId,
  ): IPayProviderPaymentSnapshot {
    const providerPaymentId = readString(paymentIntent.id);
    const amountMinor = readInteger(paymentIntent.amount);
    const currency = readString(paymentIntent.currency)?.toUpperCase();
    const metadata = asRecord(paymentIntent.metadata);
    if (
      !providerPaymentId ||
      amountMinor !== input.amountMinor ||
      currency !== input.currency ||
      readString(metadata.providerCorrelationReference) !== input.providerCorrelationReference ||
      readString(metadata.providerInvoiceReference) !== input.providerInvoiceReference
    ) {
      this.app.throw(409, 'Stripe PaymentIntent facts conflict with the payment session');
    }
    const status = readString(paymentIntent.status);
    if (status === 'succeeded') {
      return {
        state: 'succeeded',
        providerPaymentId,
        providerOrderId,
        providerCaptureId: providerPaymentId,
        nextAction: { kind: 'completed' },
      };
    }
    if (status === 'processing') return { state: 'processing', providerPaymentId, providerOrderId };
    if (status === 'canceled') return { state: 'cancelled', providerPaymentId, providerOrderId };
    if (status === 'requires_payment_method')
      return { state: 'failed', providerPaymentId, providerOrderId };
    return { state: 'requires_action', providerPaymentId, providerOrderId };
  }

  private _mapRefund(refund: unknown, input: IPayProviderRefundInput): IPayProviderRefundSnapshot {
    const record = asRecord(refund);
    const providerRefundId = readString(record.id);
    const amountMinor = readInteger(record.amount);
    const currency = readString(record.currency)?.toUpperCase();
    const metadata = asRecord(record.metadata);
    const paymentIntent = readString(record.payment_intent);
    if (
      !providerRefundId ||
      (input.providerRefundId && input.providerRefundId !== providerRefundId) ||
      amountMinor !== input.amountMinor ||
      currency !== input.currency ||
      paymentIntent !== input.providerCaptureId ||
      readString(metadata.providerCorrelationReference) !== input.providerCorrelationReference ||
      readString(metadata.providerInvoiceReference) !== input.providerInvoiceReference
    ) {
      this.app.throw(409, 'Stripe refund facts conflict with the refund operation');
    }
    const status = readString(record.status);
    if (status === 'succeeded') return { state: 'succeeded', providerRefundId };
    if (status === 'failed') return { state: 'failed', providerRefundId };
    if (status === 'canceled') return { state: 'cancelled', providerRefundId };
    return { state: 'pending', providerRefundId };
  }

  private _paymentMetadata(input: IPayProviderPaymentInput): Record<string, string> {
    return {
      paymentSessionId: String(input.paymentSessionId),
      providerCorrelationReference: input.providerCorrelationReference,
      providerInvoiceReference: input.providerInvoiceReference,
    };
  }

  private _refundMetadata(input: IPayProviderRefundInput): Record<string, string> {
    return {
      paymentSessionId: String(input.paymentSessionId),
      refundOperationId: String(input.refundOperationId),
      providerCorrelationReference: input.providerCorrelationReference,
      providerInvoiceReference: input.providerInvoiceReference,
    };
  }

  private _gateway(clientOptions: IPayProviderStripeClientOptions): IStripeGateway {
    return clientOptions.gateway ?? createStripeGateway();
  }

  private _gatewayOptions(clientOptions: IPayProviderStripeClientOptions): IStripeGatewayOptions {
    const secretKey = clientOptions.secretCredential;
    const webhookSecret = clientOptions.secretWebhook;
    if (!secretKey || !webhookSecret) this.app.throw(503, 'Stripe is not fully configured');
    return { secretKey, webhookSecret };
  }

  private _matchesEnvironment(
    value: Record<string, unknown>,
    clientOptions: IPayProviderStripeClientOptions,
  ): boolean {
    const livemode = value.livemode;
    return typeof livemode !== 'boolean' || livemode === (clientOptions.environment === 'live');
  }

  private _isDefinitiveRefundRejection(error: unknown): boolean {
    return isStripeDefinitiveRejection(error);
  }

  private _throwTerminalPaymentFailure(error: unknown): never {
    if (isStripeDefinitiveRejection(error)) {
      throw new ProviderOperationFailure(
        'stripe_request_rejected',
        'Stripe rejected the payment request',
      );
    }
    throw error;
  }

  private _throwGatewayError(error: unknown): never {
    if (error instanceof StripeGatewayError) this.app.throw(error.status, error.message);
    throw error;
  }
}

function isStripeDefinitiveRejection(error: unknown): boolean {
  if (error instanceof StripeGatewayError) return error.status >= 400 && error.status < 500;
  const type = (error as Record<string, unknown> | undefined)?.type;
  return [
    'StripeInvalidRequestError',
    'StripeIdempotencyError',
    'StripeAuthenticationError',
    'StripePermissionError',
  ].includes(type as string);
}

function assertStripeMoney(amountMinor: number, currency: string) {
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0 || currency !== 'USD') {
    throw new Error('Stripe supports only positive USD minor-unit amounts');
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}

function readInteger(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isSafeInteger(value) ? value : undefined;
}
