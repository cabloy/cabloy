import { createBeanDecorator } from 'vona';

import type { IDecoratorInterceptorOptions } from '../../types/interceptor.ts';

export function Interceptor<T extends IDecoratorInterceptorOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('interceptor', options);
}
