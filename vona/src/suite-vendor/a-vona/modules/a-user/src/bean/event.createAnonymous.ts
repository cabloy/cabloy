import { BeanEventBase, Event } from 'vona-module-a-event';

import type { IUser } from '../types/user.ts';

export type TypeEventCreateAnonymousData = undefined;

export type TypeEventCreateAnonymousResult = Partial<IUser>;

@Event()
export class EventCreateAnonymous extends BeanEventBase<
  TypeEventCreateAnonymousData,
  TypeEventCreateAnonymousResult
> {}
