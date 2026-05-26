import { createBeanDecorator } from 'vona';

import type { IDecoratorGuardOptions } from '../../types/guard.ts';

export function Guard<T extends IDecoratorGuardOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('guard', options);
}
