import { createBeanDecorator } from 'vona';

import type { IDecoratorPayProviderOptions } from '../types/payProvider.ts';

export function PayProvider<T extends IDecoratorPayProviderOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('payProvider', options);
}
