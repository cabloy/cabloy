import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { ModelAuthorization } from '../model/authorization.ts';

export interface IDtoOptionsAccessToken extends IDecoratorDtoOptions {}

export const accessTokenColumns = ['id', 'name', 'scope', 'createdAt', 'tokenExpiresAt'] as const;

@Dto<IDtoOptionsAccessToken>()
export class DtoAccessToken extends $Dto.get(() => ModelAuthorization, {
  columns: [...accessTokenColumns],
}) {
  @Api.field(z.enum(['active', 'expired', 'revoked']))
  status: 'active' | 'expired' | 'revoked';
}
