import type { IDecoratorSsrMenuGroupOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenuGroup } from 'vona-module-a-ssr';

import type { ISsrSiteOptionsAdmin } from './ssrSite.admin.ts';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuGroupOptionsManagement extends IDecoratorSsrMenuGroupOptions<ISsrSiteOptionsAdmin> {}

@SsrMenuGroup<ISsrMenuGroupOptionsManagement>({
  item: {
    title: $locale('Management'),
    order: $order(2),
    icon: undefined,
  },
  site: ['basic-siteadmin:admin'],
})
export class SsrMenuGroupManagement extends BeanBase {}
