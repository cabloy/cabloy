import type { IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';
import type { IIconRecord, IPagePathRecord } from 'zova-rest-cabloy-basic-web';

import { BeanSsrSiteBase, SsrSite } from 'vona-module-a-ssr';

declare module 'vona-module-a-ssr' {
  export interface ISsrSitePublicPathRecord {
    '': never;
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
  publicPath: '',
  bundlePath: 'ssr-cabloyBasicWeb-5.0.0',
  diagnostics: {
    siteName: 'web',
    buildCommand: 'npm run build:zova:web',
  },
})
export class SsrSiteWeb extends BeanSsrSiteBase<ISsrSiteOptionsWeb> {}
