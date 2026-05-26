import type { IOnionSlice } from 'vona-module-a-onion';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IDecoratorSsrSiteOptions, ISsrSiteRecord } from '../types/ssrSite.ts';

import { SymbolCacheSites } from '../lib/const.ts';

@Service()
export class ServiceSsr extends BeanBase {
  public getSitesEnabled(): IOnionSlice<ISsrSiteRecord, keyof ISsrSiteRecord, unknown>[] {
    const instanceName = this.ctx.instanceName;
    const host = this.ctx.host;
    const cacheKey = `${instanceName}:${host}`;
    if (!this.app.meta[SymbolCacheSites]) this.app.meta[SymbolCacheSites] = {};
    if (!this.app.meta[SymbolCacheSites][cacheKey]) {
      // check sites
      this.app.meta[SymbolCacheSites][cacheKey] = this.bean.onion.ssrSite
        .getOnionsEnabled(this.ctx.instanceName!)
        .toReversed()
        .sort((site1, site2) => {
          const siteOptions1 = site1.beanOptions.options as IDecoratorSsrSiteOptions;
          const siteOptions2 = site2.beanOptions.options as IDecoratorSsrSiteOptions;
          const publicPath1 = `/${siteOptions1.publicPath}`;
          const publicPath2 = `/${siteOptions2.publicPath}`;
          return publicPath1 === publicPath2
            ? 0
            : publicPath1.startsWith(publicPath2)
              ? -1
              : publicPath2.startsWith(publicPath1)
                ? 1
                : 0;
        });
    }
    return this.app.meta[SymbolCacheSites][cacheKey];
  }

  public prepareMenuLink(
    link?: keyof IDecoratorSsrSiteOptions['pages'],
  ): keyof IDecoratorSsrSiteOptions['pages'] | undefined {
    if (!link) return link;
    return (this.scope.config.menuItemLinkPreset[link] as any) || link;
  }
}
