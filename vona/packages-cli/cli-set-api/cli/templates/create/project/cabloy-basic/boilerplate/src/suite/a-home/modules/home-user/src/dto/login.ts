import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoCaptchaVerify } from 'vona-module-a-captcha';
import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

export interface IDtoOptionsLogin extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsLogin>()
export class DtoLogin {
  @Api.field(v.required(), v.min(3), v.trim())
  username: string;

  @Api.field(v.required(), v.min(6))
  password: string;

  @Api.field(
    v.required(),
    ZovaRender.layout({ iconPrefix: ':editor:code-block' }),
    ZovaRender.field('basic-captcha:formFieldCaptcha'),
  )
  captcha: DtoCaptchaVerify;
}
