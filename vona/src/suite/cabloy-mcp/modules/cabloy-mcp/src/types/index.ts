export interface IMcpConfig {
  enabled: boolean;
}

declare module 'vona' {
  export interface VonaConfigEnv {
    CABLOY_MCP_ENABLED: string | undefined;
  }
}
