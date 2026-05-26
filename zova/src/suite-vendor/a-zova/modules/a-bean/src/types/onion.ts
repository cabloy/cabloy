import type { ZovaOnionOptionsMeta } from '@cabloy/module-info';

export const SymbolUseOnionLocal = Symbol('SymbolUseOnionLocal');
export const SymbolUseOnionOptions = Symbol('SymbolUseOnionOptions');

export type TypeComposer = (context: any, next?: any) => any;

export type IOnionExecuteCustom<OPTIONS, ONIONNAME> = (
  onionSlice: IOnionSlice<OPTIONS, ONIONNAME>,
  data: any,
  next: Function,
) => any;

export type TypeUseOnionGlobalBaseOptions<T> = Omit<
  T,
  'global' | 'dependencies' | 'dependents' | 'ignore' | 'match'
>;

export interface IOnionOptionsEnable {
  enable?: boolean;
  meta?: IOnionOptionsMeta;
}

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

export interface IOnionOptionsMeta extends ZovaOnionOptionsMeta {}

export interface IOnionOptionsBase<T extends string>
  extends IOnionOptionsEnable, IOnionOptionsMatch<TypeOnionOptionsMatchRule<T>> {}

export interface IOnionSlice<OPTIONS = unknown, ONIONNAME = string, T = unknown> {
  name: ONIONNAME;
  options: OPTIONS;
  beanFullName: string;
  beanInstance?: T;
}

export interface IOnionItem<OPTIONS = unknown, ONIONNAME = string> {
  name: ONIONNAME;
  options?: Partial<OPTIONS>;
}

export interface ConfigOnions {}

declare module 'zova' {
  export interface ZovaConfig {
    onions: ConfigOnions;
  }
}
