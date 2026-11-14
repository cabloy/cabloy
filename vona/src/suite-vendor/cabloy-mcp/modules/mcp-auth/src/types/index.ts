import type { TableIdentity } from 'table-identity';
export interface IMcpAuthIssuer {
  issuer: string;
  instanceName: string;
}

export interface IMcpAuthResource {
  resource: string;
  instanceName: string;
  ssrSiteId: string;
}

export type TypeMcpBuiltinScope = 'mcp:all' | 'mcp:read';
export type TypeMcpCustomScope = `mcp:custom:${string}`;
export type TypeMcpScope = TypeMcpBuiltinScope | TypeMcpCustomScope;

export interface IMcpToolIdentity {
  name: string;
  controller: string;
  action: string;
}

export interface IMcpToolCatalogItem extends IMcpToolIdentity {
  controllerSummary: string;
  summary: string;
  description: string;
  readOnly: boolean;
}

export interface IMcpResolvedToolAccess {
  scope: TypeMcpScope;
  /** Undefined only for built-in scopes; custom scopes always carry exact identities. */
  tools: IMcpToolIdentity[] | undefined;
  /** Preserve a granted read ceiling against current Action annotation changes. */
  readOnly?: boolean;
}

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
  [key: string]: unknown;
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
  scope: TypeMcpBuiltinScope;
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
  scope: TypeMcpBuiltinScope;
  state: TypeMcpClientRegistrationState;
  clientIdIssuedAt?: number;
}

export interface IMcpAuthConfig {
  registration?: IMcpAuthRegistrationConfig;
  pendingTtl: number;
  codeTtl: number;
  tokenTtl: number;
  personalTokenTtl: number;
  refreshTokenTtl: number;
  allowLoopbackHttp: boolean;
}

export type TypeMcpAuthorizationState =
  | 'pending'
  | 'codeReady'
  | 'tokenActive'
  | 'denied'
  | 'revoked';
