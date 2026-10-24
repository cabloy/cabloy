export interface IMcpAuthResource {
  resource: string;
  instanceName: string;
}

export type TypeMcpClientAuthentication = 'none' | 'client_secret_basic';

export type TypeMcpClientRegistrationState = 'active' | 'revoked';

export interface IMcpAuthRegistrationConfig {
  maxBodyBytes: number;
  maxRedirectUris: number;
  rateLimit: number;
  rateLimitWindow: number;
}

export interface IMcpAuthRegistrationRequest {
  client_name: string;
  redirect_uris: string[];
  token_endpoint_auth_method?: TypeMcpClientAuthentication;
  grant_types?: ['authorization_code'];
  response_types?: ['code'];
}

export interface IMcpAuthRegistrationResponse {
  client_id: string;
  client_id_issued_at: number;
  client_name: string;
  redirect_uris: string[];
  token_endpoint_auth_method: TypeMcpClientAuthentication;
  grant_types: ['authorization_code'];
  response_types: ['code'];
  scope: 'mcp:read';
  client_secret?: string;
  client_secret_expires_at?: 0;
}

export interface IMcpAuthResolvedClient {
  clientId: string;
  name: string;
  redirectUris: string[];
  authentication: TypeMcpClientAuthentication;
  secretSha256?: string;
  resources: string[];
  scope: 'mcp:read';
  state: TypeMcpClientRegistrationState;
  clientIdIssuedAt?: number;
}

export interface IMcpAuthConfig {
  registration?: IMcpAuthRegistrationConfig;
  pendingTtl: number;
  codeTtl: number;
  tokenTtl: number;
  allowLoopbackHttp: boolean;
}

export type TypeMcpAuthorizationState =
  | 'pending'
  | 'codeReady'
  | 'tokenActive'
  | 'denied'
  | 'revoked';
