import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

import { handleMcpResourceMetadata, mcpResourceMetadataPath } from '../lib/resourceServer.ts';

export interface IMiddlewareSystemOptionsResourceMetadata extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsResourceMetadata>({
  dependents: ['a-logger:httpLog', 'a-instance:app'],
})
export class MiddlewareSystemResourceMetadata extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsResourceMetadata, next: Next) {
    if (
      this.ctx.path !== mcpResourceMetadataPath &&
      !this.ctx.path.startsWith(`${mcpResourceMetadataPath}/`)
    ) {
      return next();
    }
    this.ctx.respond = false;
    handleMcpResourceMetadata(this.app, this.ctx.req, this.ctx.res);
  }
}
