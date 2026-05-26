import type { Next } from 'vona';
import type {
  IDecoratorSocketConnectionOptions,
  ISocketConnectionExecute,
} from 'vona-module-a-socket';
import type { WebSocket } from 'ws';

import { BeanBase } from 'vona';
import { SocketConnection } from 'vona-module-a-socket';

export interface ISocketConnectionOptionsPassport extends IDecoratorSocketConnectionOptions {}

@SocketConnection<ISocketConnectionOptionsPassport>({ dependencies: 'a-socket:event' })
export class SocketConnectionPassport extends BeanBase implements ISocketConnectionExecute {
  async enter(
    ws: WebSocket,
    _options: ISocketConnectionOptionsPassport,
    next: Next,
  ): Promise<void> {
    // checkOauthCode
    await this._checkOauthCode(ws);
    // next
    return next();
  }

  async exit(
    _ws: WebSocket,
    _options: ISocketConnectionOptionsPassport,
    next: Next,
  ): Promise<void> {
    // next
    return next();
  }

  private async _checkOauthCode(_ws: WebSocket) {
    // auth token
    if (!this.bean.passport.current) {
      const code = this.ctx.query[this.scope.config.queryKey.passportCode] as string | undefined;
      if (code) {
        await this.bean.passport.checkAuthToken(code, 'access', { path: this.ctx.path });
      }
    }
    // check current
    if (!this.bean.passport.current) {
      await this.bean.passport.signinWithAnonymous();
    }
  }
}
