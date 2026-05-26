import type { NextGeneral } from '../../decorator/type/functionable.ts';

export type TypeEventOff = () => void;

export type TypeEventHandlersMap<KS extends keyof IEventRecord> = {
  [K in KS]: TypeEventHandlers<IEventRecord[K]['data'], IEventRecord[K]['result']>;
};

export type TypeEventHandlers<D = unknown, R = unknown> = TypeEventHandlerWrapper<D, R>[];

export interface TypeEventHandlerWrapper<D, R> {
  fn: TypeEventHandler<D, R> | undefined;
}

export interface TypeEventHandler<D, R> {
  (data: D, next: NextGeneral<D, R>): Promise<R> | R;
}

export type NextEvent<DATA = unknown, RESULT = unknown> = (data?: DATA) => Promise<RESULT>;
export type NextEventStrict<DATA = unknown, RESULT = unknown> = (data: DATA) => Promise<RESULT>;
export type NextEventSync<DATA = unknown, RESULT = unknown> = (data?: DATA) => RESULT;
export type NextEventSyncStrict<DATA = unknown, RESULT = unknown> = (data: DATA) => RESULT;

export interface IEventRecord {}
