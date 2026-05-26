import { createBeanDecorator } from 'vona';

import type { IDecoratorSsrMenuOptions } from '../types/ssrMenu.ts';

export function SsrMenu<T extends IDecoratorSsrMenuOptions<any>>(options?: T): ClassDecorator {
  return createBeanDecorator('ssrMenu', options);
}
