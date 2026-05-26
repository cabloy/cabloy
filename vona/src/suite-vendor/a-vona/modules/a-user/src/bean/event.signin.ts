import { BeanEventBase, Event } from 'vona-module-a-event';

import type { IPassport } from '../types/passport.ts';

export type TypeEventSigninData = IPassport;

export type TypeEventSigninResult = void;

@Event()
export class EventSignin extends BeanEventBase<TypeEventSigninData, TypeEventSigninResult> {}
