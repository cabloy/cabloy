import type { Next } from 'vona';
import type { WebSocket } from 'ws';

import { BeanBase } from 'vona';

import type { TypeSocketPacketEvent } from '../types/socketEvent.ts';
import type { IDecoratorSocketPacketOptions, ISocketPacketExecute } from '../types/socketPacket.ts';

import { SocketPacket } from '../lib/socketPacket.ts';
import { socketEventRecordReverse } from '../types/socketEvent.ts';

export interface ISocketPacketOptionsEvent extends IDecoratorSocketPacketOptions {}

@SocketPacket<ISocketPacketOptionsEvent>()
export class SocketPacketEvent extends BeanBase implements ISocketPacketExecute {
  async execute(
    data: any,
    _ws: WebSocket,
    _options: ISocketPacketOptionsEvent,
    next: Next,
  ): Promise<void> {
    let packet: TypeSocketPacketEvent;
    const eventPrefix = this.scope.config.eventPrefix;
    if (typeof data === 'string' && data.startsWith(eventPrefix)) {
      const packetInner = JSON.parse(data.substring(eventPrefix.length));
      const eventName = socketEventRecordReverse[packetInner[0]] ?? packetInner[0];
      packet = [eventName, packetInner[1]];
    } else {
      packet = [undefined, data];
    }
    // next
    return next(packet);
  }
}
