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

export interface IPayProviderPaypalClientRecord {
  default: never;
}

export interface IPayProviderPaypalClientOptions {
  environment: 'sandbox' | 'live';
  credentialRef: string;
  webhookSecretRef?: string;
  merchantReference?: string;
}

export interface IPayProviderOptionsPaypal extends IDecoratorPayProviderOptions<
  IPayProviderPaypalClientRecord,
  IPayProviderPaypalClientOptions
> {}

@PayProvider<IPayProviderOptionsPaypal>({
  base: {
    environment: 'sandbox',
    credentialRef: 'env://PAYPAL_CLIENT_SECRET',
    webhookSecretRef: 'env://PAYPAL_WEBHOOK_ID',
  },
})
export class BeanPayProviderPaypal extends BeanBase implements IPayProviderExecute {
  getCapabilities(): IPayProviderCapabilities {
    return {
      redirectCheckout: true,
      embeddedCheckout: false,
      automaticCapture: true,
      manualCapture: false,
      refunds: true,
      partialRefunds: true,
      webhooks: true,
    };
  }

  async startPayment(_input: IPayProviderPaymentInput): Promise<IPayProviderPaymentSnapshot> {
    this.app.throw(501, 'PayPal provider is not configured');
  }

  async queryPayment(_input: IPayProviderPaymentInput): Promise<IPayProviderPaymentSnapshot> {
    this.app.throw(501, 'PayPal provider is not configured');
  }

  async createRefund(_input: IPayProviderRefundInput): Promise<IPayProviderRefundSnapshot> {
    this.app.throw(501, 'PayPal provider is not configured');
  }

  async verifyWebhook(_input: IPayProviderWebhookInput): Promise<IPayProviderVerifiedWebhook> {
    this.app.throw(501, 'PayPal webhook verification is not configured');
  }
}

declare module 'vona-module-a-pay' {
  export interface IPayProviderRecord {
    'pay-paypal:paypal': IPayProviderOptionsPaypal;
  }
}
