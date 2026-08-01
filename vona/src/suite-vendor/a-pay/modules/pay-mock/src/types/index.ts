declare module 'vona' {
  export interface VonaConfigEnv {
    PAY_MOCK_DEFAULT_CREDENTIAL: string | undefined;
    PAY_MOCK_DEFAULT_WEBHOOK: string | undefined;
    PAY_MOCK_SECONDARY_CREDENTIAL: string | undefined;
    PAY_MOCK_SECONDARY_WEBHOOK: string | undefined;
  }
}

export {};
