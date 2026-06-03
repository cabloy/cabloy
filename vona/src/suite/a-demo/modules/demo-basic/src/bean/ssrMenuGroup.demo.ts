import type { IDecoratorSsrMenuGroupOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsWeb } from 'vona-module-basic-siteweb';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenuGroup } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuGroupOptionsDemo extends IDecoratorSsrMenuGroupOptions<ISsrSiteOptionsWeb> {}

@SsrMenuGroup<ISsrMenuGroupOptionsDemo>({
  item: {
    title: $locale('Demo'),
    order: $order(2),
    icon: undefined,
  },
  site: ['basic-siteweb:web'],
})
export class SsrMenuGroupDemo extends BeanBase {}
