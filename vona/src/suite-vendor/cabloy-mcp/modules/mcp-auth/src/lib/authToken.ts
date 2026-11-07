import type { TableIdentity } from 'table-identity';
import type { IPayloadData } from 'vona-module-a-jwt';

import type { TypeMcpScope } from '../types/index.ts';

import { sha256 } from './authorization.ts';

export type TypeMcpRefreshEvent =
  | 'mcp.oauth.refresh_succeeded'
  | 'mcp.oauth.refreshed_access_accepted';

/** Project verified grant state, never credentials, into operational evidence. */
export function mcpRefreshEvidence(
  event: TypeMcpRefreshEvent,
  payload: IMcpTokenPayload | IMcpLegacyTokenPayload,
) {
  const grant = payload.mcp;
  if (grant.version !== 1 || grant.generation <= 1) return undefined;
  return {
    event,
    family: sha256(
      JSON.stringify([
        'mcp-oauth-family-v1',
        grant.issuer,
        grant.resource,
        grant.instanceName,
        grant.clientId,
        grant.grantId,
      ]),
    ),
    generation: grant.generation,
  };
}

export interface IMcpAuthTokenInput {
  resource: string;
  clientId?: string;
  scope?: TypeMcpScope;
}

/** Local provenance for admitted opaque access tokens, never a JWT issuance payload. */
export interface IMcpLegacyTokenPayload extends IPayloadData {
  userId: TableIdentity;
  authId: TableIdentity;
  token: string;
  mcp: {
    version: 0;
    grantId: string;
    clientId: string;
    issuer: string;
    resource: string;
    instanceName: string;
    scope: TypeMcpScope;
  };
}

export interface IMcpTokenPayload extends IPayloadData {
  userId: TableIdentity;
  authId: TableIdentity;
  token: string;
  mcp: {
    version: 1;
    grantId: string;
    clientId: string;
    issuer: string;
    resource: string;
    instanceName: string;
    scope: TypeMcpScope;
    generation: number;
    refreshEnabled: boolean;
    refreshExpiresAt: number;
  };
}
