import type { ILocaleRecord } from 'vona';

import { BeanEventBase, Event } from 'vona-module-a-event';

import type { BeanSsrSiteBase } from '../lib/beanSsrSiteBase.ts';
import type { ISsrMenusPrepared } from '../types/ssrMenu.ts';

export interface TypeEventRetrieveMenusSiteData {
  ssrSite: BeanSsrSiteBase;
  locale: keyof ILocaleRecord;
}

export type TypeEventRetrieveMenusSiteResult = ISsrMenusPrepared;

@Event()
export class EventRetrieveMenusSite extends BeanEventBase<
  TypeEventRetrieveMenusSiteData,
  TypeEventRetrieveMenusSiteResult
> {}
