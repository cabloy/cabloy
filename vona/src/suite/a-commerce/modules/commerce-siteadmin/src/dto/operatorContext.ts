import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsOperatorContext extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOperatorContext>()
export class DtoOperatorContext {
  @Api.field()
  instanceId: string;

  @Api.field()
  instanceName: string;

  @Api.field()
  userId: string;

  @Api.field()
  userName: string;
}
