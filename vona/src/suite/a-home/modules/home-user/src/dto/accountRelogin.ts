import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsAccountRelogin extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccountRelogin>()
export class DtoAccountRelogin {
  @Api.field()
  requiresRelogin: true;
}
