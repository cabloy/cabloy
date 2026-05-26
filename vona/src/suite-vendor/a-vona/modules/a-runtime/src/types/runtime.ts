export interface IMetaRuntimeExecute {
  execute: () => Promise<any>;
}

declare module 'vona-module-a-meta' {
  export interface IMetaNameRecord {
    runtime: never;
  }
}
