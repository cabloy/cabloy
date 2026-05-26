import type { Next } from 'vona';
import type {
  IDecoratorSocketConnectionOptions,
  ISocketConnectionExecute,
} from 'vona-module-a-socket';
import type { WebSocket } from 'ws';

import { BeanBase } from 'vona';
import { SocketConnection } from 'vona-module-a-socket';

export interface ISocketConnectionOptionsReady extends IDecoratorSocketConnectionOptions {}

@SocketConnection<ISocketConnectionOptionsReady>({ dependencies: 'a-socket:passport' })
export class SocketConnectionReady extends BeanBase implements ISocketConnectionExecute {
  async enter(_ws: WebSocket, _options: ISocketConnectionOptionsReady, next: Next): Promise<void> {
    // next
    return next();
  }

  async exit(_ws: WebSocket, _options: ISocketConnectionOptionsReady, next: Next): Promise<void> {
    // next
    return next();
  }
}
