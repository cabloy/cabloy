import { BeanEventBase, Event } from 'vona-module-a-event';

import type { IPaymentOutcomeEvent } from '../types/payment.ts';

export type TypeEventPaymentOutcomeData = IPaymentOutcomeEvent;
export type TypeEventPaymentOutcomeResult = void;

@Event()
export class EventPaymentOutcome extends BeanEventBase<
  TypeEventPaymentOutcomeData,
  TypeEventPaymentOutcomeResult
> {}
