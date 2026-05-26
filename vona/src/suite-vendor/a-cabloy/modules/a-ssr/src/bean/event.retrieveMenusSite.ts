import type { ILocaleRecord } from 'vona';

import { BeanEventBase, Event } from 'vona-module-a-event';

import type { BeanSsrSiteBase } from '../lib/beanSsrSiteBase.ts';
import type { TypeEventRetrieveMenusResult } from './event.retrieveMenus.ts';

export interface TypeEventRetrieveMenusSiteData {
  ssrSite: BeanSsrSiteBase;
  locale: keyof ILocaleRecord;
}

export type TypeEventRetrieveMenusSiteResult = TypeEventRetrieveMenusResult;

@Event()
export class EventRetrieveMenusSite extends BeanEventBase<
  TypeEventRetrieveMenusSiteData,
  TypeEventRetrieveMenusSiteResult
> {}
