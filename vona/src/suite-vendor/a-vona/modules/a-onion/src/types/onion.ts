import type { VonaOnionOptionsMeta } from '@cabloy/module-info';
import type { IDecoratorBeanOptionsBase, IHostRecord, IInstanceRecord, PowerPartial } from 'vona';

export const SymbolUseOnionLocal = Symbol('SymbolUseOnionLocal');
export const SymbolUseOnionOptions = Symbol('SymbolUseOnionOptions');
export const SymbolUseOnionOptionsRouteReal = Symbol('SymbolUseOnionOptionsRouteReal');

export type TypeOnionsNormal<ONIONRECORD> = {
  [KEY in keyof ONIONRECORD]: IOnionSlice<ONIONRECORD, KEY>;
};

export type IOnionExecuteCustom = (
  beanInstance: any,
  data: any,
  options: any,
  next: Function,
) => any;

export type TypeUseOnionOmitOptionsGlobal<T> = Omit<
  T,
  'dependencies' | 'dependents' | 'ignore' | 'match'
>;
export type TypeUseOnionOmitOptionsEnable<T> = Omit<T, 'enable' | 'meta'>;

export interface IOnionOptionsEnable<OmitMetaFields extends string = never> {
  enable?: boolean;
  meta?: Omit<IOnionOptionsMeta, OmitMetaFields>;
}

export type TypeOnionOptionsEnableSimple = IOnionOptionsEnable<'instanceName' | 'host'>;

export type TypeOnionOptionsMatchFunction = (this: any, ...args: any[]) => boolean;
export type TypeOnionOptionsMatchRule<T> = T | RegExp | TypeOnionOptionsMatchFunction;
export type TypeOnionOptionsMatchRules<T> =
  | TypeOnionOptionsMatchRule<T>[]
  | TypeOnionOptionsMatchRule<T>;

export interface IOnionOptionsMatch<T> {
  match?: T[] | T;
  ignore?: T[] | T;
}

export interface IOnionOptionsDeps<T> {
  dependencies?: T[] | T;
  dependents?: T[] | T;
}

export interface IOnionOptionsMeta extends VonaOnionOptionsMeta {
  instanceName?: keyof IInstanceRecord | Array<keyof IInstanceRecord>;
  host?: keyof IHostRecord | Array<keyof IHostRecord>;
}

export interface IOnionOptionsBase<T extends string>
  extends IOnionOptionsEnable, IOnionOptionsMatch<TypeOnionOptionsMatchRule<T>> {}
export interface TypeOnionOptionsBaseSimple<T extends string>
  extends TypeOnionOptionsEnableSimple, IOnionOptionsMatch<TypeOnionOptionsMatchRule<T>> {}

export interface IOnionSlice<
  ONIONRECORD = unknown,
  ONIONNAME extends keyof ONIONRECORD = any,
  T = unknown,
> {
  name: ONIONNAME;
  beanOptions: IDecoratorBeanOptionsBase<T, ONIONRECORD[ONIONNAME]>;
}

export interface ConfigOnions {}

declare module 'vona' {
  export interface VonaConfig {
    onions: ConfigOnions;
  }

  export interface ILoggerChildRecord {
    onion: never;
  }

  export interface VonaContext {
    get onionsDynamic(): PowerPartial<ConfigOnions> | undefined;
    set onionsDynamic(value: PowerPartial<ConfigOnions> | undefined);
  }
}
