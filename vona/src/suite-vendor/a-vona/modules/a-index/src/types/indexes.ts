export type MetaOptionsIndexModuleIndexes = Record<string, string | string[] | undefined>;

export interface IMetaOptionsIndex {
  indexes: MetaOptionsIndexModuleIndexes;
}

export interface IMetaIndexExecute {
  execute: (options: IMetaOptionsIndex) => Promise<boolean>;
}

declare module 'vona-module-a-meta' {
  export interface IMetaNameRecord {
    index: never;
  }
}
