import type { OmitNever } from 'vona';

import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { IModelSelectParamsJoin } from './model.ts';
import type { TypeModelColumns, TypeModelWhere } from './modelWhere.ts';
import type { TypeModelsClassLikeGeneral } from './relations.ts';
import type {
  TypeEntityTableColumnNamesOfGeneral,
  TypeEntityTableColumnsOfGeneral,
} from './relationsColumns.ts';
import type { TypeEntityTableNamesOfGeneral } from './relationsTables.ts';

// export interface TypeModelSelectAggrParamsAggrs<TRecord> {
//   count?: TypeModelColumns<TRecord>;
//   sum?: TypeModelColumnsStrict<TRecord>;
//   avg?: TypeModelColumnsStrict<TRecord>;
//   max?: TypeModelColumnsStrict<TRecord>;
//   min?: TypeModelColumnsStrict<TRecord>;
// }

export interface TypeModelSelectAggrParamsAggrs<TRecord> {
  count?: TypeModelColumns<TRecord>;
  sum?:
    | TypeEntityTableColumnNamesForAggrs<TRecord>
    | Array<TypeEntityTableColumnNamesForAggrs<TRecord>>;
  avg?:
    | TypeEntityTableColumnNamesForAggrs<TRecord>
    | Array<TypeEntityTableColumnNamesForAggrs<TRecord>>;
  max?:
    | TypeEntityTableColumnNamesForAggrs<TRecord>
    | Array<TypeEntityTableColumnNamesForAggrs<TRecord>>;
  min?:
    | TypeEntityTableColumnNamesForAggrs<TRecord>
    | Array<TypeEntityTableColumnNamesForAggrs<TRecord>>;
}

export type TypeEntityTableColumnNamesForAggrs<Entity> =
  keyof TypeEntityTableColumnsForAggrs<Entity>;

export type TypeEntityTableColumnsForAggrs<Entity> = OmitNever<
  Omit<
    {
      [K in keyof Entity as Entity[K] extends number | undefined ? K : never]: Entity[K];
    },
    'id' | 'iid'
  >
>;

export interface IBuildModelSelectAggrParams<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
> extends IBuildModelSelectAggrParamsBasic<TRecord, Model, TableNames, ColumnNames, Columns> {}

export interface IBuildModelSelectAggrParamsBasic<
  TRecord,
  _Model extends BeanModelMeta | undefined = undefined,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
> {
  distinct?: boolean | keyof TRecord | (keyof TRecord)[];
  aggrs: TypeModelSelectAggrParamsAggrs<TRecord>;
  where?: TypeModelWhere<TRecord, Columns>;
  joins?: IModelSelectParamsJoin<TRecord, TableNames, ColumnNames>[];
}

export type IModelSelectAggrParams<
  TRecord,
  // not use undefined as default value
  Model extends BeanModelMeta = BeanModelMeta,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
> = IBuildModelSelectAggrParams<
  TRecord,
  Model,
  TypeEntityTableNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnsOfGeneral<ModelJoins, Model>
>;
