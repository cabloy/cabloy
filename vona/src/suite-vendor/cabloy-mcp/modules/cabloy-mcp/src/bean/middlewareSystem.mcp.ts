import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

import { mcpRequestSiteId } from '../lib/resourceServer.ts';

export interface IMiddlewareSystemOptionsMcp extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsMcp>({
  dependents: ['a-logger:httpLog', 'a-instance:app'],
})
export class MiddlewareSystemMcp extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsMcp, next: Next) {
    if (this.ctx.path !== '/mcp' && !mcpRequestSiteId(this.ctx.path)) return next();
    this.ctx.respond = false;
    const { handleMcpRequest } = await import('../lib/mcpTransport.ts');
    await handleMcpRequest(this.app, this.ctx.req, this.ctx.res);
  }
}
