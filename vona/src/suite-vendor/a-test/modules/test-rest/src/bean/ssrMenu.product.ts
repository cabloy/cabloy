import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsAdmin } from 'vona-module-basic-siteadmin';

import { BeanBase } from 'vona';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsProduct extends IDecoratorSsrMenuOptions<ISsrSiteOptionsAdmin> {}

@SsrMenu<ISsrMenuOptionsProduct>({
  items: {
    product: {
      title: $locale('Product'),
      group: 'basic-siteadmin:management',
      link: 'presetResource',
      meta: {
        params: {
          resource: 'test-rest:product',
        },
      },
    },
  },
  site: 'basic-siteadmin:admin',
})
export class SsrMenuProduct extends BeanBase {}
