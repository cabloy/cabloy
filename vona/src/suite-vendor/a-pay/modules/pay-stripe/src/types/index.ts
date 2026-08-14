declare module 'vona' {
  export interface VonaConfigEnv {
    STRIPE_ENVIRONMENT: 'sandbox' | 'live' | undefined;
    STRIPE_SECRET_KEY: string | undefined;
    STRIPE_WEBHOOK_SECRET: string | undefined;
    STRIPE_MERCHANT_REFERENCE: string | undefined;
  }
}

export {};
