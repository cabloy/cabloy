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

export type AopMethodNext = Next & {
  replay: Next;
};

export type AopMethodNextSync = NextSync & {
  replay: NextSync;
};

export interface IAopMethodGet {
  get(
    options: IDecoratorAopMethodOptions,
    next: AopMethodNextSync,
    receiver: any,
    prop: string,
  ): any;
}

export interface IAopMethodSet {
  set(
    options: IDecoratorAopMethodOptions,
    value: any,
    next: AopMethodNextSync,
    receiver: any,
    prop: string,
  ): boolean;
}

export interface IAopMethodExecute {
  execute(
    options: IDecoratorAopMethodOptions,
    args: [],
    next: AopMethodNext | AopMethodNextSync,
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
