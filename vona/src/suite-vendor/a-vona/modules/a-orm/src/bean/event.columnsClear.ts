import { BeanEventBase, Event } from 'vona-module-a-event';

import type { IDatabaseClientRecord } from '../types/database.ts';

export interface TypeEventColumnsClearData {
  clientName: keyof IDatabaseClientRecord;
  tableName?: string;
}

export type TypeEventColumnsClearResult = void;

@Event()
export class EventColumnsClear extends BeanEventBase<
  TypeEventColumnsClearData,
  TypeEventColumnsClearResult
> {}
