declare module 'vona' {
  export interface VonaConfigEnv {
    AI_PROVIDER_DEFAULT_FACTORY: string | undefined;
    AI_PROVIDER_DEFAULT_BASEURL: string | undefined;
    AI_PROVIDER_DEFAULT_APIKEY: string | undefined;
    AI_MODEL_DEFAULT_PROVIDER: string | undefined;
    AI_MODEL_DEFAULT_MODELID: string | undefined;
  }
}

export {};
