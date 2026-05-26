import type { Next } from 'vona';
import type { IDecoratorInterceptorOptions, IInterceptorExecute } from 'vona-module-a-aspect';

import { BeanBase, deepExtend } from 'vona';
import { Interceptor } from 'vona-module-a-aspect';

import type { IInterceptorOptionsSsrBase, TypeSsrRenderType } from '../types/ssrInterceptor.ts';

export interface IInterceptorOptionsSsrRender
  extends IDecoratorInterceptorOptions, IInterceptorOptionsSsrBase {
  renderType: TypeSsrRenderType;
}

@Interceptor<IInterceptorOptionsSsrRender>({
  site: '' as any,
  pagePath: '',
  renderType: 'auto',
})
export class InterceptorSsrRender extends BeanBase implements IInterceptorExecute {
  async execute(options: IInterceptorOptionsSsrRender, next: Next) {
    // next
    const res = await next();
    // handle
    if (!this.bean.bodyRes.handled) {
      await this._render(res, options);
    }
    // ok
    return res;
  }

  private async _render(res: any, options: IInterceptorOptionsSsrRender) {
    // renderType
    let renderType = options.renderType;
    if (renderType === 'auto') {
      renderType = this._getContentTypeAuto();
    }
    if (renderType !== 'html') return;
    // pageOptions
    const pageOptions = deepExtend({}, options.pageOptions, {
      data: res,
      params: this.ctx.request.params,
      query: this.ctx.request.query,
    });
    // render
    await this.bean.ssr.render(options.site as any, options.pagePath, pageOptions);
  }

  private _getContentTypeAuto(): TypeSsrRenderType {
    const contentType = this.bean.bodyRes.getResponseContentType();
    if (contentType === 'text/html') {
      return 'html';
    }
    return 'json';
  }
}
