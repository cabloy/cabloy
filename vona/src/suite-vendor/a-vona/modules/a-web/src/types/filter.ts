import type { IAnalysisCapabilities, IQueryCapabilities, TypeOpsNormal } from 'vona-module-a-orm';

import type {
  IDecoratorFilterTransformOptions,
  IFilterTransformRecord,
} from './filterTransform.ts';

export interface ISchemaObjectExtensionFieldFilterCapabilities {
  where?: boolean;
  // filter?: boolean;
  order?: boolean;
  analysis?: IAnalysisCapabilities;
  query?: IQueryCapabilities;
}

export type TypeSchemaObjectExtensionFieldFilterTransform = [
  keyof IFilterTransformRecord,
  IDecoratorFilterTransformOptions | undefined,
];

export interface ISchemaObjectExtensionFieldFilter {
  capabilities?: ISchemaObjectExtensionFieldFilterCapabilities;
  op?: TypeOpsNormal;
  transform?: TypeSchemaObjectExtensionFieldFilterTransform;
}

declare module 'vona-module-a-openapi' {
  export interface ISchemaObjectExtensionField {
    filter?: ISchemaObjectExtensionFieldFilter;
  }
}
