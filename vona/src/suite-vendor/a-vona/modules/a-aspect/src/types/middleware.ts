import type { Next, OmitNever } from 'vona';
import type {
  IOnionOptionsDeps,
  ServiceOnion,
  TypeOnionOptionsBaseSimple,
  TypeOnionOptionsEnableSimple,
} from 'vona-module-a-onion';
import type { IApiPathRecord } from 'vona-module-a-web';

export interface IMiddlewareRecordGlobal {}
export interface IMiddlewareRecordLocal {}
export type IMiddlewareRecord = IMiddlewareRecordGlobal & IMiddlewareRecordLocal;

export interface IMiddlewareExecute {
  execute(options: IDecoratorMiddlewareOptions, next: Next): Promise<any>;
}

export interface IDecoratorMiddlewareOptions extends TypeOnionOptionsEnableSimple {}

export interface IDecoratorMiddlewareOptionsGlobal
  extends
    TypeOnionOptionsBaseSimple<keyof IApiPathRecord>,
    IOnionOptionsDeps<keyof IMiddlewareRecordGlobal> {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    middleware: ServiceOnion<IMiddlewareRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    middleware: OmitNever<IMiddlewareRecord>;
  }

  export interface IBeanSceneRecord {
    middleware: never;
  }
}
