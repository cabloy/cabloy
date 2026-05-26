import type { IBeanRecord } from 'vona';

import { BeanEventBase, Event } from 'vona-module-a-event';

export interface TypeEventRemoveInstancesData {
  beanFullName: keyof IBeanRecord;
  data: unknown;
}

export type TypeEventRemoveInstancesResult = void;

@Event()
export class EventRemoveInstances extends BeanEventBase<
  TypeEventRemoveInstancesData,
  TypeEventRemoveInstancesResult
> {}
