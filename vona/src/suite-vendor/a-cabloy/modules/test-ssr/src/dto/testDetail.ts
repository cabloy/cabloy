import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsTestDetail extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsTestDetail>()
export class DtoTestDetail {
  @Api.field()
  name: string;

  @Api.field()
  price: number;

  @Api.field()
  quantity: number;

  @Api.field()
  amount: number;
}
