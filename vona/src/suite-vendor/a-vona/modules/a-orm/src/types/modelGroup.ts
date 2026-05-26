import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { IModelSelectParamsJoin, IModelSelectParamsOrder } from './model.ts';
import type { TypeModelSelectAggrParamsAggrs } from './modelAggr.ts';
import type { TypeModelColumnsStrict, TypeModelWhere } from './modelWhere.ts';
import type { TypeModelsClassLikeGeneral } from './relations.ts';
import type {
  TypeEntityTableColumnNamesOfGeneral,
  TypeEntityTableColumnsOfGeneral,
} from './relationsColumns.ts';
import type {
  TypeModelSelectGroupParamsColumnNames,
  TypeModelSelectGroupParamsColumns,
} from './relationsGroup.ts';
import type { TypeEntityTableNamesOfGeneral } from './relationsTables.ts';

export interface IBuildModelSelectGroupParams<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
> extends IBuildModelSelectGroupParamsBasic<TRecord, Model, TableNames, ColumnNames, Columns> {}

export interface IBuildModelSelectGroupParamsBasic<
  TRecord,
  _Model extends BeanModelMeta | undefined = undefined,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
> {
  distinct?: boolean | keyof TRecord | (keyof TRecord)[];
  aggrs?: TypeModelSelectAggrParamsAggrs<TRecord>;
  groups: TypeModelColumnsStrict<TRecord>;
  columns?: TypeModelColumnsStrict<TRecord>;
  where?: TypeModelWhere<TRecord, Columns>;
  joins?: IModelSelectParamsJoin<TRecord, TableNames, ColumnNames>[];
  having?: TypeModelWhere<TRecord, TypeModelSelectGroupParamsColumns<TRecord>>;
  orders?: IModelSelectParamsOrder<TypeModelSelectGroupParamsColumnNames<TRecord>>[];
  limit?: number;
  offset?: number;
}

export type IModelSelectGroupParams<
  TRecord,
  // not use undefined as default value
  Model extends BeanModelMeta = BeanModelMeta,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
> = IBuildModelSelectGroupParams<
  TRecord,
  Model,
  TypeEntityTableNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnsOfGeneral<ModelJoins, Model>
>;
