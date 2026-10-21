import type { TableIdentity } from 'table-identity';
import type { Constructable, OmitNever, TypeOmitStringUnion } from 'vona';

import type { BeanModelMeta } from '../../lib/bean.model/bean.model_meta.ts';
import type { IModelRelationIncludeWrapper } from '../model.ts';
import type { TypeModelColumnsStrict } from '../modelWhere.ts';
import type { IDecoratorModelOptions, IModelClassRecord } from '../onion/model.ts';
import type {
  TypeModelOfModelLike,
  TypeSymbolKeyEntity,
  TypeUtilEntityOmit,
  TypeUtilEntityPartial,
  TypeUtilEntitySelector,
  TypeUtilGetColumnsFromRelationAndIncludeWrapper,
  TypeUtilGetModelOptions,
  TypeUtilGetParamsColumns,
  TypeUtilGetParamsInlcude,
  TypeUtilGetParamsWith,
  TypeUtilGetRelationEntity,
  TypeUtilGetRelationKey,
  TypeUtilGetRelationModel,
  TypeUtilGetRelationOptions,
  TypeUtilGetRelationOptionsAutoload,
  TypeUtilGetRelationType,
  TypeUtilPrepareColumns,
} from '../relations.ts';

export type TypeDtoMutateType = 'create' | 'update' | 'mutate';

export type IDtoMutateParams<ModelLike extends BeanModelMeta | keyof IModelClassRecord> =
  IBuildDtoMutateParams<
    TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity],
    TypeModelOfModelLike<ModelLike>
  >;

export interface IBuildDtoMutateParams<TRecord, Model extends BeanModelMeta>
  extends IModelRelationIncludeWrapper<Model>, IBuildDtoMutateParamsBasic<TRecord> {}

export interface IBuildDtoMutateParamsBasic<TRecord> {
  columns?: TypeModelColumnsStrict<TRecord>;
  dtoClass?: Constructable<unknown>;
}

export type TypeDtoMutateResult<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  TOptionsRelation,
  TMutateTypeTopLevel extends TypeDtoMutateType,
  TColumnsOmitDefault extends string | string[] | undefined = undefined,
  TTopLevel extends boolean | undefined = undefined,
> = TypeDtoMutateRelationResult<
  TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity],
  TypeModelOfModelLike<ModelLike>,
  TOptionsRelation,
  TMutateTypeTopLevel,
  TColumnsOmitDefault,
  TTopLevel
>;

export type TypeDtoMutateRelationResult<
  TRecord,
  TModel extends BeanModelMeta | undefined,
  TOptionsRelation,
  TMutateTypeTopLevel extends TypeDtoMutateType,
  TColumnsOmitDefault extends string | string[] | undefined = undefined,
  TTopLevel extends boolean | undefined = undefined,
  TColumns = undefined,
  REFKEY = undefined,
> = (TOptionsRelation extends { dtoClass: Constructable<infer TDto> }
  ? TypeDtoMutateRelationResultDto<TDto, TMutateTypeTopLevel, TTopLevel, REFKEY>
  : TypeDtoMutateRelationResultEntity<
      TRecord,
      TColumns extends string | string[] ? TColumns : TypeUtilGetParamsColumns<TOptionsRelation>,
      TMutateTypeTopLevel,
      TColumnsOmitDefault,
      TTopLevel,
      REFKEY
    >) &
  (TModel extends BeanModelMeta
    ? OmitNever<
        TypeDtoMutateRelationResultMergeInclude<
          TMutateTypeTopLevel,
          TypeUtilGetModelOptions<TModel>,
          TypeUtilGetParamsInlcude<TOptionsRelation>
        >
      > &
        OmitNever<
          TypeDtoMutateModelRelationResultMergeWith<
            TMutateTypeTopLevel,
            TypeUtilGetParamsWith<TOptionsRelation>
          >
        >
    : {});

type TypeDtoMutateRelationResultMergeInclude<
  TMutateTypeTopLevel extends TypeDtoMutateType,
  TModelOptions extends IDecoratorModelOptions,
  TInclude extends {} | undefined | unknown,
> = {
  [RelationName in keyof TModelOptions['relations']]: TInclude extends {}
    ? TInclude[RelationName] extends {} | boolean
      ? TypeDtoMutateRelationResultMergeIncludeWrapper<
          TMutateTypeTopLevel,
          TModelOptions['relations'][RelationName],
          TInclude[RelationName]
        >
      : TypeDtoMutateRelationResultMergeAutoload<
          TMutateTypeTopLevel,
          TModelOptions['relations'][RelationName]
        >
    : TypeDtoMutateRelationResultMergeAutoload<
        TMutateTypeTopLevel,
        TModelOptions['relations'][RelationName]
      >;
};

type TypeDtoMutateModelRelationResultMergeWith<
  TMutateTypeTopLevel extends TypeDtoMutateType,
  TWith extends {} | undefined | unknown,
> = TWith extends {}
  ? {
      [RelationName in keyof TWith]: TypeDtoMutateRelationResultMergeWithRelation<
        TMutateTypeTopLevel,
        TWith[RelationName]
      >;
    }
  : {};

type TypeDtoMutateRelationResultMergeIncludeWrapper<
  TMutateTypeTopLevel extends TypeDtoMutateType,
  Relation,
  IncludeWrapper,
> = IncludeWrapper extends false
  ? never
  : IncludeWrapper extends true
    ? TypeUtilGetDtoMutateRelationEntityByType<TMutateTypeTopLevel, Relation, undefined>
    : IncludeWrapper extends {}
      ? TypeUtilGetDtoMutateRelationEntityByType<TMutateTypeTopLevel, Relation, IncludeWrapper>
      : never;

type TypeDtoMutateRelationResultMergeAutoload<
  TMutateTypeTopLevel extends TypeDtoMutateType,
  Relation,
> =
  TypeUtilGetRelationOptionsAutoload<Relation> extends true
    ? TypeUtilGetDtoMutateRelationEntityByType<TMutateTypeTopLevel, Relation, undefined>
    : never;

type TypeDtoMutateRelationResultMergeWithRelation<
  TMutateTypeTopLevel extends TypeDtoMutateType,
  WithRelation,
> = WithRelation extends false
  ? never
  : WithRelation extends true
    ? never
    : WithRelation extends {}
      ? TypeUtilGetDtoMutateRelationEntityByType<
          TMutateTypeTopLevel,
          WithRelation,
          TypeUtilGetRelationOptions<WithRelation>
        >
      : never;

// Relation options supply the default dtoClass; an include wrapper may override it.
type TypeUtilGetDtoMutateRelationParams<Relation, IncludeWrapper> = IncludeWrapper extends {
  dtoClass: Constructable<unknown>;
}
  ? IncludeWrapper
  : TypeUtilGetRelationOptions<Relation> extends {
        dtoClass: infer TDtoClass extends Constructable<unknown>;
      }
    ? (IncludeWrapper extends {} ? IncludeWrapper : {}) & { dtoClass: TDtoClass }
    : IncludeWrapper;

type TypeUtilGetDtoMutateRelationEntityByType<
  TMutateTypeTopLevel extends TypeDtoMutateType,
  Relation,
  IncludeWrapper extends {} | undefined | unknown,
> = TypeUtilGetDtoMutateEntityByType<
  TMutateTypeTopLevel,
  TypeUtilGetRelationEntity<Relation>,
  TypeUtilGetRelationType<Relation>,
  TypeUtilGetRelationModel<Relation>,
  TypeUtilGetDtoMutateRelationParams<Relation, IncludeWrapper>,
  TypeUtilGetColumnsFromRelationAndIncludeWrapper<Relation, IncludeWrapper>,
  TypeUtilGetRelationKey<Relation>
>;
type TypeUtilGetDtoMutateEntityByType<
  TMutateTypeTopLevel extends TypeDtoMutateType,
  TRecord,
  TYPE,
  TModel extends BeanModelMeta | undefined,
  IncludeWrapper extends {} | undefined | unknown,
  Columns,
  REFKEY = undefined,
> = TYPE extends 'belongsTo'
  ? never
  : TYPE extends 'belongsToMany'
    ? Array<{ id: TableIdentity; deleted?: boolean }> | undefined
    : TYPE extends 'hasMany'
      ?
          | Array<
              TypeDtoMutateRelationResult<
                TRecord,
                TModel,
                IncludeWrapper,
                TMutateTypeTopLevel,
                undefined,
                false,
                Columns,
                REFKEY
              >
            >
          | undefined
      :
          | TypeDtoMutateRelationResult<
              TRecord,
              TModel,
              IncludeWrapper,
              TMutateTypeTopLevel,
              undefined,
              false,
              Columns,
              REFKEY
            >
          | undefined;

// dtoClass supplies its own fields, so neither columns nor default entity omissions apply.
// Nested mutations still remove the parent key and patch identity/deletion fields that exist.
type TypeDtoMutateRelationResultDto<
  TDto,
  TMutateTypeTopLevel extends TypeDtoMutateType,
  TTopLevel extends boolean | undefined,
  REFKEY,
> = TTopLevel extends false
  ? Omit<
      TMutateTypeTopLevel extends 'create'
        ? Omit<TDto, 'id' | 'deleted'>
        : Partial<Pick<TDto, Extract<keyof TDto, 'id' | 'deleted'>>> & Omit<TDto, 'id' | 'deleted'>,
      Extract<keyof TDto, REFKEY>
    >
  : TDto;

type TypeDtoMutateRelationResultEntity<
  TRecord,
  Columns = undefined,
  TMutateTypeTopLevel extends TypeDtoMutateType | undefined = undefined,
  TColumnsOmitDefault extends string | string[] | undefined = undefined,
  TTopLevel extends boolean | undefined = undefined,
  REFKEY = undefined,
> = TypeDtoMutateRelationResultPatch<
  TypeDtoMutateRelationResultEntityInner<
    TRecord,
    Columns,
    TMutateTypeTopLevel,
    TColumnsOmitDefault,
    TTopLevel
  >,
  TMutateTypeTopLevel,
  TTopLevel,
  REFKEY
>;

type TypeDtoMutateRelationResultPatch<
  TRecordResult,
  TMutateTypeTopLevel extends TypeDtoMutateType | undefined = undefined,
  TTopLevel extends boolean | undefined = undefined,
  REFKEY = undefined,
> = TTopLevel extends false
  ? TypeUtilEntityOmit<
      TypeDtoMutateRelationResultPatch2<TRecordResult, TMutateTypeTopLevel, TTopLevel>,
      REFKEY
    >
  : TypeDtoMutateRelationResultPatch2<TRecordResult, TMutateTypeTopLevel, TTopLevel>;

type TypeDtoMutateRelationResultPatch2<
  TRecordResult,
  TMutateTypeTopLevel extends TypeDtoMutateType | undefined = undefined,
  TTopLevel extends boolean | undefined = undefined,
> = TTopLevel extends false
  ? TMutateTypeTopLevel extends 'update' | 'mutate'
    ? TypeUtilEntityPartial<TRecordResult, 'id' | 'deleted'>
    : TRecordResult
  : TRecordResult;

type TypeDtoMutateRelationResultEntityInner<
  TRecord,
  Columns = undefined,
  TMutateTypeTopLevel extends TypeDtoMutateType | undefined = undefined,
  TColumnsOmitDefault extends string | string[] | undefined = undefined,
  TTopLevel extends boolean | undefined = undefined,
> = [Columns] extends [string | string[]]
  ? TypeDtoMutateRelationResultEntityFromColumns<TRecord, Columns, TMutateTypeTopLevel, TTopLevel>
  : TypeDtoMutateRelationResultEntityFromColumnsOmitDefault<
      TRecord,
      TMutateTypeTopLevel,
      TColumnsOmitDefault
    >;

type TypeDtoMutateRelationResultEntityFromColumns<
  TRecord,
  Columns = undefined,
  TMutateTypeTopLevel extends TypeDtoMutateType | undefined = undefined,
  TTopLevel extends boolean | undefined = undefined,
> = TypeUtilEntitySelector<
  TRecord,
  TypeUtilPrepareColumns<
    TypeDtoMutateRelationResultPrepareColumns<
      TypeUtilPrepareColumns<Columns>,
      TMutateTypeTopLevel,
      TTopLevel
    >
  >
>;

type TypeDtoMutateRelationResultEntityFromColumnsOmitDefault<
  TRecord,
  TMutateTypeTopLevel extends TypeDtoMutateType | undefined = undefined,
  TColumnsOmitDefault extends string | string[] | undefined = undefined,
> = TypeUtilEntityOmit<
  TRecord,
  TypeUtilPrepareColumns<
    TypeDtoMutateRelationResultPrepareColumnsOmitDefault<TMutateTypeTopLevel, TColumnsOmitDefault>
  >
>;

type TypeDtoMutateRelationResultPrepareColumns<
  TColumns = undefined,
  TMutateTypeTopLevel extends TypeDtoMutateType | undefined = undefined,
  TTopLevel extends boolean | undefined = undefined,
> = TTopLevel extends true
  ? TColumns
  : TMutateTypeTopLevel extends 'create'
    ? TypeOmitStringUnion<TColumns, 'deleted' | 'id'>
    : TColumns | 'deleted' | 'id';

type TypeDtoMutateRelationResultPrepareColumnsOmitDefault<
  TMutateTypeTopLevel extends TypeDtoMutateType | undefined = undefined,
  TColumnsOmitDefault extends string | string[] | undefined = undefined,
> = TColumnsOmitDefault extends string | string[]
  ? TColumnsOmitDefault
  : TMutateTypeTopLevel extends 'create'
    ? ['id', 'iid', 'deleted', 'createdAt', 'updatedAt']
    : ['iid', 'createdAt', 'updatedAt'];
