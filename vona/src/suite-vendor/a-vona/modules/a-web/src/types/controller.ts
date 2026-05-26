import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

export interface IApiPathRecordMethodMap {
  get: IApiPathGetRecord;
  post: IApiPathPostRecord;
  delete: IApiPathDeleteRecord;
  put: IApiPathPutRecord;
  patch: IApiPathPatchRecord;
}
export interface IApiPathRecord
  extends
    IApiPathGetRecord,
    IApiPathPostRecord,
    IApiPathDeleteRecord,
    IApiPathPutRecord,
    IApiPathPatchRecord {}

export interface IApiPathGetRecord {}
export interface IApiPathPostRecord {}
export interface IApiPathDeleteRecord {}
export interface IApiPathPutRecord {}
export interface IApiPathPatchRecord {}

export interface IControllerRecord {}

export interface IDecoratorControllerOptions extends TypeOnionOptionsEnableSimple {
  path?: string;
  exclude?: boolean;
  tags?: string[];
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    controller: ServiceOnion<IControllerRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    controller: OmitNever<IControllerRecord>;
  }

  export interface IBeanSceneRecord {
    controller: never;
  }
}
