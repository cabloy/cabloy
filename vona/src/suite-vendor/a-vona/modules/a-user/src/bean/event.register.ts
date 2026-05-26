import { BeanEventBase, Event } from 'vona-module-a-event';

import type { IUser } from '../types/user.ts';

export interface TypeEventRegisterData {
  user: Partial<IUser>;
  confirmed?: boolean;
  autoActivate?: boolean;
}

export type TypeEventRegisterResult = Partial<IUser>;

@Event()
export class EventRegister extends BeanEventBase<TypeEventRegisterData, TypeEventRegisterResult> {}
