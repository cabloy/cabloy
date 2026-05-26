import { createBeanDecorator } from 'vona';

import type { IDecoratorMiddlewareSystemOptions } from '../../types/middlewareSystem.ts';

export function MiddlewareSystem<T extends IDecoratorMiddlewareSystemOptions>(
  options?: T,
): ClassDecorator {
  return createBeanDecorator('middlewareSystem', options);
}
