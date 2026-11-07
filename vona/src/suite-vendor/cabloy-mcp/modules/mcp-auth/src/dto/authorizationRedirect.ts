import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsAuthorizationRedirect extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAuthorizationRedirect>()
export class DtoAuthorizationRedirect {
  @Api.field(z.string())
  redirectUrl: string;
}
