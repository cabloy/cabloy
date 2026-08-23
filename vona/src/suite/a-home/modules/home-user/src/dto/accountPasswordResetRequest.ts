import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoCaptchaVerify } from 'vona-module-a-captcha';
import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

export interface IDtoOptionsAccountPasswordResetRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccountPasswordResetRequest>()
export class DtoAccountPasswordResetRequest {
  @Api.field(v.email(), v.trim())
  email: string;

  @Api.field(v.min(1), v.max(2048), v.trim())
  consumerUrl: string;

  @Api.field(v.required(), ZovaRender.field('basic-captcha:formFieldCaptcha'))
  captcha: DtoCaptchaVerify;
}
