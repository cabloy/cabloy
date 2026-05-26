import { BeanEventBase, Event } from 'vona-module-a-event';

import type { EntityPaypalRecord } from '../entity/paypalRecord.tsx';

export interface TypeEventPaypalCancelOrderData {
  record: EntityPaypalRecord;
}

export type TypeEventPaypalCancelOrderResult = void;

@Event()
export class EventPaypalCancelOrder extends BeanEventBase<
  TypeEventPaypalCancelOrderData,
  TypeEventPaypalCancelOrderResult
> {}
