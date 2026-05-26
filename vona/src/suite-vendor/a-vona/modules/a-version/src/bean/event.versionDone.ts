import { BeanEventBase, Event } from 'vona-module-a-event';

import type { IMetaVersionOptions } from '../types/version.ts';

export type TypeEventVersionDoneData = IMetaVersionOptions;

export type TypeEventVersionDoneResult = void;

@Event()
export class EventVersionDone extends BeanEventBase<
  TypeEventVersionDoneData,
  TypeEventVersionDoneResult
> {}
