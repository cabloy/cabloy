import { createBeanDecorator } from 'vona';

import type { IDecoratorDatabaseDialectOptions } from '../types/index.ts';

export function DatabaseDialect<T extends IDecoratorDatabaseDialectOptions>(
  options?: T,
): ClassDecorator {
  return createBeanDecorator('databaseDialect', options);
}
