import type { OmitNever } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

export interface IMetaNameRecord {}

export interface IMetaRecord {}

export interface IDecoratorMetaOptions {}

export type TypeMetaRecordSelectorSpecificName<NAME extends string> = {
  [K in keyof IMetaRecord as K extends `${string}:${NAME}` ? K : never]: IMetaRecord[K];
};

export type TypeMetaRecordSelectorSpecificNameKeys<NAME extends string> =
  keyof TypeMetaRecordSelectorSpecificName<NAME>;

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    meta: ServiceOnion<IMetaRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    meta: OmitNever<IMetaRecord>;
  }

  export interface IBeanSceneRecord {
    meta: never;
  }
}
