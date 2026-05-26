import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type {
  IModelRelationIncludeWrapper,
  IModelSelectParamsJoin,
  IModelSelectParamsOrder,
} from './model.ts';
import type { TypeModelSelectAggrParamsAggrs } from './modelAggr.ts';
import type {
  TypeModelColumn,
  TypeModelColumnsPatch,
  TypeModelColumnsStrict,
  TypeModelWhere,
} from './modelWhere.ts';
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

export interface IBuildModelSelectGeneralParams<
  TRecord,
  Model extends BeanModelMeta | undefined = undefined,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
>
  extends
    IModelRelationIncludeWrapper<Model>,
    IBuildModelSelectGeneralParamsBasic<
      TRecord,
      TypeModelColumn<TRecord>,
      TableNames,
      ColumnNames,
      Columns
    > {}

export interface IBuildModelSelectGeneralParamsBasic<
  TRecord,
  TColumn extends TypeModelColumn<TRecord> | undefined = TypeModelColumn<TRecord>,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
  Aggrs extends TypeModelSelectAggrParamsAggrs<TRecord> | undefined = undefined,
  Groups extends TypeModelColumnsStrict<TRecord> | undefined = undefined,
> {
  distinct?: boolean | keyof TRecord | (keyof TRecord)[];
  columns?: Groups extends TypeModelColumnsStrict<TRecord>
    ? TColumn extends string
      ? TColumn | Array<TColumn>
      : TColumn
    : TypeModelColumnsPatch<TRecord, TColumn>;
  aggrs?: Aggrs;
  groups?: Groups;
  having?: TypeModelWhere<TRecord, TypeModelSelectGroupParamsColumns<TRecord, Groups, Aggrs>>;
  where?: TypeModelWhere<TRecord, Columns>;
  joins?: IModelSelectParamsJoin<TRecord, TableNames, ColumnNames>[];
  orders?: Groups extends TypeModelColumnsStrict<TRecord>
    ? IModelSelectParamsOrder<TypeModelSelectGroupParamsColumnNames<TRecord, Groups, Aggrs>>[]
    : Aggrs extends TypeModelSelectAggrParamsAggrs<TRecord>
      ? never
      : IModelSelectParamsOrder<ColumnNames>[];
  limit?: number;
  offset?: number;
}

export type IModelSelectGeneralParams<
  TRecord,
  // not use undefined as default value
  Model extends BeanModelMeta = BeanModelMeta,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
> = IBuildModelSelectGeneralParams<
  TRecord,
  Model,
  TypeEntityTableNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnNamesOfGeneral<ModelJoins, Model>,
  TypeEntityTableColumnsOfGeneral<ModelJoins, Model>
>;
