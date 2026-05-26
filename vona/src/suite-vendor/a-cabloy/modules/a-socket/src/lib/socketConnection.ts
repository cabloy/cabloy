import { createBeanDecorator } from 'vona';

import type { IDecoratorSocketConnectionOptions } from '../types/socketConnection.ts';

export function SocketConnection<T extends IDecoratorSocketConnectionOptions>(
  options?: T,
): ClassDecorator {
  return createBeanDecorator('socketConnection', options);
}
