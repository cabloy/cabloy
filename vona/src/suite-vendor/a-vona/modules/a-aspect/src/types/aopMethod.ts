import type { Next, NextSync, OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

export const SymbolDecoratorUseAopMethod = Symbol('SymbolDecoratorUseAopMethod');
export interface IUseAopMethodPropMetadata<T extends keyof IAopMethodRecord = any> {
  onionName?: T;
  options?: Partial<IAopMethodRecord[T]>;
}

export interface IUseAopMethodPropMetadataInner<T extends keyof IAopMethodRecord = any> {
  beanFullName: string;
  onionName: T;
  options?: Partial<IAopMethodRecord[T]>;
}

export interface IAopMethodRecord {}

export interface IAopMethodGet {
  get(options: IDecoratorAopMethodOptions, next: NextSync, receiver: any, prop: string): any;
}

export interface IAopMethodSet {
  set(
    options: IDecoratorAopMethodOptions,
    value: any,
    next: NextSync,
    receiver: any,
    prop: string,
  ): boolean;
}

export interface IAopMethodExecute {
  execute(
    options: IDecoratorAopMethodOptions,
    args: [],
    next: Next | NextSync,
    receiver: any,
    prop: string,
  ): Promise<any> | any;
}

export interface IDecoratorAopMethodOptions extends TypeOnionOptionsEnableSimple {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    aopMethod: ServiceOnion<IAopMethodRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    aopMethod: OmitNever<IAopMethodRecord>;
  }

  export interface IBeanSceneRecord {
    aopMethod: never;
  }
}
