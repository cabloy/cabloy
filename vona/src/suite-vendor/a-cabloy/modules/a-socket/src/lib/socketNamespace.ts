import type { PowerPartial } from 'vona';

import { createBeanDecorator } from 'vona';

import type { IDecoratorSocketNamespaceOptions } from '../types/socketNamespace.ts';

export function SocketNamespace<T extends IDecoratorSocketNamespaceOptions>(
  options?: PowerPartial<T>,
): ClassDecorator {
  return createBeanDecorator('socketNamespace', options);
}
