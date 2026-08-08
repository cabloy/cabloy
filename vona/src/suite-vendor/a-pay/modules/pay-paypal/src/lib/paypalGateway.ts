import {
  Client,
  Environment,
  OrdersController,
  PaymentsController,
} from '@cabloy/paypal-server-sdk';

export interface IPaypalGatewayOptions {
  environment: 'sandbox' | 'live';
  clientId: string;
  clientSecret: string;
  webhookId: string;
}

export const PaypalRequestTimeoutMilliseconds = 15_000;

export interface IPaypalGateway {
  createOrder(options: IPaypalGatewayOptions, input: unknown): Promise<unknown>;
  captureOrder(options: IPaypalGatewayOptions, input: unknown): Promise<unknown>;
  getOrder(options: IPaypalGatewayOptions, input: unknown): Promise<unknown>;
  refundCapturedPayment(options: IPaypalGatewayOptions, input: unknown): Promise<unknown>;
  getRefund(options: IPaypalGatewayOptions, input: unknown): Promise<unknown>;
  verifyWebhookSignature(
    options: IPaypalGatewayOptions,
    input: { headers: Record<string, string | string[] | undefined>; body: unknown },
  ): Promise<void>;
}

export class PaypalGatewayError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function createPaypalGateway(fetcher: typeof fetch): IPaypalGateway {
  return {
    async createOrder(options, input) {
      return (await new OrdersController(createClient(options)).createOrder(input as never)).result;
    },
    async captureOrder(options, input) {
      return (await new OrdersController(createClient(options)).captureOrder(input as never))
        .result;
    },
    async getOrder(options, input) {
      return (await new OrdersController(createClient(options)).getOrder(input as never)).result;
    },
    async refundCapturedPayment(options, input) {
      return (
        await new PaymentsController(createClient(options)).refundCapturedPayment(input as never)
      ).result;
    },
    async getRefund(options, input) {
      return (await new PaymentsController(createClient(options)).getRefund(input as never)).result;
    },
    async verifyWebhookSignature(options, input) {
      const transmissionId = getHeader(input.headers, 'paypal-transmission-id');
      const transmissionTime = getHeader(input.headers, 'paypal-transmission-time');
      const certUrl = getHeader(input.headers, 'paypal-cert-url');
      const authAlgo = getHeader(input.headers, 'paypal-auth-algo');
      const transmissionSig = getHeader(input.headers, 'paypal-transmission-sig');
      if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
        throw new PaypalGatewayError(401, 'PayPal webhook transmission headers are invalid');
      }
      const apiBaseUrl =
        options.environment === 'sandbox'
          ? 'https://api-m.sandbox.paypal.com'
          : 'https://api-m.paypal.com';
      const tokenResponse = await fetcher(`${apiBaseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'authorization': `Basic ${Buffer.from(`${options.clientId}:${options.clientSecret}`).toString('base64')}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });
      const token = asRecord(tokenResponse.ok ? await tokenResponse.json() : undefined);
      const accessToken = readString(token.access_token);
      if (!accessToken) {
        throw new PaypalGatewayError(401, 'PayPal webhook verification authentication failed');
      }
      const response = await fetcher(`${apiBaseUrl}/v1/notifications/verify-webhook-signature`, {
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
          webhook_id: options.webhookId,
          webhook_event: input.body,
        }),
      });
      if (!response.ok) throw new PaypalGatewayError(401, 'PayPal webhook verification failed');
      const result = asRecord(await response.json());
      if (readString(result.verification_status) !== 'SUCCESS') {
        throw new PaypalGatewayError(401, 'PayPal webhook signature is invalid');
      }
    },
  };
}

function createClient(options: IPaypalGatewayOptions) {
  return new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: options.clientId,
      oAuthClientSecret: options.clientSecret,
    },
    timeout: PaypalRequestTimeoutMilliseconds,
    environment: options.environment === 'live' ? Environment.Production : Environment.Sandbox,
  });
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}

function getHeader(headers: Record<string, string | string[] | undefined>, key: string) {
  const value = headers[key];
  return Array.isArray(value) ? value[0] : value;
}
