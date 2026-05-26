import type { TypeEventResolvePathResult } from 'vona-module-a-static';

import fs from 'node:fs';
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IErrorRenderOptions } from '../types/error.ts';

const __cacheViewTemplates: Record<string, any> = {};

@Bean()
export class BeanError extends BeanBase {
  async render(err: Error, options?: IErrorRenderOptions): Promise<TypeEventResolvePathResult> {
    // // ssr
    // const ssrSite = this.scope.config.error.ssr.site;
    // const pagePath = this.scope.config.error.ssr.pagePath;
    // const beanSsr = this.bean.ssr;
    // if (ssrSite && pagePath && beanSsr) {
    //   const html = await beanSsr.render(
    //     ssrSite as any,
    //     pagePath,
    //     this.scope.service.errorView.getErrorData(err),
    //     { returnHtml: options?.returnHtml },
    //   );
    //   if (html) return html;
    // }
    // template
    const html = this.scope.service.errorView.toHTML(err, this._getViewTemplate());
    if (options?.returnHtml) return html;
    this.ctx.res.statusCode = 200;
    this.ctx.res.setHeader('Content-Type', 'text/html');
    this.ctx.res.end(html);
  }

  private _getViewTemplate() {
    const fileTemplate =
      this.scope.config.error.templatePath ||
      this.scope.asset.get('templates', 'onerror_page.mustache');
    if (!__cacheViewTemplates[fileTemplate]) {
      __cacheViewTemplates[fileTemplate] = fs.readFileSync(fileTemplate, 'utf8');
    }
    return __cacheViewTemplates[fileTemplate];
  }
}
