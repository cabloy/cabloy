import type { IBeanRecord, IBeanScopeRecord } from '../../bean/type.ts';
import type { MetadataKey } from '../../core/sys/metadata.ts';
import type { Constructable } from '../type/constructable.ts';
import type { InjectionScope } from '../type/injectionScope.ts';

export interface IDecoratorUseOptionsBase<T = unknown> {
  prop: MetadataKey;
  beanFullName?: string;
  name?: string;
  beanClass?: Constructable<T>;
  /** such as: moduleScope */
  selector?: string;
  injectionScope?: InjectionScope;
  markReactive?: boolean;
  init?: IDecoratorUseOptionsInit;
  descriptor?: PropertyDescriptor;
}

export interface IDecoratorUseOptions {
  beanFullName?: keyof IBeanRecord;
  name?: string;
  selector?: string;
  injectionScope?: InjectionScope;
  markReactive?: boolean;
  init?: IDecoratorUseOptionsInit;
}

export interface IDecoratorUseScopeOptions {
  module?: keyof IBeanScopeRecord;
}

export type TypeDecoratorUseOptionsInitArg = any | any[] | Record<string, any>;
export interface IDecoratorUseOptionsInit {
  withSelector?: boolean;
  markReactive?: boolean;
  arg?: TypeDecoratorUseOptionsInitArg;
  args?: TypeDecoratorUseOptionsInitArg[];
}

export interface IUsePrepareArgResult {
  withSelector?: boolean;
  markReactive?: boolean;
  args: (Function | any)[];
}

export interface IInjectSelectorInfo {
  withSelector: boolean;
  args: any[];
}
