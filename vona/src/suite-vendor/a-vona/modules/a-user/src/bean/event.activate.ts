import { BeanEventBase, Event } from 'vona-module-a-event';

import type { IUser } from '../types/user.ts';

export type TypeEventActivateData = IUser;

export type TypeEventActivateResult = void;

@Event()
export class EventActivate extends BeanEventBase<TypeEventActivateData, TypeEventActivateResult> {}
