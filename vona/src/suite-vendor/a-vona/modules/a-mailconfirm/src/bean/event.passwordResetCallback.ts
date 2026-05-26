import { BeanEventBase, Event } from 'vona-module-a-event';

import type { TCacheRedisPasswordResetData } from './cacheRedis.passwordReset.ts';

export type TypeEventPasswordResetCallbackData = TCacheRedisPasswordResetData | undefined;

export type TypeEventPasswordResetCallbackResult = string;

@Event()
export class EventPasswordResetCallback extends BeanEventBase<
  TypeEventPasswordResetCallbackData,
  TypeEventPasswordResetCallbackResult
> {}
