import type { IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';
import type { IIconRecord, IPagePathRecord } from 'zova-rest-cabloy-basic-admin';

import { BeanSsrSiteBase, SsrSite } from 'vona-module-a-ssr';

declare module 'vona-module-a-ssr' {
  export interface ISsrSiteIdRecord {
    admin: never;
  }

  export interface ISsrSitePublicPathRecord {
    admin: never;
  }
}

export interface ISsrSiteOptionsAdminPages extends IPagePathRecord {}

export interface ISsrSiteOptionsAdminPagesData {}

export interface ISsrSiteOptionsAdmin extends IDecoratorSsrSiteOptions<
  ISsrSiteOptionsAdminPages,
  ISsrSiteOptionsAdminPagesData,
  IIconRecord
> {}

@SsrSite<ISsrSiteOptionsAdmin>({
  siteId: 'admin',
  publicPath: 'admin',
  requiresAuth: true,
  bundlePath: 'ssr-cabloyBasicAdmin-5.0.0',
  diagnostics: {
    buildCommand: 'npm run build:zova:admin',
  },
})
export class SsrSiteAdmin extends BeanSsrSiteBase<ISsrSiteOptionsAdmin> {}
