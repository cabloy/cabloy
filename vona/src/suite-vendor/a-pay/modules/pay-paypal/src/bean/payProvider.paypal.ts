import type {
  IDecoratorPayProviderOptions,
  IPayProviderClientOptions,
  IPayProviderExecute,
  IPayProviderPaymentInput,
  IPayProviderPaymentSnapshot,
  IPayProviderRefundInput,
  IPayProviderRefundSnapshot,
  IPayProviderVerifiedWebhook,
  IPayProviderWebhookInput,
} from 'vona-module-a-pay';

import { BeanBase, useApp } from 'vona';
import { PayProvider } from 'vona-module-a-pay';

export interface IPayProviderPaypalClientRecord {
  default: never;
}

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
    _input: IPayProviderPaymentInput,
    _clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    this.app.throw(501, 'PayPal provider is not configured');
  }

  async queryPayment(
    _input: IPayProviderPaymentInput,
    _clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    this.app.throw(501, 'PayPal provider is not configured');
  }

  async createRefund(
    _input: IPayProviderRefundInput,
    _clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderRefundSnapshot> {
    this.app.throw(501, 'PayPal provider is not configured');
  }

  async verifyWebhook(
    _input: IPayProviderWebhookInput,
    _clientOptions: IPayProviderPaypalClientOptions,
  ): Promise<IPayProviderVerifiedWebhook> {
    this.app.throw(501, 'PayPal webhook verification is not configured');
  }
}

declare module 'vona-module-a-pay' {
  export interface IPayProviderRecord {
    'pay-paypal:paypal': IPayProviderOptionsPaypal;
  }
}
