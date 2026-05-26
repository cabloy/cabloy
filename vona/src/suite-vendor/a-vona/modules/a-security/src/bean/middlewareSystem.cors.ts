import type { Next, VonaContext } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import koaCors from '@koa/cors';
import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

export interface IMiddlewareSystemOptionsCors extends IDecoratorMiddlewareSystemOptions {
  whiteList: string | string[];
  origin: Function;
  allowMethods: string;
  exposeHeaders: string;
  allowHeaders: string;
  maxAge: string;
  credentials: boolean;
  keepHeadersOnError: boolean;
  secureContext: boolean;
  privateNetworkAccess: boolean;
}

@MiddlewareSystem<IMiddlewareSystemOptionsCors>({
  dependencies: 'a-instance:instance',
  whiteList: '*',
  origin: _corsOrigin,
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  exposeHeaders: '',
  allowHeaders: '',
  maxAge: '',
  credentials: false,
  keepHeadersOnError: false,
  secureContext: false,
  privateNetworkAccess: false,
})
export class MiddlewareSystemCors extends BeanBase implements IMiddlewareSystemExecute {
  private _cors: any;
  async execute(options: IMiddlewareSystemOptionsCors, next: Next) {
    if (!this._cors) {
      this._cors = koaCors(options);
    }
    // not cors (safari not send sec-fetch-mode)
    // if (ctx.headers['sec-fetch-mode'] !== 'cors') return await next();
    if (this.ctx.innerAccess) return next();

    // next
    return this._cors(this.ctx, next);
  }
}

function _corsOrigin(ctx: VonaContext) {
  return ctx.app.bean.security.checkOrigin(ctx.get('origin'), ctx.host);
}
