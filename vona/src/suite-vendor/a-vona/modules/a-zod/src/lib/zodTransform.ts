import { createBeanDecorator } from 'vona';

import type { IDecoratorZodTransformOptions } from '../types/zodTransform.ts';

export function ZodTransform<T extends IDecoratorZodTransformOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('zodTransform', options);
}
