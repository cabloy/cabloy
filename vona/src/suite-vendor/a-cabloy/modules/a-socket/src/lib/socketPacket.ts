import { createBeanDecorator } from 'vona';

import type { IDecoratorSocketPacketOptions } from '../types/socketPacket.ts';

export function SocketPacket<T extends IDecoratorSocketPacketOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('socketPacket', options);
}
