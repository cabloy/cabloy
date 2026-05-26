import { createBeanDecorator } from 'vona';

import type { IDecoratorSerializerTransformOptions } from '../types/serializerTransform.ts';

export function SerializerTransform<T extends IDecoratorSerializerTransformOptions>(
  options?: T,
): ClassDecorator {
  return createBeanDecorator('serializerTransform', options);
}
