import type { Next } from 'vona';
import type { IDecoratorInterceptorOptionsGlobal, IInterceptorExecute } from 'vona-module-a-aspect';

import { $protocolKey, BeanBase, Global } from 'vona';
import { Interceptor } from 'vona-module-a-aspect';

export interface IInterceptorOptionsOpenapiSchema extends IDecoratorInterceptorOptionsGlobal {}

@Interceptor<IInterceptorOptionsOpenapiSchema>()
@Global()
export class InterceptorOpenapiSchema extends BeanBase implements IInterceptorExecute {
  async execute(_options: IInterceptorOptionsOpenapiSchema, next: Next) {
    const headerOpenapiSchema = this.ctx.headers[$protocolKey('x-vona-openapi-schema')];
    if (headerOpenapiSchema?.toString() !== 'true') return next();
    // openapi-schema
    const route = this.ctx.route;
    const doc = await this.bean.openapi.generateJsonOfControllerAction(
      route.controller,
      route.action,
      'V31',
    );
    this.app.success({ doc });
  }
}
