import { createBeanDecorator } from 'vona';

import type { IDecoratorCaptchaProviderOptions } from '../types/captchaProvider.ts';

export function CaptchaProvider<T extends IDecoratorCaptchaProviderOptions>(
  options?: T,
): ClassDecorator {
  return createBeanDecorator('captchaProvider', options);
}
