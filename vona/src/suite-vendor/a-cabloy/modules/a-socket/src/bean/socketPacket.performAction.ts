import type { Next } from 'vona';
import type { WebSocket } from 'ws';

import { BeanBase } from 'vona';

import type {
  ISocketEventPerformActionOptionsInner,
  ISocketEventRecord,
  ISocketEventRecordSystem,
  TypeSocketPacketEvent,
} from '../types/socketEvent.ts';
import type { IDecoratorSocketPacketOptions, ISocketPacketExecute } from '../types/socketPacket.ts';

import { SocketPacket } from '../lib/socketPacket.ts';

export interface ISocketPacketOptionsPerformAction extends IDecoratorSocketPacketOptions {}

@SocketPacket<ISocketPacketOptionsPerformAction>({ dependencies: 'a-socket:event' })
export class SocketPacketPerformAction extends BeanBase implements ISocketPacketExecute {
  async execute(
    packet: TypeSocketPacketEvent,
    ws: WebSocket,
    _options: ISocketPacketOptionsPerformAction,
    next: Next,
  ): Promise<void> {
    const eventName: keyof ISocketEventRecord | undefined = packet[0];
    const data: ISocketEventPerformActionOptionsInner = packet[1];
    if (eventName !== ('sysPerformAction' satisfies keyof ISocketEventRecordSystem)) return next();
    try {
      // performAction
      const res = await this.$scope.executor.service.executor.performActionInner(
        data.m,
        data.p as never,
        {
          innerAccess: false,
          query: data.q,
          body: data.b,
          headers: data.h,
        },
      );
      ws.sendEvent(
        'sysPerformActionBack' satisfies keyof ISocketEventRecordSystem as never,
        { i: data.i, c: 0, d: res } as never,
      );
    } catch (err: any) {
      ws.sendEvent(
        'sysPerformActionBack' satisfies keyof ISocketEventRecordSystem as never,
        { i: data.i, c: err.code, m: err.message } as never,
      );
    }
  }
}
