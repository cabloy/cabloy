import type { IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoSiteCatalogSelectRes } from '../dto/siteCatalogSelectRes.ts';

@Service()
export class ServiceSiteCatalog extends BeanBase {
  async select(): Promise<DtoSiteCatalogSelectRes> {
    const list = this.app
      .scope('a-ssr')
      .service.ssr.getSitesEnabled()
      .map(site => {
        const options = site.beanOptions.options as IDecoratorSsrSiteOptions;
        return {
          siteId: String(options.siteId),
          title: this.app.meta.text.locale(this.ctx.locale, options.title),
        };
      });
    return {
      list,
      total: String(list.length),
      pageCount: 1,
      pageSize: list.length,
      pageNo: 1,
    } as DtoSiteCatalogSelectRes;
  }
}
