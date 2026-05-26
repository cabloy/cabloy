import type { IBeanRecord } from 'vona';

import { BeanEventBase, Event } from 'vona-module-a-event';

export interface TypeEventReloadInstancesData {
  beanFullName: keyof IBeanRecord;
  data: unknown;
}

export type TypeEventReloadInstancesResult = void;

@Event()
export class EventReloadInstances extends BeanEventBase<
  TypeEventReloadInstancesData,
  TypeEventReloadInstancesResult
> {}
