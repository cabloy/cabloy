import { createBeanDecorator } from 'vona';

import type { IDecoratorFilterOptions } from '../../types/filter.ts';

export function Filter<T extends IDecoratorFilterOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('filter', options);
}
