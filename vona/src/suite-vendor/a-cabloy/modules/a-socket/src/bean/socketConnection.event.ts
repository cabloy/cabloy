import type { Next } from 'vona';
import type { WebSocket } from 'ws';

import { BeanBase, cast } from 'vona';

import type {
  IDecoratorSocketConnectionOptions,
  ISocketConnectionExecute,
} from '../types/socketConnection.ts';
import type { ISocketEventRecord } from '../types/socketEvent.ts';

import { SocketConnection } from '../lib/socketConnection.ts';
import { socketEventRecord } from '../types/socketEvent.ts';

export interface ISocketConnectionOptionsEvent extends IDecoratorSocketConnectionOptions {}

@SocketConnection<ISocketConnectionOptionsEvent>({ dependencies: 'a-socket:cors' })
export class SocketConnectionEvent extends BeanBase implements ISocketConnectionExecute {
  async enter(ws: WebSocket, _options: ISocketConnectionOptionsEvent, next: Next): Promise<void> {
    // sendEvent
    cast(ws).sendEvent = (eventName: keyof ISocketEventRecord, data, options, cb) => {
      if (typeof options === 'function') {
        cb = options;
        options = {};
      }
      const eventNameInner = socketEventRecord[eventName] ?? eventName;
      ws.send(
        `${this.scope.config.eventPrefix}${JSON.stringify([eventNameInner, data])}`,
        options,
        cb,
      );
    };
    // next
    return next();
  }

  async exit(_ws: WebSocket, _options: ISocketConnectionOptionsEvent, next: Next): Promise<void> {
    // next
    return next();
  }
}
