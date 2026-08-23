import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsAccountPasswordSet extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccountPasswordSet>({
  pipes: v.zodRefine('home-user:passwordConfirm', { passwordField: 'newPassword' }),
})
export class DtoAccountPasswordSet {
  @Api.field(v.min(32), v.max(255))
  token: string;

  @Api.field(
    v.title($locale('Password')),
    v.required(),
    v.min(6),
    v.max(20),
    ZovaRender.field('basic-input:formFieldInput', { type: 'password' }),
  )
  newPassword: string;

  @Api.field(
    v.title($locale('PasswordConfirm')),
    v.required(),
    v.min(6),
    v.max(20),
    ZovaRender.field('basic-input:formFieldInput', { type: 'password' }),
  )
  passwordConfirm: string;
}
