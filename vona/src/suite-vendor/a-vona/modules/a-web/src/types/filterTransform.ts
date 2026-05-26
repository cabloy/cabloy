import type { OmitNever } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';
import type { IQueryParams } from 'vona-module-a-orm';
import type z from 'zod';

import type { IPipeOptionsFilter } from '../bean/pipe.filter.ts';

export type TypeQueryParamsPatch = IQueryParams & { where: {} };

export interface IPipeOptionsFilterTransformInfo {
  params: TypeQueryParamsPatch;
  query: any;
  options: IPipeOptionsFilter;
  originalName: string;
  fullName: string;
  key?: string;
  value?: any;
  type?: string;
  schema?: z.ZodType;
  openapi?: ISchemaObjectExtensionField;
}

export interface IFilterTransformRecord {}

export interface IFilterTransformWhere {
  where(
    info: IPipeOptionsFilterTransformInfo,
    options: IDecoratorFilterTransformOptions,
  ): Promise<boolean>;
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
