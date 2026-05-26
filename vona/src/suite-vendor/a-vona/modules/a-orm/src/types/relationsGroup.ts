import type { TypeModelSelectAggrParamsAggrs } from './modelAggr.ts';
import type { TypeModelColumnsStrict } from './modelWhere.ts';
import type {
  TypeUtilGetParamsAggrs,
  TypeUtilGetParamsColumns,
  TypeUtilGetParamsGroups,
  TypeUtilGetRelationOptionsGroups,
} from './relations.ts';
import type {
  TypeModelAggrRelationResultAggr,
  TypeModelAggrRelationResultAggrs,
  TypeRecordAggrsValues,
  TypeRecordAggrsValuesToObject,
  TypeUtilAggrPrepareColumns,
} from './relationsAggr.ts';

export type TypeModelGroupRelationResult<TRecord, TOptions> = TypeModelGroupRelationResultGroups<
  TRecord,
  TypeUtilGetParamsAggrs<TOptions>,
  TypeUtilGetParamsGroups<TOptions>,
  TypeUtilGetParamsColumns<TOptions>
>;

export type TypeModelGroupRelationResultGroups<TRecord, Aggrs, Groups, Columns> = Groups extends
  | string
  | string[]
  ? TypeModelGroupRelationResultGroupsObject<TRecord, Groups, Columns> &
      (Aggrs extends {}
        ? TypeRecordAggrsValuesToObject<
            TypeRecordAggrsValues<{
              [K in keyof Aggrs]: K extends string
                ? TypeModelAggrRelationResultAggr<K, TypeUtilAggrPrepareColumns<Aggrs[K]>>
                : never;
            }>
          >
        : {})
  : {}; // not use undefined

export type TypeModelGroupRelationResultGroupsObject<TRecord, Groups, Columns> = Columns extends
  | string
  | string[]
  ? { [K in TypeUtilAggrPrepareColumns<Columns>]: K extends keyof TRecord ? TRecord[K] : never }
  : Groups extends string | string[]
    ? { [K in TypeUtilAggrPrepareColumns<Groups>]: K extends keyof TRecord ? TRecord[K] : never }
    : {};

export type TypeModelSelectGroupParamsColumnNames<
  TRecord,
  ColumnNames extends TypeModelColumnsStrict<TRecord> | undefined = TypeModelColumnsStrict<TRecord>,
  Aggrs extends TypeModelSelectAggrParamsAggrs<TRecord> | undefined =
    TypeModelSelectAggrParamsAggrs<TRecord>,
> =
  | (ColumnNames extends TypeModelColumnsStrict<TRecord>
      ? TypeUtilAggrPrepareColumns<ColumnNames>
      : never)
  | (Aggrs extends TypeModelSelectAggrParamsAggrs<TRecord>
      ? keyof TypeModelAggrRelationResultAggrs<Aggrs>
      : never);

export type TypeModelSelectGroupParamsColumns<
  TRecord,
  ColumnNames extends TypeModelColumnsStrict<TRecord> | undefined = TypeModelColumnsStrict<TRecord>,
  Aggrs extends TypeModelSelectAggrParamsAggrs<TRecord> | undefined =
    TypeModelSelectAggrParamsAggrs<TRecord>,
> = (TypeUtilAggrPrepareColumns<ColumnNames> extends string
  ? { [K in TypeUtilAggrPrepareColumns<ColumnNames>]: K extends keyof TRecord ? TRecord[K] : never }
  : {}) &
  TypeModelAggrRelationResultAggrsToNumberType<TypeModelAggrRelationResultAggrs<Aggrs>>;

export type TypeModelAggrRelationResultAggrsToNumberType<Columns> = {
  [K in keyof Columns]: string;
}; // not use BigNumber or number | string

export type TypeUtilGetGroupsFromRelationAndIncludeWrapper<
  Relation,
  IncludeWrapper extends {} | undefined | unknown,
> =
  TypeUtilGetParamsGroups<IncludeWrapper> extends string | string[]
    ? TypeUtilGetParamsGroups<IncludeWrapper>
    : TypeUtilGetRelationOptionsGroups<Relation>;
