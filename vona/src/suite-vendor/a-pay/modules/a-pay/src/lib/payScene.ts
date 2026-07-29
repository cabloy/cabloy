import { createBeanDecorator } from 'vona';

import type { IDecoratorPaySceneOptions } from '../types/payScene.ts';

export function PayScene(options?: IDecoratorPaySceneOptions): ClassDecorator {
  return createBeanDecorator('payScene', options);
}
