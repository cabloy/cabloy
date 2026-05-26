import type { OmitNever } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

export interface IDatabaseDialectRecord {}

export interface IDecoratorDatabaseDialectOptions {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    databaseDialect: ServiceOnion<IDatabaseDialectRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    databaseDialect: OmitNever<IDatabaseDialectRecord>;
  }

  export interface IBeanSceneRecord {
    databaseDialect: never;
  }
}
