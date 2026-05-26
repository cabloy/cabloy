import { createBeanDecorator } from 'vona';

import type { IDecoratorCaptchaSceneOptions } from '../types/captchaScene.ts';

export function CaptchaScene(options: IDecoratorCaptchaSceneOptions): ClassDecorator {
  return createBeanDecorator('captchaScene', options);
}
