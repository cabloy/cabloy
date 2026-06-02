import type { IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';
import type { IIconRecord, IPagePathRecord } from 'zova-rest-cabloy-basic-admin';

import { BeanSsrSiteBase, SsrSite } from 'vona-module-a-ssr';

declare module 'vona-module-a-ssr' {
  export interface ISsrSitePublicPathRecord {
    some: never;
  }
}

export interface ISsrSiteOptionsWebPages extends IPagePathRecord {}

export interface ISsrSiteOptionsWebPagesData {}

export interface ISsrSiteOptionsWeb extends IDecoratorSsrSiteOptions<
  ISsrSiteOptionsWebPages,
  ISsrSiteOptionsWebPagesData,
  IIconRecord
> {}

@SsrSite<ISsrSiteOptionsWeb>({
  publicPath: 'some',
  bundlePath: 'front-bundle-path',
})
export class SsrSiteWeb extends BeanSsrSiteBase<ISsrSiteOptionsWeb> {}
