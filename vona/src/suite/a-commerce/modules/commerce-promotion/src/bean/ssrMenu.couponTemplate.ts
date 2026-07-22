import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsAdmin } from 'vona-module-basic-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsCouponTemplate extends IDecoratorSsrMenuOptions<ISsrSiteOptionsAdmin> {}

@SsrMenu<ISsrMenuOptionsCouponTemplate>({
  items: {
    couponTemplate: {
      title: $locale('CouponTemplate'),
      order: $order(1),
      icon: undefined,
      link: 'presetResource',
      meta: {
        params: {
          resource: 'commerce-promotion:couponTemplate',
        },
      },
      group: 'basic-siteadmin:management',
      roles: ['systemAdmin'],
    },
  },
  site: ['basic-siteadmin:admin'],
})
export class SsrMenuCouponTemplate extends BeanBase {}
