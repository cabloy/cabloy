import type { OmitNever } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';
import type { SchemaLike } from 'vona-module-a-openapiutils';

import type { SymbolKeyFieldsMore } from '../entity.ts';
import type { ITableRecord } from './table.ts';

export interface IEntityRecord {}

export interface IDecoratorEntityOptions<FieldsMore = never> {
  [SymbolKeyFieldsMore]?: FieldsMore;
  table?: keyof ITableRecord;
  independent?: boolean;
  openapi?: ISchemaObjectExtensionField;
  pipes?: SchemaLike | SchemaLike[];
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    entity: ServiceOnion<IEntityRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    entity: OmitNever<IEntityRecord>;
  }

  export interface IBeanSceneRecord {
    entity: never;
  }
}
