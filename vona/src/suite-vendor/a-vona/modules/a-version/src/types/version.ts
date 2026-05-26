import type { IInstanceRecord } from 'vona';
import type { ConfigInstanceBase } from 'vona-module-a-instance';

export interface IMetaVersionOptions {
  scene: 'update' | 'init' | 'test';
  instanceName?: keyof IInstanceRecord;
}

export interface IMetaVersionOptionsInner extends IMetaVersionOptions {
  result?: Record<string, any>;
  instanceBase?: ConfigInstanceBase;
}

export interface IMetaVersionUpdateOptions {
  version: number;
}

export interface IMetaVersionInitOptions extends ConfigInstanceBase {
  version: number;
}

export interface IMetaVersionTestOptions {
  version: number;
  instanceName: string;
}

export interface IMetaVersionUpdate {
  update: (options: IMetaVersionUpdateOptions) => Promise<void>;
}

export interface IMetaVersionInit {
  init: (options: IMetaVersionInitOptions) => Promise<void>;
}

export interface IMetaVersionTest {
  test: (options: IMetaVersionTestOptions) => Promise<void>;
}

declare module 'vona' {
  export interface ILoggerChildRecord {
    version: never;
  }
}

declare module 'vona-module-a-meta' {
  export interface IMetaNameRecord {
    version: never;
  }
}
