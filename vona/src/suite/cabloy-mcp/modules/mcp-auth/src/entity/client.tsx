import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type {
  TypeMcpClientAuthentication,
  TypeMcpClientRegistrationState,
} from '../types/index.ts';

export interface IEntityOptionsClient extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsClient>('mcpAuthClient')
export class EntityClient extends EntityBase {
  @Api.field()
  clientId: string;

  @Api.field()
  name: string;

  @Api.field(v.array(z.string()))
  redirectUris: string[];

  @Api.field(z.enum(['none', 'client_secret_basic']))
  authentication: TypeMcpClientAuthentication;

  @Api.field(v.optional())
  secretSha256?: string;

  @Api.field()
  resource: string;

  @Api.field()
  scope: string;

  @Api.field(z.enum(['active', 'revoked']))
  state: TypeMcpClientRegistrationState;

  @Api.field()
  clientIdIssuedAt: number;
}
