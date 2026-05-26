import { BeanEventBase, Event } from 'vona-module-a-event';

import type { IDatabaseClientRecord } from '../types/database.ts';

export type TypeEventClientNameRealData = keyof IDatabaseClientRecord;

export type TypeEventClientNameRealResult = keyof IDatabaseClientRecord;

@Event()
export class EventClientNameReal extends BeanEventBase<
  TypeEventClientNameRealData,
  TypeEventClientNameRealResult
> {}
