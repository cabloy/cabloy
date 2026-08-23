import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsAccountActivation extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccountActivation>()
export class DtoAccountActivation {
  @Api.field(v.min(32), v.max(255))
  token: string;
}
