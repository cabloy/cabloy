import { createBeanDecorator } from 'vona';

import type { IDecoratorAopOptions } from '../../types/aop.ts';

export function Aop(options: IDecoratorAopOptions): ClassDecorator {
  return createBeanDecorator('aop', options);
}
