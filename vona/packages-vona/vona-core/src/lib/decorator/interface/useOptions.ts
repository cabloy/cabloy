import type { IBeanRecord, InjectionScope, MetadataKey } from '../../../index.ts';

export interface IDecoratorUseOptionsBase {
  prop: MetadataKey;
  beanFullName: string;
  /** such as: moduleScope */
  selector?: string;
  injectionScope?: InjectionScope;
  init?: IDecoratorUseOptionsInit;
  descriptor?: PropertyDescriptor;
}

export interface IDecoratorUseOptions {
  beanFullName?: keyof IBeanRecord;
  selector?: string;
  // injectionScope?: InjectionScope;
  init?: IDecoratorUseOptionsInit;
}

export type TypeDecoratorUseOptionsInitArg = any | any[] | Record<string, any>;
export interface IDecoratorUseOptionsInit {
  withSelector?: boolean;
  arg?: TypeDecoratorUseOptionsInitArg;
  args?: TypeDecoratorUseOptionsInitArg[];
}

export interface IUsePrepareArgResult {
  withSelector?: boolean;
  args: (Function | any)[];
}

export interface IInjectSelectorInfo {
  withSelector: boolean;
  args: any[];
}
