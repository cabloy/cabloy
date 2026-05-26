import { createBeanDecorator } from 'vona';

import type { IDecoratorAopMethodOptions } from '../../types/aopMethod.ts';

export function AopMethod<T extends IDecoratorAopMethodOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('aopMethod', options);
}
