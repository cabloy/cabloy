import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';

import { BeanBase, useApp } from 'vona';
import { $apiPath } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import type { ISsrSiteOptionsSecond } from './ssrSite.second.ts';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsTools extends IDecoratorSsrMenuOptions<ISsrSiteOptionsSecond> {}

const app = useApp();

@SsrMenu<ISsrMenuOptionsTools>({
  items: {
    toolOne: {
      title: $locale('ToolOne'),
      group: 'test-ssr:tools',
      link: 'demo-basic:toolOne' as any,
      meta: {
        query: {
          api: app.util.combineApiPath($apiPath('/test/ssr/toolOne/test/:id?')),
          apiMethod: 'post',
        },
      },
    },
  },
  site: 'test-ssr:second',
  // locale: 'en-us',
})
export class SsrMenuTools extends BeanBase {}
