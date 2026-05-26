import { BeanEventBase, Event } from 'vona-module-a-event';

import type { TCacheRedisEmailConfirmData } from './cacheRedis.emailConfirm.ts';

export type TypeEventEmailConfirmCallbackData = TCacheRedisEmailConfirmData | undefined;

export type TypeEventEmailConfirmCallbackResult = string;

@Event()
export class EventEmailConfirmCallback extends BeanEventBase<
  TypeEventEmailConfirmCallbackData,
  TypeEventEmailConfirmCallbackResult
> {}
