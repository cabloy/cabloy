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
      const sites = this.bean.onion.ssrSite.getOnionsEnabled(this.ctx.instanceName!).toReversed();
      const siteIds = new Map<string, string>();
      const publicPaths = new Map<string, string>();
      for (const site of sites) {
        const siteOptions = site.beanOptions.options as IDecoratorSsrSiteOptions;
        const beanFullName = site.beanOptions.beanFullName;
        const siteId = siteOptions.siteId;
        if (typeof siteId !== 'string' || !siteId.trim()) {
          throw new Error(
            `Should specify non-empty siteId for SSR site: ${beanFullName} (${cacheKey})`,
          );
        }
        const siteIdDuplicate = siteIds.get(siteId);
        if (siteIdDuplicate) {
          throw new Error(
            `Duplicate SSR siteId "${siteId}" for ${siteIdDuplicate} and ${beanFullName} (${cacheKey})`,
          );
        }
        siteIds.set(siteId, beanFullName);
        const publicPath = siteOptions.publicPath;
        if (typeof publicPath !== 'string') {
          throw new TypeError(
            `Should specify publicPath for SSR site: ${beanFullName} (${cacheKey})`,
          );
        }
        const publicPathDuplicate = publicPaths.get(publicPath);
        if (publicPathDuplicate) {
          throw new Error(
            `Duplicate SSR publicPath "${publicPath}" for ${publicPathDuplicate} and ${beanFullName} (${cacheKey})`,
          );
        }
        publicPaths.set(publicPath, beanFullName);
      }
      this.app.meta[SymbolCacheSites][cacheKey] = sites.sort((site1, site2) => {
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
