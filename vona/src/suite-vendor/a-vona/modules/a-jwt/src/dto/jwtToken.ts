import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import type { IJwtToken } from '../types/jwt.ts';

export interface IDtoOptionsJwtToken extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsJwtToken>()
export class DtoJwtToken implements IJwtToken {
  @Api.field()
  accessToken: string;

  @Api.field()
  refreshToken: string;

  @Api.field()
  expiresIn: number;
}
