import { BeanBase } from 'vona';
import { CaptchaScene } from 'vona-module-a-captcha';

@CaptchaScene({
  resolver: async (_ctx, _providers) => {
    return 'captcha-simple:imageText';
  },
  providers: {
    'captcha-simple:imageText': true,
  },
})
export class CaptchaSceneSimple extends BeanBase {}
