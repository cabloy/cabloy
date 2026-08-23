import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoCaptchaVerify } from 'vona-module-a-captcha';
import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsRegister extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRegister>({
  pipes: v.zodRefine('home-user:passwordConfirm'),
})
export class DtoRegister {
  @Api.field(
    v.title($locale('UserName')),
    v.required(),
    v.zodRefine('home-user:usernameUnique'),
    v.min(3),
    v.trim(),
    ZovaRender.field('basic-input:formFieldInput', { type: 'text' }),
  )
  username: string;

  @Api.field(
    v.title($locale('UserEmail')),
    v.required(),
    v.zodRefine('home-user:emailUnique'),
    v.email(),
    v.trim(),
    ZovaRender.field('basic-input:formFieldInput', { type: 'email' }),
  )
  email: string;

  @Api.field(v.min(1), v.max(2048), v.trim())
  consumerUrl: string;

  @Api.field(
    v.title($locale('Password')),
    v.required(),
    v.min(6),
    v.max(20),
    ZovaRender.field('basic-input:formFieldInput', { type: 'password' }),
  )
  password: string;

  @Api.field(
    v.title($locale('PasswordConfirm')),
    v.required(),
    v.min(6),
    v.max(20),
    ZovaRender.field('basic-input:formFieldInput', { type: 'password' }),
  )
  passwordConfirm: string;

  @Api.field(
    v.title($locale('Captcha')),
    v.required(),
    ZovaRender.field('basic-captcha:formFieldCaptcha'),
  )
  captcha: DtoCaptchaVerify;
}
