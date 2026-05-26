import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsTestQuery extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsTestQuery>()
export class DtoTestQuery {
  @Api.field(v.min(3))
  name: string;
}
