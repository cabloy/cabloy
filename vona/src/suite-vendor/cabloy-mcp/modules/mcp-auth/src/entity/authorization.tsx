import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type { IMcpToolIdentity, TypeMcpAuthorizationState } from '../types/index.ts';

import { DtoMcpToolIdentity } from '../dto/mcpTool.ts';

export interface IEntityOptionsAuthorization extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsAuthorization>('mcpAuthAuthorization')
export class EntityAuthorization extends EntityBase {
  @Api.field()
  requestDigest: string;

  @Api.field(v.tableIdentity())
  clientId: TableIdentity;

  @Api.field()
  oauthClientId: string;

  @Api.field()
  issuer: string;

  @Api.field()
  resource: string;

  @Api.field()
  redirectUri: string;

  @Api.field()
  scope: string;

  @Api.field(z.string().default(''))
  requestedScope: string;

  @Api.field(v.array(v.object(DtoMcpToolIdentity)), v.default([]))
  scopeTools: IMcpToolIdentity[];

  @Api.field(z.boolean().default(false))
  scopeReadOnly: boolean;

  @Api.field()
  oauthState: string;

  @Api.field()
  codeChallenge: string;

  @Api.field(z.enum(['pending', 'codeReady', 'tokenActive', 'denied', 'revoked']))
  state: TypeMcpAuthorizationState;

  @Api.field()
  pendingExpiresAt: number;

  @Api.field()
  expiresAt: number;

  @Api.field()
  codeDigest: string;

  @Api.field()
  codeExpiresAt: number;

  @Api.field()
  tokenDigest: string;

  @Api.field()
  tokenExpiresAt: number;

  @Api.field(z.number().int().nonnegative().default(0))
  tokenVersion: number;

  @Api.field(z.boolean().default(false))
  refreshEnabled: boolean;

  @Api.field(z.number().int().nonnegative().default(0))
  refreshGeneration: number;

  @Api.field(z.number().int().nonnegative().default(0))
  refreshExpiresAt: number;

  @Api.field(v.tableIdentity(), v.optional())
  userId?: TableIdentity;

  @Api.field(v.tableIdentity(), v.optional())
  authId?: TableIdentity;
}
