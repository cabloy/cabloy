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

import { BeanBase, useApp } from 'vona';
import { PayProvider } from 'vona-module-a-pay';

export interface IPayProviderStripeClientRecord extends IPayProviderClientRecord {}

export interface IPayProviderStripeClientOptions extends IPayProviderClientOptions {
  secretCredential: string | undefined;
  secretWebhook: string | undefined;
}

const app = useApp();

export interface IPayProviderOptionsStripe extends IDecoratorPayProviderOptions<
  IPayProviderStripeClientRecord,
  IPayProviderStripeClientOptions
> {}

@PayProvider<IPayProviderOptionsStripe>({
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
      secretCredential: app.meta.env.STRIPE_SECRET_KEY,
      secretWebhook: app.meta.env.STRIPE_WEBHOOK_SECRET,
    },
  },
})
export class PayProviderStripe
  extends BeanBase
  implements IPayProviderExecute<IPayProviderStripeClientOptions>
{
  async startPayment(
    _input: IPayProviderPaymentInput,
    _clientOptions: IPayProviderStripeClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    this.app.throw(501, 'Stripe provider is not implemented');
  }

  async queryPayment(
    _input: IPayProviderPaymentInput,
    _clientOptions: IPayProviderStripeClientOptions,
  ): Promise<IPayProviderPaymentSnapshot> {
    this.app.throw(501, 'Stripe provider is not implemented');
  }

  async createRefund(
    _input: IPayProviderRefundInput,
    _clientOptions: IPayProviderStripeClientOptions,
  ): Promise<IPayProviderRefundSnapshot> {
    this.app.throw(501, 'Stripe provider is not implemented');
  }

  async verifyWebhook(
    _input: IPayProviderWebhookInput,
    _clientOptions: IPayProviderStripeClientOptions,
  ): Promise<IPayProviderVerifiedWebhook> {
    this.app.throw(501, 'Stripe provider is not implemented');
  }
}

declare module 'vona-module-a-pay' {
  export interface IPayProviderRecord {
    'pay-stripe:stripe': IPayProviderOptionsStripe;
  }
}
