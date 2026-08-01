declare module 'vona' {
  export interface VonaConfigEnv {
    STRIPE_SECRET_KEY: string | undefined;
    STRIPE_WEBHOOK_SECRET: string | undefined;
  }
}

export {};
