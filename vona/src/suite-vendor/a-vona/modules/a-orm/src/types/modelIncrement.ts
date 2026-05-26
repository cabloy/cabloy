import type { OmitNever } from 'vona';

import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { IModelSelectParamsJoin } from './model.ts';
import type { TypeModelWhere } from './modelWhere.ts';
import type { TypeModelsClassLikeGeneral } from './relations.ts';
import type {
  TypeEntityTableColumnNamesOfGeneral,
  TypeEntityTableColumnsOfGeneral,
} from './relationsColumns.ts';
import type { TypeEntityTableNamesOfGeneral } from './relationsTables.ts';

export type TypeModelIncrementParamsColumns<Entity> = OmitNever<
  Omit<
    {
      [K in keyof Entity as Entity[K] extends number | undefined ? K : never]?: number;
    },
    'id' | 'iid'
  >
>;

export interface IBuildModelIncrementParams<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
> extends IBuildModelIncrementParamsBasic<TRecord, Model, TableNames, ColumnNames, Columns> {}

export interface IBuildModelIncrementParamsBasic<
  TRecord,
  _Model extends BeanModelMeta | undefined = undefined,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
> {
  columns: TypeModelIncrementParamsColumns<TRecord>;
  where: TypeModelWhere<TRecord, Columns>;
  joins?: IModelSelectParamsJoin<TRecord, TableNames, ColumnNames>[];
}

export type IModelIncrementParams<
  TRecord,
  // not use undefined as default value
  Model extends BeanModelMeta = BeanModelMeta,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
> = IBuildModelIncrementParams<
  TRecord,
  Model,
  TypeEntityTableNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnsOfGeneral<ModelJoins, Model>
>;
