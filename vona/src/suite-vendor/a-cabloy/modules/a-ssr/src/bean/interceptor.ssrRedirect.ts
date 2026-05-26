import type { Next } from 'vona';
import type { IDecoratorInterceptorOptions, IInterceptorExecute } from 'vona-module-a-aspect';

import { BeanBase, deepExtend } from 'vona';
import { Interceptor } from 'vona-module-a-aspect';

import type { IInterceptorOptionsSsrBase, TypeSsrRenderType } from '../types/ssrInterceptor.ts';

export interface IInterceptorOptionsSsrRedirect
  extends IDecoratorInterceptorOptions, IInterceptorOptionsSsrBase {
  redirectOnly: boolean;
}

@Interceptor<IInterceptorOptionsSsrRedirect>({
  site: '' as any,
  pagePath: '',
  redirectOnly: false,
})
export class InterceptorSsrRedirect extends BeanBase implements IInterceptorExecute {
  async execute(options: IInterceptorOptionsSsrRedirect, next: Next) {
    // redirect
    if (await this._redirect(options)) return;
    // redirectOnly
    if (options.redirectOnly) {
      throw new Error('Only support redirect mode');
    }
    // next
    return next();
  }

  private async _redirect(options: IInterceptorOptionsSsrRedirect): Promise<undefined | never> {
    // renderType
    const renderType = this._getContentTypeAuto();
    if (renderType !== 'html') return;
    // pageOptions
    const pageOptions = deepExtend({}, options.pageOptions, {
      params: this.ctx.request.params,
      query: this.ctx.request.query,
    });
    // redirect
    return await this.bean.ssr.redirect(options.site as any, options.pagePath, pageOptions);
  }

  private _getContentTypeAuto(): TypeSsrRenderType {
    const contentType = this.bean.bodyRes.getResponseContentType();
    if (contentType === 'text/html') {
      return 'html';
    }
    return 'json';
  }
}
