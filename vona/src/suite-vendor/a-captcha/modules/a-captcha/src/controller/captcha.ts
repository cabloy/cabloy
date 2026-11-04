import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import z from 'zod';

import { DtoCaptchaData } from '../dto/captchaData.ts';

export interface IControllerOptionsCaptcha extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsCaptcha>('captcha')
export class ControllerCaptcha extends BeanBase {
  @Web.post('create')
  @Api.body(DtoCaptchaData)
  @Passport.public()
  async create(
    @Arg.body('scene') scene: string,
    @Arg.body('payload', z.unknown().optional()) payload?: unknown,
  ) {
    this.ctx.set('Cache-Control', 'no-store');
    return await this.bean.captcha.create(scene as any, payload);
  }

  @Web.post('refresh')
  @Api.body(DtoCaptchaData)
  @Passport.public()
  async refresh(
    @Arg.body('id', z.string().optional()) id: string | undefined,
    @Arg.body('scene') scene: string,
    @Arg.body('payload', z.unknown().optional()) payload?: unknown,
  ) {
    this.ctx.set('Cache-Control', 'no-store');
    return await this.bean.captcha.refresh(id, scene as any, payload);
  }

  @Web.post('verifyImmediate')
  @Api.body(z.string())
  @Passport.public()
  async verifyImmediate(
    @Arg.body('id') id: string,
    @Arg.body('token') token: unknown,
  ): Promise<string> {
    const verified = await this.bean.captcha.verifyImmediate(id, token);
    if (!verified) this.app.throw(403);
    return verified;
  }
}
