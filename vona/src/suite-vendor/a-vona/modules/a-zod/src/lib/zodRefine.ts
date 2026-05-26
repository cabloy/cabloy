import { createBeanDecorator } from 'vona';

import type { IDecoratorZodRefineOptions } from '../types/zodRefine.ts';

export function ZodRefine<T extends IDecoratorZodRefineOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('zodRefine', options);
}
