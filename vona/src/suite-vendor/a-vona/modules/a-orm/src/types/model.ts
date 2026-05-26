import type { Knex } from 'knex';
import type { TSummerCacheActionOptions } from 'vona-module-a-summer';

import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type {
  TypeModelColumn,
  TypeModelColumns,
  TypeModelColumnsPatch,
  TypeModelWhere,
} from './modelWhere.ts';
import type {
  TypeModelOfModelLike,
  TypeModelParamsInclude,
  TypeModelsClassLikeGeneral,
  TypeSymbolKeyEntity,
} from './relations.ts';
import type {
  TypeEntityTableColumnNamesOfGeneral,
  TypeEntityTableColumnsOfGeneral,
} from './relationsColumns.ts';
import type { TypeModelMutateParamsInclude } from './relationsMutate.ts';
import type { TypeEntityTableNamesOfGeneral } from './relationsTables.ts';

export type TypeModelCacheType = 'query' | 'entity';

// join
export type IModelSelectParamsJoinType =
  | 'join'
  | 'innerJoin'
  | 'leftJoin'
  | 'leftOuterJoin'
  | 'rightJoin'
  | 'rightOuterJoin'
  | 'fullOuterJoin'
  | 'crossJoin';
// export interface IModelSelectParamsJoinOnMap { [key: string]: string | number | boolean | Knex.Raw<any> }
export type IModelSelectParamsJoin<TRecord, TableNames = undefined, ColumnNames = keyof TRecord> = [
  IModelSelectParamsJoinType,
  TableNames,
  [ColumnNames, ColumnNames] | Knex.JoinCallback,
];

// order
export type IModelSelectParamsOrderDirection = 'asc' | 'desc';
export type IModelSelectParamsOrderNulls = 'first' | 'last';
export type IModelSelectParamsOrder<ColumnNames> = [
  ColumnNames,
  IModelSelectParamsOrderDirection?,
  IModelSelectParamsOrderNulls?,
];

export interface IBuildModelSelectParams<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
>
  extends
    IModelRelationIncludeWrapper<Model>,
    IBuildModelSelectParamsBasic<
      TRecord,
      TypeModelColumn<TRecord>,
      TableNames,
      ColumnNames,
      Columns
    > {}

export interface IBuildModelSelectParamsBasic<
  TRecord,
  COLUMNS extends TypeModelColumn<TRecord> = TypeModelColumn<TRecord>,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
> {
  distinct?: boolean | keyof TRecord | (keyof TRecord)[];
  columns?: TypeModelColumnsPatch<TRecord, COLUMNS>;
  where?: TypeModelWhere<TRecord, Columns>;
  joins?: IModelSelectParamsJoin<TRecord, TableNames, ColumnNames>[];
  orders?: IModelSelectParamsOrder<ColumnNames>[];
  limit?: number;
  offset?: number;
}

export type IQueryParams<
  Model extends BeanModelMeta = BeanModelMeta,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
> = IModelSelectParams<TypeModelOfModelLike<Model>[TypeSymbolKeyEntity], Model, ModelJoins>;

export type IModelSelectParams<
  TRecord,
  // not use undefined as default value
  Model extends BeanModelMeta = BeanModelMeta,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
> = IBuildModelSelectParams<
  TRecord,
  Model,
  TypeEntityTableNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnsOfGeneral<ModelJoins, Model>
>;

export interface IBuildModelCountParams<
  TRecord,
  _Model extends BeanModelMeta | undefined = undefined,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
> {
  distinct?: boolean | keyof TRecord | (keyof TRecord)[];
  column?: TypeModelColumn<TRecord>;
  where?: TypeModelWhere<TRecord, Columns>;
  joins?: IModelSelectParamsJoin<TRecord, TableNames, ColumnNames>[];
}

export type IModelCountParams<
  TRecord,
  Model extends BeanModelMeta = BeanModelMeta,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
> = IBuildModelCountParams<
  TRecord,
  Model,
  TypeEntityTableNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnsOfGeneral<ModelJoins, Model>
>;

export type IModelMethodOptions = IModelMethodOptionsGeneral;
export type IModelInsertOptions<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
> = IModelInsertOptionsGeneral<TRecord, Model>;
export type IModelUpdateOptions<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
> = IModelUpdateOptionsGeneral<TRecord, Model>;
export type IModelDeleteOptions<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
> = IModelDeleteOptionsGeneral<TRecord, Model>;
export type IModelGetOptions<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
> = IModelGetOptionsGeneral<TRecord, Model>;
export type IModelMutateOptions<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
> = IModelMutateOptionsGeneral<TRecord, Model>;

export interface IModelMethodOptionsGeneral {
  disableDeleted?: boolean;
  disableCreateTime?: boolean;
  disableUpdateTime?: boolean;
  disableCacheQuery?: boolean;
  disableCacheEntity?: boolean;
  deleted?: boolean;
  cache?: TSummerCacheActionOptions<unknown, unknown>;
}

export interface IModelInsertOptionsGeneral<
  _TRecord,
  Model extends BeanModelMeta | undefined = undefined,
>
  extends IModelMethodOptionsGeneral, IModelMutateRelationIncludeWrapper<Model> {}

export interface IModelUpdateOptionsGeneral<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
>
  extends IModelMethodOptionsGeneral, IModelMutateRelationIncludeWrapper<Model> {
  where?: TypeModelWhere<TRecord>;
}

export interface IModelDeleteOptionsGeneral<
  _TRecord,
  Model extends BeanModelMeta | undefined = undefined,
>
  extends IModelMethodOptionsGeneral, IModelMutateRelationIncludeWrapper<Model> {}

export interface IModelGetOptionsGeneral<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
>
  extends IModelMethodOptionsGeneral, IModelRelationIncludeWrapper<Model> {
  columns?: TypeModelColumns<TRecord>;
}

export interface IModelMutateOptionsGeneral<
  _TRecord,
  Model extends BeanModelMeta | undefined = undefined,
>
  extends IModelMethodOptionsGeneral, IModelMutateRelationIncludeWrapper<Model> {}

export interface IModelSelectParamsPage {
  index?: number;
  size?: number;
}

export interface IModelRelationIncludeWrapper<Model extends BeanModelMeta | undefined = undefined> {
  include?: TypeModelParamsInclude<Model>;
  with?: Record<string, unknown>;
}

export interface IModelMutateRelationIncludeWrapper<
  Model extends BeanModelMeta | undefined = undefined,
> {
  include?: TypeModelMutateParamsInclude<Model>;
  with?: Record<string, unknown>;
}
