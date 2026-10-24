export interface IMcpAuthResource {
  resource: string;
  instanceName: string;
}

export interface IMcpAuthClient {
  clientId: string;
  name: string;
  redirectUris: string[];
  authentication: 'none' | 'client_secret_basic';
  secretSha256?: string;
  resources: string[];
}

export interface IMcpAuthConfig {
  issuer: string;
  resources: IMcpAuthResource[];
  clients: IMcpAuthClient[];
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
