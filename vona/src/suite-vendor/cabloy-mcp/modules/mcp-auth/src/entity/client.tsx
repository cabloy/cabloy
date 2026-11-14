import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type {
  TypeMcpClientAuthentication,
  TypeMcpClientRegistrationState,
  TypeMcpGrantTypes,
} from '../types/index.ts';

export interface IEntityOptionsClient extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsClient>('mcpAuthClient')
export class EntityClient extends EntityBase {
  @Api.field()
  oauthClientId: string;

  @Api.field()
  name: string;

  @Api.field(v.array(z.string()))
  redirectUris: string[];

  @Api.field(
    z
      .union([
        z.tuple([z.literal('authorization_code')]),
        z.tuple([z.literal('authorization_code'), z.literal('refresh_token')]),
      ])
      .default(['authorization_code']),
  )
  grantTypes: TypeMcpGrantTypes;

  @Api.field(z.enum(['none', 'client_secret_basic']))
  authentication: TypeMcpClientAuthentication;

  @Api.field(v.optional())
  secretSha256?: string;

  @Api.field()
  issuer: string;

  @Api.field()
  scope: string;

  @Api.field(z.enum(['active', 'revoked']))
  state: TypeMcpClientRegistrationState;

  @Api.field()
  clientIdIssuedAt: number;
}
