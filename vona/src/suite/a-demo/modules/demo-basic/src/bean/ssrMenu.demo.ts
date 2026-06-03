import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsWeb } from 'vona-module-basic-siteweb';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

export interface ISsrMenuOptionsDemo extends IDecoratorSsrMenuOptions<ISsrSiteOptionsWeb> {}

@SsrMenu<ISsrMenuOptionsDemo>({
  items: {
    state: {
      title: 'State',
      order: $order(1),
      icon: undefined,
      link: '/demo/basic/state',
      group: 'demo-basic:demo',
    },
    component: {
      title: 'Component',
      order: $order(2),
      icon: undefined,
      link: '/demo/basic/component',
      group: 'demo-basic:demo',
    },
    cssInJs: {
      title: 'CSS-in-JS',
      order: $order(3),
      icon: undefined,
      link: '/demo/basic/style',
      group: 'demo-basic:demo',
    },
  },
  site: ['basic-siteweb:web'],
})
export class SsrMenuDemo extends BeanBase {}
