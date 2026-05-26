import type { IModelSelectParamsJoinType, ITableRecord, TypeOpsNormal } from 'vona-module-a-orm';

import type {
  IDecoratorFilterTransformOptions,
  IFilterTransformRecord,
} from './filterTransform.ts';

export interface ISchemaObjectExtensionFieldFilterJoin {
  type?: IModelSelectParamsJoinType;
  table: keyof ITableRecord;
  on: [string, string];
}

export interface ISchemaObjectExtensionFieldFilterCapabilities {
  where?: boolean;
  // filter?: boolean;
  order?: boolean;
  // group?: boolean;
}

export type TypeSchemaObjectExtensionFieldFilterTransform = [
  keyof IFilterTransformRecord,
  IDecoratorFilterTransformOptions | undefined,
];

export interface ISchemaObjectExtensionFieldFilter {
  capabilities?: ISchemaObjectExtensionFieldFilterCapabilities;
  table?: keyof ITableRecord;
  joinType?: IModelSelectParamsJoinType;
  joinOn?: [string, string];
  originalName?: string;
  op?: TypeOpsNormal;
  transform?: TypeSchemaObjectExtensionFieldFilterTransform;
}

declare module 'vona-module-a-openapi' {
  export interface ISchemaObjectExtensionField {
    filter?: ISchemaObjectExtensionFieldFilter;
  }
}
