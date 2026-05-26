import { BeanEventBase, Event } from 'vona-module-a-event';

import type { EntityPaypalRecord } from '../entity/paypalRecord.tsx';

export interface IPaypalCaptureOrderBreakdown {
  grossAmount: number;
  payFee: number;
  netAmount: number;
}
export interface TypeEventPaypalCaptureOrderData {
  record: EntityPaypalRecord;
  breakdown: IPaypalCaptureOrderBreakdown;
  orderResult?: {};
}

export type TypeEventPaypalCaptureOrderResult = void;

@Event()
export class EventPaypalCaptureOrder extends BeanEventBase<
  TypeEventPaypalCaptureOrderData,
  TypeEventPaypalCaptureOrderResult
> {}
