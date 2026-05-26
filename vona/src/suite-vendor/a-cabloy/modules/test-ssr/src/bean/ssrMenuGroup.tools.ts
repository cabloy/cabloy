import type { IDecoratorSsrMenuGroupOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { SsrMenuGroup } from 'vona-module-a-ssr';

import type { ISsrSiteOptionsSecond } from './ssrSite.second.ts';

import { $locale } from '../.metadata/locales.ts';
export interface ISsrMenuGroupOptionsTools extends IDecoratorSsrMenuGroupOptions<ISsrSiteOptionsSecond> {}

@SsrMenuGroup<ISsrMenuGroupOptionsTools>({
  item: {
    title: $locale('Tools'),
  },
  site: ['test-ssr:second'],
  // locale: ['en-us'],
})
export class SsrMenuGroupTools extends BeanBase {}
