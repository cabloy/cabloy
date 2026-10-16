import type { OmitNever } from 'vona';
import type { ConfigInstanceBase } from 'vona-module-a-instance';
import type {
  IOnionOptionsDeps,
  ServiceOnion,
  TypeOnionOptionsEnableSimple,
} from 'vona-module-a-onion';

export interface IStartupRecord {}

export interface IStartupExecute {
  execute: (options?: IInstanceStartupOptions) => Promise<void>;
}

export interface IDecoratorStartupOptions
  extends TypeOnionOptionsEnableSimple, IOnionOptionsDeps<keyof IStartupRecord> {
  instance?: boolean;
  debounce?: boolean | number;
  transaction?: boolean;
  after?: boolean;
}

export interface IInstanceStartupOptions {
  force?: boolean;
  configInstanceBase?: ConfigInstanceBase;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    startup: ServiceOnion<IStartupRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    startup: OmitNever<IStartupRecord>;
  }

  export interface IBeanSceneRecord {
    startup: never;
  }
}
