import type { Next } from 'vona';
import type {
  IDecoratorSocketConnectionOptions,
  ISocketConnectionExecute,
} from 'vona-module-a-socket';
import type { WebSocket } from 'ws';

import { BeanBase } from 'vona';
import { SocketConnection } from 'vona-module-a-socket';

export interface ISocketConnectionOptionsAlive extends IDecoratorSocketConnectionOptions {}

@SocketConnection<ISocketConnectionOptionsAlive>()
export class SocketConnectionAlive extends BeanBase implements ISocketConnectionExecute {
  private _interval: any;

  protected async __dispose__() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  async enter(ws: WebSocket, _options: ISocketConnectionOptionsAlive, next: Next): Promise<void> {
    // isAlive
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });
    // start interval
    this._startInterval();
    // next
    return next();
  }

  async exit(_ws: WebSocket, _options: ISocketConnectionOptionsAlive, next: Next): Promise<void> {
    // next
    await next();
  }

  private _startInterval() {
    if (this._interval) return;
    this._interval = setInterval(() => {
      this.app.wss.clients.forEach(ws => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
      });
    }, this.scope.config.timeout.ping);
  }
}
