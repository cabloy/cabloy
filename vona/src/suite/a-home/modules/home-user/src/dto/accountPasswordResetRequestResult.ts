import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsAccountPasswordResetRequestResult extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccountPasswordResetRequestResult>()
export class DtoAccountPasswordResetRequestResult {
  @Api.field(z.boolean())
  accepted: boolean;
}
