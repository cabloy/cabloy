import { createBeanDecorator } from 'vona';

import type { IDecoratorFileProviderOptions } from '../types/fileProvider.ts';

export function FileProvider<T extends IDecoratorFileProviderOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('fileProvider', options);
}
