import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsProfile extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProfile>()
export class DtoProfile {
  @Api.field()
  id: number;

  @Api.field(v.email())
  email: string;
}
