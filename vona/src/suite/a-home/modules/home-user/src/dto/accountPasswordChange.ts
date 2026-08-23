import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsAccountPasswordChange extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccountPasswordChange>({
  pipes: v.zodRefine('home-user:passwordConfirm', { passwordField: 'newPassword' }),
})
export class DtoAccountPasswordChange {
  @Api.field(
    v.title($locale('CurrentPassword')),
    v.required(),
    v.min(6),
    v.max(20),
    ZovaRender.field('basic-input:formFieldInput', { type: 'password' }),
  )
  currentPassword: string;

  @Api.field(
    v.title($locale('NewPassword')),
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
