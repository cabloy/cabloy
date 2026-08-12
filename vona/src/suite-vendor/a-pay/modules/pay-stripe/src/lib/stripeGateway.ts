import Stripe from 'stripe';

export interface IStripeGatewayOptions {
  secretKey: string;
  webhookSecret: string;
}

export const StripeRequestTimeoutMilliseconds = 15_000;

export interface IStripeGateway {
  createCheckoutSession(options: IStripeGatewayOptions, input: unknown): Promise<unknown>;
  retrieveCheckoutSession(options: IStripeGatewayOptions, input: unknown): Promise<unknown>;
  createRefund(options: IStripeGatewayOptions, input: unknown): Promise<unknown>;
  retrieveRefund(options: IStripeGatewayOptions, input: unknown): Promise<unknown>;
  constructWebhookEvent(
    options: IStripeGatewayOptions,
    input: { rawBody?: string; headers: Record<string, string | string[] | undefined> },
  ): Promise<unknown>;
}

export class StripeGatewayError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function createStripeGateway(): IStripeGateway {
  return {
    async createCheckoutSession(options, input) {
      const request = input as {
        body: Stripe.Checkout.SessionCreateParams;
        idempotencyKey: string;
      };
      return await createClient(options).checkout.sessions.create(request.body, {
        idempotencyKey: request.idempotencyKey,
      });
    },
    async retrieveCheckoutSession(options, input) {
      const request = input as { id: string };
      return await createClient(options).checkout.sessions.retrieve(request.id, {
        expand: ['payment_intent'],
      });
    },
    async createRefund(options, input) {
      const request = input as { body: Stripe.RefundCreateParams; idempotencyKey: string };
      return await createClient(options).refunds.create(request.body, {
        idempotencyKey: request.idempotencyKey,
      });
    },
    async retrieveRefund(options, input) {
      const request = input as { id: string };
      return await createClient(options).refunds.retrieve(request.id);
    },
    async constructWebhookEvent(options, input) {
      const signature = getHeader(input.headers, 'stripe-signature');
      if (!input.rawBody || !signature) {
        throw new StripeGatewayError(401, 'Stripe webhook signature is invalid');
      }
      try {
        return createClient(options).webhooks.constructEvent(
          input.rawBody,
          signature,
          options.webhookSecret,
        );
      } catch {
        throw new StripeGatewayError(401, 'Stripe webhook signature is invalid');
      }
    },
  };
}

function createClient(options: IStripeGatewayOptions) {
  return new Stripe(options.secretKey, {
    maxNetworkRetries: 0,
    timeout: StripeRequestTimeoutMilliseconds,
  });
}

function getHeader(headers: Record<string, string | string[] | undefined>, key: string) {
  const value = headers[key];
  return Array.isArray(value) ? value[0] : value;
}
