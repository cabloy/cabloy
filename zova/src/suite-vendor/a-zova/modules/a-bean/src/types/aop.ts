import type { IBeanRecord, Next, NextSync, OmitNever } from 'zova';

import type { ServiceOnion } from '../service/onion_.js';
import type { IOnionOptionsDeps, IOnionOptionsEnable, IOnionOptionsMatch } from './onion';

export type AopActionNext<P, R> = R extends Promise<any> ? Next<P, Awaited<R>> : NextSync<P, R>;

// @ts-ignore ignore
export type AopActionInit<T extends {}> = AopAction<T, '__init__'>;
// @ts-ignore ignore
export type AopActionDispose<T extends {}> = AopAction<T, '__dispose__'>;
// @ts-ignore ignore
export type AopActionRender<T extends {}> = AopAction<T, 'render'>;

export type AopAction<T extends {}, NAME extends keyof T, RESULT = undefined> = (
  // @ts-ignore ignore
  args: Parameters<T[NAME]>,
  // @ts-ignore ignore
  next: AopActionNext<Parameters<T[NAME]>, ReturnType<T[NAME]>>,
  _receiver: T,
) // @ts-ignore ignore
=> RESULT extends undefined
  ? // @ts-ignore ignore
    ReturnType<T[NAME]>
  : // @ts-ignore ignore
    ReturnType<T[NAME]> extends Promise<any>
    ? Promise<RESULT>
    : RESULT;

export type AopActionMethod<T extends {}> = (
  method: keyof T,
  args: any[],
  next: AopActionNext<any[], any>,
  _receiver: T,
) => any;

export type AopActionGetter<T extends {}, NAME extends keyof T, RESULT = undefined> =
  // @ts-ignore ignore
  (
    next: AopActionNext<void, T[NAME]>,
    _receiver: T,
  ) // @ts-ignore ignore
  => RESULT extends undefined ? T[NAME] : T[NAME] extends Promise<any> ? Promise<RESULT> : RESULT;

export type AopActionSetter<T extends {}, NAME extends keyof T, DATA = undefined> =
  // @ts-ignore ignore
  (
    value: DATA extends undefined ? T[NAME] : T[NAME] extends Promise<any> ? Promise<DATA> : DATA,
    next: AopActionNext<T[NAME], boolean>,
    _receiver: T,
  ) // @ts-ignore ignore
  => boolean;

export interface IAopRecord {}

export interface IDecoratorAopOptions
  extends
    IOnionOptionsEnable,
    IOnionOptionsMatch<keyof IBeanRecord | RegExp>,
    IOnionOptionsDeps<keyof IAopRecord> {}

declare module 'zova-module-a-bean' {
  export interface SysOnion {
    aop: ServiceOnion<IDecoratorAopOptions, keyof IAopRecord>;
  }
}

declare module 'zova' {
  export interface ConfigOnions {
    aop: OmitNever<IAopRecord>;
  }

  export interface IBeanSceneRecord {
    aop: never;
  }
}
