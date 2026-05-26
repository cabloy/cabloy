import { createBeanDecorator } from 'vona';

import type { IDecoratorBroadcastOptions } from '../types/broadcast.ts';

export function Broadcast(options?: IDecoratorBroadcastOptions): ClassDecorator {
  return createBeanDecorator('broadcast', options);
}
