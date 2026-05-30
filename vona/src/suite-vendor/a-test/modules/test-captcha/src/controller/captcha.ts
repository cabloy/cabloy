import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoSignin } from '../dto/signin.ts';

export interface IControllerOptionsCaptcha extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsCaptcha>({ path: 'captcha', meta: { mode: ['test', 'dev'] } })
export class ControllerCaptcha extends BeanBase {
  @Web.post('signin')
  @Passport.public()
  @Core.captchaVerify({ scene: 'captcha-simple:simple' })
  async signin(@Arg.body() _user: DtoSignin) {}
}
