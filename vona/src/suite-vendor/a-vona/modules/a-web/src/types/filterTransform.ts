import type { OmitNever } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';
import type { TypeQueryInput, TypeQueryOperator, TypeQueryPredicate } from 'vona-module-a-orm';
import type z from 'zod';

import type { IPipeOptionsFilter } from '../bean/pipe.filter.ts';

/** Public canonical input, never a trusted ORM parameter patch. */
export type TypeQueryParamsPatch = TypeQueryInput;

export interface IPipeOptionsFilterTransformInfo {
  params: TypeQueryParamsPatch;
  query: Record<string, unknown>;
  options: IPipeOptionsFilter;
  originalName: string;
  fullName: string;
  key?: string;
  value?: any;
  type?: string;
  op?: TypeQueryOperator;
  schema?: z.ZodType;
  openapi?: ISchemaObjectExtensionField;
}

export interface IFilterTransformRecord {}

export interface IFilterTransformWhere {
  where(
    info: IPipeOptionsFilterTransformInfo,
    options: IDecoratorFilterTransformOptions,
  ): Promise<TypeQueryPredicate | undefined>;
}

export interface IDecoratorFilterTransformOptions {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    filterTransform: ServiceOnion<IFilterTransformRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    filterTransform: OmitNever<IFilterTransformRecord>;
  }

  export interface IBeanSceneRecord {
    filterTransform: never;
  }
}
