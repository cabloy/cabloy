import type { Next, OmitNever } from 'vona';
import type {
  IOnionOptionsDeps,
  ServiceOnion,
  TypeOnionOptionsBaseSimple,
  TypeOnionOptionsEnableSimple,
} from 'vona-module-a-onion';
import type { IApiPathRecord } from 'vona-module-a-web';

export interface IInterceptorRecordGlobal {}
export interface IInterceptorRecordLocal {}
export type IInterceptorRecord = IInterceptorRecordGlobal & IInterceptorRecordLocal;

export interface IInterceptorExecute {
  execute(options: IDecoratorInterceptorOptions, next: Next): Promise<any>;
}

export interface IDecoratorInterceptorOptions extends TypeOnionOptionsEnableSimple {}

export interface IDecoratorInterceptorOptionsGlobal
  extends
    TypeOnionOptionsBaseSimple<keyof IApiPathRecord>,
    IOnionOptionsDeps<keyof IInterceptorRecordGlobal> {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    interceptor: ServiceOnion<IInterceptorRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    interceptor: OmitNever<IInterceptorRecord>;
  }

  export interface IBeanSceneRecord {
    interceptor: never;
  }
}
