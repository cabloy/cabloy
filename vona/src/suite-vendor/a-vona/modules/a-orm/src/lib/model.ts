import { createBeanDecorator } from 'vona';

import type { IDecoratorModelOptions } from '../types/onion/model.ts';

export function Model<T extends IDecoratorModelOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('model', options);
}
