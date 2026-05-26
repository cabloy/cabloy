import type { Next } from 'vona';
import type {
  IDecoratorSocketConnectionOptions,
  ISocketConnectionExecute,
} from 'vona-module-a-socket';
import type { WebSocket } from 'ws';

import { BeanBase } from 'vona';
import { SocketConnection } from 'vona-module-a-socket';

export interface ISocketConnectionOptionsCors extends IDecoratorSocketConnectionOptions {}

@SocketConnection<ISocketConnectionOptionsCors>({ dependencies: 'a-socket:instance' })
export class SocketConnectionCors extends BeanBase implements ISocketConnectionExecute {
  async enter(ws: WebSocket, _options: ISocketConnectionOptionsCors, next: Next): Promise<void> {
    // cors
    const origin = this.bean.security.checkOrigin(this.ctx.get('origin'), this.ctx.host);
    if (!origin) {
      ws.terminate();
      return;
    }
    // next
    return next();
  }

  async exit(_ws: WebSocket, _options: ISocketConnectionOptionsCors, next: Next): Promise<void> {
    // next
    return next();
  }
}
