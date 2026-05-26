import type { IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';
import type { IIconRecord, IPagePathRecord } from 'zova-rest-test-second';

import { BeanSsrSiteBase, SsrSite } from 'vona-module-a-ssr';

import type { DtoTestResult } from '../dto/testResult.tsx';

declare module 'vona-module-a-ssr' {
  export interface ISsrSitePublicPathRecord {
    second: never;
  }
}

export interface ISsrSiteOptionsSecondPages extends IPagePathRecord {}

export interface ISsrSiteOptionsSecondPagesData {
  '/demo/basic/toolOne/:id?': unknown;
  '/demo/basic/toolTwo/:id?': DtoTestResult;
}

export interface ISsrSiteOptionsSecond extends IDecoratorSsrSiteOptions<
  ISsrSiteOptionsSecondPages,
  ISsrSiteOptionsSecondPagesData,
  IIconRecord
> {}

@SsrSite<ISsrSiteOptionsSecond>({
  publicPath: 'second',
  bundlePath: 'ssr-testSecond-5.0.0',
})
export class SsrSiteSecond extends BeanSsrSiteBase<ISsrSiteOptionsSecond> {}
