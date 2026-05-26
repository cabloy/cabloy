import type { IMenus } from 'vona-module-a-menu';

import { BeanEventBase, Event } from 'vona-module-a-event';

import type { BeanSsrSiteBase } from '../lib/beanSsrSiteBase.ts';
import type { IDecoratorSsrSiteOptions } from '../types/ssrSite.ts';

export interface TypeEventRetrieveMenusData {
  publicPath: string;
  siteOptions: IDecoratorSsrSiteOptions;
  siteInstance: BeanSsrSiteBase;
}

export type TypeEventRetrieveMenusResult = IMenus | undefined;

@Event()
export class EventRetrieveMenus extends BeanEventBase<
  TypeEventRetrieveMenusData,
  TypeEventRetrieveMenusResult
> {}
