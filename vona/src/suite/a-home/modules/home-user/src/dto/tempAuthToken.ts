import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsTempAuthToken extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsTempAuthToken>()
export class DtoTempAuthToken {
  @Api.field()
  token: string;

  @Api.field()
  expiresIn: number;
}
