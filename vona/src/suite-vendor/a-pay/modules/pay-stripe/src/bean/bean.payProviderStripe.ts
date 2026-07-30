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

import { BeanBase } from 'vona';
import { PayProvider } from 'vona-module-a-pay';

export interface IPayProviderStripeClientRecord {
  default: never;
}

export interface IPayProviderStripeClientOptions {
  environment: 'sandbox' | 'live';
  credentialRef: string;
  webhookSecretRef?: string;
}

export interface IPayProviderOptionsStripe extends IDecoratorPayProviderOptions<
  IPayProviderStripeClientRecord,
  IPayProviderStripeClientOptions
> {}

@PayProvider<IPayProviderOptionsStripe>({
  enable: false,
  base: {
    environment: 'sandbox',
    credentialRef: 'env://STRIPE_SECRET_KEY',
    webhookSecretRef: 'env://STRIPE_WEBHOOK_SECRET',
  },
})
export class BeanPayProviderStripe extends BeanBase implements IPayProviderExecute {
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

  async startPayment(_input: IPayProviderPaymentInput): Promise<IPayProviderPaymentSnapshot> {
    this.app.throw(501, 'Stripe provider is not implemented');
  }

  async queryPayment(_input: IPayProviderPaymentInput): Promise<IPayProviderPaymentSnapshot> {
    this.app.throw(501, 'Stripe provider is not implemented');
  }

  async createRefund(_input: IPayProviderRefundInput): Promise<IPayProviderRefundSnapshot> {
    this.app.throw(501, 'Stripe provider is not implemented');
  }

  async verifyWebhook(_input: IPayProviderWebhookInput): Promise<IPayProviderVerifiedWebhook> {
    this.app.throw(501, 'Stripe provider is not implemented');
  }
}

declare module 'vona-module-a-pay' {
  export interface IPayProviderRecord {
    'pay-stripe:stripe': IPayProviderOptionsStripe;
  }
}
