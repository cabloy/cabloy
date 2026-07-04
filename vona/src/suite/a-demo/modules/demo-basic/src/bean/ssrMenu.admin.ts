import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsWeb } from 'vona-module-basic-siteweb';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

export interface ISsrMenuOptionsAdmin extends IDecoratorSsrMenuOptions<ISsrSiteOptionsWeb> {}

@SsrMenu<ISsrMenuOptionsAdmin>({
  item: {
    title: 'Admin',
    order: $order(1),
    icon: undefined,
    link: '/admin' as any,
    external: true,
    target: '_self',
  },
  site: ['basic-siteweb:web'],
})
export class SsrMenuAdmin extends BeanBase {}
