import type { Next } from 'vona';
import type { IDecoratorInterceptorOptions, IInterceptorExecute } from 'vona-module-a-aspect';

import { zodCustomError } from '@cabloy/utils';
import { BeanBase } from 'vona';
import { Interceptor } from 'vona-module-a-aspect';

import type { DtoCaptchaVerify } from '../dto/captchaVerify.ts';
import type { ICaptchaSceneRecord } from '../types/captchaScene.ts';

export interface IInterceptorOptionsCaptchaVerify extends IDecoratorInterceptorOptions {
  scene?: keyof ICaptchaSceneRecord;
  bodyField?: string;
}

@Interceptor<IInterceptorOptionsCaptchaVerify>({
  bodyField: 'captcha',
})
export class InterceptorCaptchaVerify extends BeanBase implements IInterceptorExecute {
  async execute(options: IInterceptorOptionsCaptchaVerify, next: Next) {
    // scene
    const sceneName = options.scene;
    if (!sceneName) throw new Error('should specify the captchaVerify scene name');
    // captcha
    const bodyField = options.bodyField!;
    const captcha: DtoCaptchaVerify | undefined = this.ctx.request.body[bodyField];
    if (!captcha) throw new Error('not found captcha data');
    if (typeof captcha !== 'object') throw new Error('not found valid captcha data');
    // verify
    const verified = await this.bean.captcha.verify(captcha.id, captcha.token, sceneName);
    if (!verified) throw zodCustomError([bodyField], this.scope.locale.CaptchaInvalid());
    // next
    return next();
  }
}
