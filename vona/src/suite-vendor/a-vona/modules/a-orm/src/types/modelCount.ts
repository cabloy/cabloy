import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { IModelSelectParamsJoin } from './model.ts';
import type { TypeModelColumn, TypeModelWhere } from './modelWhere.ts';
import type { TypeModelsClassLikeGeneral } from './relations.ts';
import type {
  TypeEntityTableColumnNamesOfGeneral,
  TypeEntityTableColumnsOfGeneral,
} from './relationsColumns.ts';
import type { TypeEntityTableNamesOfGeneral } from './relationsTables.ts';

export interface IBuildModelSelectCountParams<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
> extends IBuildModelSelectCountParamsBasic<TRecord, Model, TableNames, ColumnNames, Columns> {}

export interface IBuildModelSelectCountParamsBasic<
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

export type IModelSelectCountParams<
  TRecord,
  // not use undefined as default value
  Model extends BeanModelMeta = BeanModelMeta,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
> = IBuildModelSelectCountParams<
  TRecord,
  Model,
  TypeEntityTableNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnsOfGeneral<ModelJoins, Model>
>;
