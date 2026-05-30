import type { DtoCaptchaVerify } from 'vona-module-a-captcha';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

export interface IDtoOptionsSignin extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSignin>()
export class DtoSignin {
  @Api.field()
  username: string;

  @Api.field(v.min(3))
  password: string;

  @Api.field(ZovaRender.field('basic-captcha:formFieldCaptcha'))
  captcha: DtoCaptchaVerify;
}
