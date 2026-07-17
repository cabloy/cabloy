import type { IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';
import type { IIconRecord, IPagePathRecord } from 'zova-rest-cabloy-commerce-admin';

import { BeanSsrSiteBase, SsrSite } from 'vona-module-a-ssr';

declare module 'vona-module-a-ssr' {
  export interface ISsrSiteIdRecord {
    commerceAdmin: never;
  }

  export interface ISsrSitePublicPathRecord {
    'commerce-admin': never;
  }
}

export interface ISsrSiteOptionsCommerceAdminPages extends IPagePathRecord {}

export interface ISsrSiteOptionsCommerceAdminPagesData {}

export interface ISsrSiteOptionsCommerceAdmin extends IDecoratorSsrSiteOptions<
  ISsrSiteOptionsCommerceAdminPages,
  ISsrSiteOptionsCommerceAdminPagesData,
  IIconRecord
> {}

@SsrSite<ISsrSiteOptionsCommerceAdmin>({
  siteId: 'commerceAdmin',
  publicPath: 'commerce-admin',
  bundlePath: 'ssr-cabloyCommerceAdmin-5.0.0',
  diagnostics: {
    buildCommand: 'npm run build:zova:commerce-admin',
  },
})
export class SsrSiteCommerceAdmin extends BeanSsrSiteBase<ISsrSiteOptionsCommerceAdmin> {}
