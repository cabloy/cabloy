declare module 'vona' {
  export interface VonaConfigEnv {
    PAYPAL_CLIENT_ID: string | undefined;
    PAYPAL_CLIENT_SECRET: string | undefined;
    PAYPAL_WEBHOOK_ID: string | undefined;
    PAYPAL_MERCHANT_REFERENCE: string | undefined;
    PAYPAL_ENVIRONMENT: 'sandbox' | 'live';
  }
}

export {};
