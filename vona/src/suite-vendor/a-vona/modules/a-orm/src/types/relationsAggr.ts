import type { TypeUtilGetParamsAggrs, TypeUtilGetRelationOptionsAggrs } from './relations.ts';

export type TypeModelAggrRelationResult<TOptions> =
  TypeUtilGetParamsAggrs<TOptions> extends {}
    ? TypeModelAggrRelationResultAggrs<TypeUtilGetParamsAggrs<TOptions>>
    : {}; // not use undefined

export type TypeModelAggrRelationResultAggrs<Aggrs> = Aggrs extends {}
  ? TypeRecordAggrsValuesToObject<
      TypeRecordAggrsValues<{
        [K in keyof Aggrs]: K extends string
          ? TypeModelAggrRelationResultAggr<K, TypeUtilAggrPrepareColumns<Aggrs[K]>>
          : never;
      }>
    >
  : {};

export type TypeModelAggrRelationResultAggr<
  Aggr extends string,
  Columns extends string | number | symbol | undefined,
> = Columns extends string ? `${Aggr}_${Columns extends '*' ? 'all' : Columns}` : never;

export type TypeUtilAggrPrepareColumns<TColumns> = TColumns extends string[]
  ? TColumns[number]
  : TColumns extends string
    ? TColumns
    : undefined;
export type TypeRecordAggrsValues<TRecord extends Record<string, any>> = TRecord[keyof TRecord];
export type TypeRecordAggrsValuesToObject<AggrValues extends string> = {
  [K in AggrValues]: string | undefined;
};

export type TypeUtilGetAggrsFromRelationAndIncludeWrapper<
  Relation,
  IncludeWrapper extends {} | undefined | unknown,
> =
  TypeUtilGetRelationOptionsAggrs<Relation> extends {}
    ? TypeUtilGetParamsAggrs<IncludeWrapper> extends {}
      ? TypeUtilGetAggrsFromRelationAndIncludeWrapper_Mixed<
          TypeUtilGetRelationOptionsAggrs<Relation>,
          TypeUtilGetParamsAggrs<IncludeWrapper>
        >
      : TypeUtilGetRelationOptionsAggrs<Relation>
    : undefined;

export type TypeUtilGetAggrsFromRelationAndIncludeWrapper_Mixed<
  RelationAggrs extends {},
  IncludeWrapperAggrs extends {},
> = {
  [K in keyof RelationAggrs]: K extends string
    ? K extends keyof IncludeWrapperAggrs
      ? IncludeWrapperAggrs[K]
      : RelationAggrs[K]
    : undefined;
};
