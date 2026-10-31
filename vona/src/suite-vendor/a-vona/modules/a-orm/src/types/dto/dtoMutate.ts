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

export const SymbolDtoMutateRelations = Symbol('SymbolDtoMutateRelations');

export type TypeDtoMutateType = 'create' | 'update' | 'mutate';

// Static phantom metadata survives ordinary subclassing without becoming a DTO field.
// Runtime stores the corresponding resolved relation plans as mapped-class metadata.
export type TypeDtoMutateClass<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  TOptionsRelation,
  TMutateTypeTopLevel extends TypeDtoMutateType,
  TColumnsOmitDefault extends string | string[] | undefined = undefined,
  TTopLevel extends boolean | undefined = undefined,
> = Constructable<
  TypeDtoMutateResult<
    ModelLike,
    TOptionsRelation,
    TMutateTypeTopLevel,
    TColumnsOmitDefault,
    TTopLevel
  >
> & {
  [SymbolDtoMutateRelations]?: TypeDtoMutateOwnedRelations<
    TypeModelOfModelLike<ModelLike>,
    TOptionsRelation
  >;
};

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
> = TypeDtoMutateMergeRelations<
  TOptionsRelation extends { dtoClass: Constructable<infer TDto> }
    ? TypeDtoMutateRelationResultDto<TDto, TMutateTypeTopLevel, TTopLevel, REFKEY>
    : TypeDtoMutateRelationResultEntity<
        TRecord,
        TColumns extends string | string[] ? TColumns : TypeUtilGetParamsColumns<TOptionsRelation>,
        TMutateTypeTopLevel,
        TColumnsOmitDefault,
        TTopLevel,
        REFKEY
      >,
  TypeDtoMutateRelationPlans<TModel, TOptionsRelation>,
  TMutateTypeTopLevel
>;

// Plans describe only declared relations, never arbitrary object/array schema fields.
// A fresh include/with/autoload selection replaces the whole retained plan of that name.
type TypeDtoMutateIncludePlans<TModelOptions extends IDecoratorModelOptions, TInclude> = OmitNever<{
  [Name in keyof TModelOptions['relations']]: TInclude extends {}
    ? TInclude[Name] extends false
      ? false
      : TInclude[Name] extends true
        ? [TModelOptions['relations'][Name], undefined]
        : TInclude[Name] extends {}
          ? [TModelOptions['relations'][Name], TInclude[Name]]
          : TypeDtoMutateAutoloadPlan<TModelOptions['relations'][Name]>
    : TypeDtoMutateAutoloadPlan<TModelOptions['relations'][Name]>;
}>;

type TypeDtoMutateAutoloadPlan<Relation> =
  TypeUtilGetRelationOptionsAutoload<Relation> extends true ? [Relation, undefined] : never;

type TypeDtoMutateWithPlans<TWith> = TWith extends {}
  ? OmitNever<{
      [Name in keyof TWith]: TWith[Name] extends boolean
        ? never
        : TWith[Name] extends {}
          ? [TWith[Name], TypeUtilGetRelationOptions<TWith[Name]>]
          : never;
    }>
  : {};

type TypeDtoMutateFreshPlans<
  TModel extends BeanModelMeta | undefined,
  TOptionsRelation,
  TWith = TypeDtoMutateWithPlans<TypeUtilGetParamsWith<TOptionsRelation>>,
> = Omit<
  TModel extends BeanModelMeta
    ? TypeDtoMutateIncludePlans<
        TypeUtilGetModelOptions<TModel>,
        TypeUtilGetParamsInlcude<TOptionsRelation>
      >
    : {},
  keyof TWith
> &
  TWith;

type TypeDtoMutateRetainedPlans<TOptionsRelation> = TOptionsRelation extends {
  dtoClass: infer TClass extends Constructable<unknown>;
}
  ? typeof SymbolDtoMutateRelations extends keyof TClass
    ? Pick<
        NonNullable<TClass[typeof SymbolDtoMutateRelations]>,
        Extract<
          keyof NonNullable<TClass[typeof SymbolDtoMutateRelations]>,
          keyof InstanceType<TClass>
        >
      >
    : {}
  : {};

type TypeDtoMutateRelationPlans<
  TModel extends BeanModelMeta | undefined,
  TOptionsRelation,
  TFresh = TypeDtoMutateFreshPlans<TModel, TOptionsRelation>,
> = Omit<TypeDtoMutateRetainedPlans<TOptionsRelation>, keyof TFresh> & TFresh;

type TypeDtoMutateOwnedRelations<
  TModel extends BeanModelMeta | undefined,
  TOptionsRelation,
  TPlans = TypeDtoMutateRelationPlans<TModel, TOptionsRelation>,
> = OmitNever<{
  [Name in keyof TPlans]: TPlans[Name] extends [infer Relation, unknown]
    ? TypeUtilGetRelationType<Relation> extends 'hasOne' | 'hasMany'
      ? TPlans[Name]
      : never
    : never;
}>;

type TypeDtoMutateProjectRelations<TPlans, TMutateType extends TypeDtoMutateType> = OmitNever<{
  [Name in keyof TPlans]: TPlans[Name] extends [infer Relation, infer IncludeWrapper]
    ? TypeUtilGetDtoMutateRelationEntityByType<TMutateType, Relation, IncludeWrapper>
    : never;
}>;

type TypeDtoMutateDisabledRelations<TPlans> = {
  [Name in keyof TPlans]: TPlans[Name] extends false ? Name : never;
}[keyof TPlans];

type TypeDtoMutateMergeRelations<
  TBase,
  TPlans,
  TMutateType extends TypeDtoMutateType,
  TRelations = TypeDtoMutateProjectRelations<TPlans, TMutateType>,
  TDisabled extends keyof TBase = Extract<keyof TBase, TypeDtoMutateDisabledRelations<TPlans>>,
> = Omit<TBase, keyof TRelations | TDisabled> & Partial<Pick<TBase, TDisabled>> & TRelations;

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
