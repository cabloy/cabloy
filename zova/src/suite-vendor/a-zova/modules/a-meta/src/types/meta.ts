import type { OmitNever } from 'zova';

export interface IMetaRecord {}

export interface IDecoratorMetaOptions {}

export type TypeMetaRecordSelectorSpecificName<NAME extends string> = {
  [K in keyof IMetaRecord as K extends `${string}:${NAME}` ? K : never]: IMetaRecord[K];
};

export type TypeMetaRecordSelectorSpecificNameKeys<NAME extends string> =
  keyof TypeMetaRecordSelectorSpecificName<NAME>;

declare module 'zova' {
  export interface ConfigOnions {
    meta: OmitNever<IMetaRecord>;
  }

  export interface IBeanSceneRecord {
    meta: never;
  }
}
