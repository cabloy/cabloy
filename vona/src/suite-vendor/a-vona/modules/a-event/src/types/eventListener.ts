import type { NextGeneral, OmitNever } from 'vona';
import type {
  IOnionOptionsDeps,
  IOnionOptionsMatch,
  ServiceOnion,
  TypeOnionOptionsEnableSimple,
  TypeOnionOptionsMatchRule,
} from 'vona-module-a-onion';

import type { IEventRecord } from './event.ts';

export type NextEvent<DATA = unknown, RESULT = unknown> = (data?: DATA) => Promise<RESULT>;
export type NextEventStrict<DATA = unknown, RESULT = unknown> = (data: DATA) => Promise<RESULT>;
export type NextEventSync<DATA = unknown, RESULT = unknown> = (data?: DATA) => RESULT;
export type NextEventSyncStrict<DATA = unknown, RESULT = unknown> = (data: DATA) => RESULT;
export type EventOn<DATA = unknown, RESULT = unknown> = (
  data: DATA,
  next: (data?: DATA) => Promise<RESULT> | RESULT,
) => Promise<RESULT> | RESULT;

export interface IEventExecute<DATA = unknown, RESULT = unknown> {
  execute: (data: DATA, next: NextGeneral) => Promise<RESULT> | RESULT;
}

export interface IEventListenerRecord {}

export interface IDecoratorEventListenerOptions
  extends
    TypeOnionOptionsEnableSimple,
    IOnionOptionsMatch<TypeOnionOptionsMatchRule<keyof IEventRecord>>,
    IOnionOptionsDeps<keyof IEventListenerRecord> {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    eventListener: ServiceOnion<IEventListenerRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    eventListener: OmitNever<IEventListenerRecord>;
  }

  export interface IBeanSceneRecord {
    eventListener: never;
  }
}
