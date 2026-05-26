import type { Next, NextSync, OmitNever } from 'zova';

import type { ServiceOnion } from '../service/onion_.js';
import type { IOnionOptionsEnable } from './onion.js';

export const SymbolDecoratorUseAopMethod = Symbol('SymbolDecoratorUseAopMethod');
export interface IUseAopMethodPropMetadata<T extends keyof IAopMethodRecord = never> {
  beanInstance?: any;
  onionName?: T;
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

export interface IDecoratorAopMethodOptions extends IOnionOptionsEnable {}

declare module 'zova-module-a-bean' {
  export interface SysOnion {
    aopMethod: ServiceOnion<IDecoratorAopMethodOptions, keyof IAopMethodRecord>;
  }
}

declare module 'zova' {
  export interface ConfigOnions {
    aopMethod: OmitNever<IAopMethodRecord>;
  }

  export interface IBeanSceneRecord {
    aopMethod: never;
  }
}
