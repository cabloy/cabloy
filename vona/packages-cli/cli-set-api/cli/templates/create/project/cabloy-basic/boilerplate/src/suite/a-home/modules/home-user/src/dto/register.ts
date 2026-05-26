import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoCaptchaVerify } from 'vona-module-a-captcha';
import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

export interface IDtoOptionsRegister extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRegister>({
  pipes: v.zodRefine('home-user:passwordConfirm'),
})
export class DtoRegister {
  @Api.field(v.zodRefine('home-user:usernameUnique'), v.min(3), v.trim())
  username: string;

  @Api.field(v.zodRefine('home-user:emailUnique'), v.email(), v.trim())
  email: string;

  @Api.field(v.min(6), v.max(20))
  password: string;

  @Api.field(v.min(6), v.max(20))
  passwordConfirm: string;

  @Api.field(ZovaRender.field('basic-captcha:formFieldCaptcha'))
  captcha: DtoCaptchaVerify;
}
