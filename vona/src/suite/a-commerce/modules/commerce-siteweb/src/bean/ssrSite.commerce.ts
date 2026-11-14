import type { IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';
import type { IIconRecord, IPagePathRecord } from 'zova-rest-cabloy-commerce';

import { BeanSsrSiteBase, SsrSite } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

declare module 'vona-module-a-ssr' {
  export interface ISsrSiteIdRecord {
    commerce: never;
  }

  export interface ISsrSitePublicPathRecord {
    commerce: never;
  }
}

export interface ISsrSiteOptionsCommercePages extends IPagePathRecord {}

export interface ISsrSiteOptionsCommercePagesData {}

export interface ISsrSiteOptionsCommerce extends IDecoratorSsrSiteOptions<
  ISsrSiteOptionsCommercePages,
  ISsrSiteOptionsCommercePagesData,
  IIconRecord
> {}

@SsrSite<ISsrSiteOptionsCommerce>({
  siteId: 'commerce',
  title: $locale('SiteTitle'),
  publicPath: 'commerce',
  bundlePath: 'ssr-cabloyCommerce-5.0.0',
  diagnostics: {
    buildCommand: 'npm run build:zova:commerce:web',
  },
})
export class SsrSiteCommerce extends BeanSsrSiteBase<ISsrSiteOptionsCommerce> {}
