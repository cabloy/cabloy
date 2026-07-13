import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsAdmin } from 'vona-module-basic-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsRecord extends IDecoratorSsrMenuOptions<ISsrSiteOptionsAdmin> {}

@SsrMenu<ISsrMenuOptionsRecord>({
  items: {
    record: {
      title: $locale('TrainingRecord'),
      order: $order(2),
      icon: undefined,
      link: 'presetResource',
      meta: {
        params: {
          resource: 'training-record:record',
        },
      },
      group: 'basic-siteadmin:management',
      roles: ['systemAdmin'],
    },
  },
  site: ['basic-siteadmin:admin'],
})
export class SsrMenuRecord extends BeanBase {}
