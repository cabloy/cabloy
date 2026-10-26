import { BeanBase } from 'vona';
import { CaptchaScene } from 'vona-module-a-captcha';

@CaptchaScene({
  providers: {
    'test-captcha:bound': true,
  },
})
export class CaptchaSceneBound extends BeanBase {}
