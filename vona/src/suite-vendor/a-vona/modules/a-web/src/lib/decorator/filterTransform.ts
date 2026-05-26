import { createBeanDecorator } from 'vona';

import type { IDecoratorFilterTransformOptions } from '../../types/filterTransform.ts';

export function FilterTransform<T extends IDecoratorFilterTransformOptions>(
  options?: T,
): ClassDecorator {
  return createBeanDecorator('filterTransform', options);
}
