import type { IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';
import type { IIconRecord, IPagePathRecord } from 'zova-rest-cabloy-start-admin';

import { BeanSsrSiteBase, SsrSite } from 'vona-module-a-ssr';

declare module 'vona-module-a-ssr' {
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
  publicPath: 'admin',
  bundlePath: 'ssr-cabloyStartAdmin-5.0.0',
})
export class SsrSiteAdmin extends BeanSsrSiteBase<ISsrSiteOptionsAdmin> {}
