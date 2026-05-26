import { createBeanDecorator } from 'vona';

import type { IDecoratorStartupOptions } from '../types/startup.ts';

export function Startup(options?: IDecoratorStartupOptions): ClassDecorator {
  return createBeanDecorator('startup', options);
}
