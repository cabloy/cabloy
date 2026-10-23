import { createBeanDecorator } from 'zova';

import type { IDecoratorModelOptions } from '../types/model.ts';

export function Model<T extends IDecoratorModelOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('model', 'ctx', true, options);
}
