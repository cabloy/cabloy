import { createBeanDecorator } from 'vona';

import type { IDecoratorBeanTempOptions } from '../types/beanTemp.ts';

export function BeanTemp(options: IDecoratorBeanTempOptions): ClassDecorator {
  return createBeanDecorator(options.scene as any, options);
}
