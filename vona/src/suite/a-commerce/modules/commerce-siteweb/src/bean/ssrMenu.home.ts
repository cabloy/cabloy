import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import type { ISsrSiteOptionsCommerce } from './ssrSite.commerce.ts';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsHome extends IDecoratorSsrMenuOptions<ISsrSiteOptionsCommerce> {}

@SsrMenu<ISsrMenuOptionsHome>({
  item: {
    title: $locale('Commerce'),
    order: $order(1),
    icon: undefined,
    link: '/:locale' as never,
    meta: {
      params: { locale: true },
    },
  },
  site: ['commerce-siteweb:commerce'],
})
export class SsrMenuHome extends BeanBase {}
