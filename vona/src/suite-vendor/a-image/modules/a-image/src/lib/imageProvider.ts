import { createBeanDecorator } from 'vona';

import type { IDecoratorImageProviderOptions } from '../types/imageProvider.ts';

export function ImageProvider<T extends IDecoratorImageProviderOptions>(
  options?: T,
): ClassDecorator {
  return createBeanDecorator('imageProvider', options);
}
