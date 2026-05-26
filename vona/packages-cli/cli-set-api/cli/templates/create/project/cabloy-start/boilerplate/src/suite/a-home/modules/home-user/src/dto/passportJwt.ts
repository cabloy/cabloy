import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoJwtToken } from 'vona-module-a-jwt';
import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoPassport } from './passport.ts';

export interface IDtoOptionsPassportJwt extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPassportJwt>()
export class DtoPassportJwt {
  @Api.field()
  passport: DtoPassport;

  @Api.field()
  jwt: DtoJwtToken;
}
