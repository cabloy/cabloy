import type { Next, OmitNever } from 'vona';
import type {
  IOnionOptionsDeps,
  ServiceOnion,
  TypeOnionOptionsBaseSimple,
  TypeOnionOptionsEnableSimple,
} from 'vona-module-a-onion';
import type { IApiPathRecord } from 'vona-module-a-web';

export interface IGuardRecordGlobal {}
export interface IGuardRecordLocal {}
export type IGuardRecord = IGuardRecordGlobal & IGuardRecordLocal;

export interface IGuardExecute {
  execute(options: IDecoratorGuardOptions, next: Next): Promise<boolean>;
}

export interface IDecoratorGuardOptions extends TypeOnionOptionsEnableSimple {}

export interface IDecoratorGuardOptionsGlobal
  extends
    TypeOnionOptionsBaseSimple<keyof IApiPathRecord>,
    IOnionOptionsDeps<keyof IGuardRecordGlobal> {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    guard: ServiceOnion<IGuardRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    guard: OmitNever<IGuardRecord>;
  }

  export interface IBeanSceneRecord {
    guard: never;
  }
}
