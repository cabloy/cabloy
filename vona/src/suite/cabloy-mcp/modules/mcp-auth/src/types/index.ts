import type { TableIdentity } from 'table-identity';
import type { ISsrSiteRecord } from 'vona-module-a-ssr';

declare module 'vona' {
  export interface VonaConfigEnv {
    MCP_AUTH_SSR_SITE: string | undefined;
  }
}

export interface IMcpAuthResource {
  resource: string;
  instanceName: string;
}

export type TypeMcpScope = 'mcp:all' | 'mcp:read';

declare module 'vona-module-a-jwt' {
  export interface IJwtClientRecord {
    mcpAccess: never;
    mcpRefresh: never;
  }
}

export type TypeMcpGrantTypes = ['authorization_code'] | ['authorization_code', 'refresh_token'];

export type TypeMcpClientAuthentication = 'none' | 'client_secret_basic';

export type TypeMcpClientRegistrationState = 'active' | 'revoked';

export interface IMcpAuthRegistrationConfig {
  maxBodyBytes: number;
  maxRedirectUris: number;
  rateLimit: number;
  rateLimitWindow: number;
}

export interface IMcpAuthRegistrationRequest {
  application_type?: 'native';
  client_name: string;
  redirect_uris: string[];
  token_endpoint_auth_method?: TypeMcpClientAuthentication;
  grant_types?: Array<'authorization_code' | 'refresh_token'>;
  response_types?: ['code'];
  scope?: string;
}

export interface IMcpAuthRegistrationResponse {
  client_id: string;
  client_id_issued_at: number;
  client_name: string;
  redirect_uris: string[];
  token_endpoint_auth_method: TypeMcpClientAuthentication;
  grant_types: TypeMcpGrantTypes;
  response_types: ['code'];
  scope: TypeMcpScope;
  client_secret?: string;
  client_secret_expires_at?: 0;
}

export interface IMcpAuthResolvedClient {
  id: TableIdentity;
  clientId: string;
  name: string;
  redirectUris: string[];
  grantTypes: TypeMcpGrantTypes;
  authentication: TypeMcpClientAuthentication;
  secretSha256?: string;
  resources: string[];
  scope: TypeMcpScope;
  state: TypeMcpClientRegistrationState;
  clientIdIssuedAt?: number;
}

export interface IMcpAuthConfig {
  ssrSite?: keyof ISsrSiteRecord | '';
  registration?: IMcpAuthRegistrationConfig;
  pendingTtl: number;
  codeTtl: number;
  tokenTtl: number;
  refreshTokenTtl: number;
  allowLoopbackHttp: boolean;
}

export type TypeMcpAuthorizationState =
  | 'pending'
  | 'codeReady'
  | 'tokenActive'
  | 'denied'
  | 'revoked';
