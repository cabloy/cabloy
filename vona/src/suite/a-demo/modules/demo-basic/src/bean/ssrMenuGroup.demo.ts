import type { IDecoratorSsrMenuGroupOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsAdmin } from 'vona-module-basic-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenuGroup } from 'vona-module-a-ssr';

export interface ISsrMenuGroupOptionsDemo extends IDecoratorSsrMenuGroupOptions<ISsrSiteOptionsAdmin> {}

@SsrMenuGroup<ISsrMenuGroupOptionsDemo>({
  item: {
    title: 'Demo',
    order: $order(2),
    icon: undefined,
  },
  site: ['basic-siteadmin:admin'],
})
export class SsrMenuGroupDemo extends BeanBase {}
