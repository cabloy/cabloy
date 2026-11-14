import type { IMcpAuthResource } from 'vona-module-mcp-auth';

export interface IMcpConfig {
  enabled: boolean;
}

declare module 'vona' {
  export interface ContextState {
    mcpResource?: Readonly<IMcpAuthResource>;
  }

  export interface ILoggerChildRecord {
    mcp: never;
  }

  export interface VonaConfigEnv {
    CABLOY_MCP_ENABLED: string | undefined;
  }
}
