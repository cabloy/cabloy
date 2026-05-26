import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsCaptchaVerify extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCaptchaVerify>()
export class DtoCaptchaVerify {
  @Api.field(v.required())
  id: string;

  @Api.field(v.required())
  token: string; // must set string, so as to let v.required take effect
}
