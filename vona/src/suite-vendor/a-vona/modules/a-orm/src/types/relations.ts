import type { Constructable, OmitNever } from 'vona';

import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { TypeDepthPrev, TypeDepthPrevMax } from './depth.ts';
import type { IDecoratorModelOptions, IModelClassRecord } from './onion/model.ts';
import type {
  TypeModelAggrRelationResultAggrs,
  TypeUtilGetAggrsFromRelationAndIncludeWrapper,
} from './relationsAggr.ts';
import type {
  TypeModelGroupRelationResultGroups,
  TypeUtilGetGroupsFromRelationAndIncludeWrapper,
} from './relationsGroup.ts';

export const SymbolKeyEntity = Symbol('$entity');
export const SymbolKeyEntityMeta = Symbol('$entityMeta');
export const SymbolKeyModelOptions = Symbol('$modelOptions');
export type TypeSymbolKeyEntity = typeof SymbolKeyEntity;
export type TypeSymbolKeyEntityMeta = typeof SymbolKeyEntityMeta;
export type TypeSymbolKeyModelOptions = typeof SymbolKeyModelOptions;

export type TypeModelOfModelLike<
  ModelLike extends
    | (() => Constructable<BeanModelMeta>)
    | Constructable<BeanModelMeta>
    | (() => BeanModelMeta)
    | BeanModelMeta
    | keyof IModelClassRecord,
> = ModelLike extends keyof IModelClassRecord
  ? IModelClassRecord[ModelLike]
  : ModelLike extends () => Constructable<infer MODEL>
    ? MODEL
    : ModelLike extends Constructable<infer MODEL>
      ? MODEL
      : ModelLike extends () => infer MODEL
        ? MODEL
        : ModelLike;

export type TypeModelClassLike<MODEL extends BeanModelMeta | keyof IModelClassRecord> =
  MODEL extends BeanModelMeta ? (() => Constructable<MODEL>) | Constructable<MODEL> : MODEL;

export type TypeModelClassLikeGeneral<MODEL extends BeanModelMeta = BeanModelMeta> =
  | (() => Constructable<MODEL>)
  | Constructable<MODEL>
  | (() => BeanModelMeta)
  | BeanModelMeta
  | keyof IModelClassRecord;

export type TypeModelsClassLikeGeneral<MODEL extends BeanModelMeta = BeanModelMeta> =
  | TypeModelClassLikeGeneral<MODEL>
  | Array<TypeModelClassLikeGeneral<MODEL>>;

export type TypeModelParamsInclude<MODEL extends BeanModelMeta | undefined> =
  TypeModelParamsIncludeByModelOptions<TypeUtilGetModelOptions<MODEL>>;

export type TypeModelParamsIncludeByModelOptions<
  ModelOptions extends IDecoratorModelOptions | undefined,
> = ModelOptions extends IDecoratorModelOptions
  ? {
      [relationName in keyof ModelOptions['relations']]?: TypeModelParamsRelationOptions<
        ModelOptions['relations'][relationName]
      >;
    }
  : never;

export type TypeModelParamsRelationOptions<Relation> =
  | boolean
  | (Omit<TypeUtilGetRelationOptions<Relation>, 'autoload'> & {
      include?: TypeModelParamsInclude<TypeUtilGetRelationModel<Relation>>;
      with?: Record<string, unknown>;
    });

export type TypeUtilGetRelationType<Relation> = Relation extends { type?: infer TYPE }
  ? TYPE
  : undefined;
export type TypeUtilGetRelationKey<Relation> = Relation extends { key?: infer KEY }
  ? KEY
  : undefined;
export type TypeUtilGetRelationModel<Relation> = Relation extends {
  model?:
    | (() => Constructable<infer MODEL extends BeanModelMeta>)
    | Constructable<infer MODEL extends BeanModelMeta>;
}
  ? MODEL
  : Relation extends {
        model?: (() => infer MODEL extends BeanModelMeta) | (infer MODEL extends BeanModelMeta);
      }
    ? MODEL
    : Relation extends { model?: () => Constructable<infer MODEL extends BeanModelMeta> }
      ? MODEL
      : Relation extends { model?: () => infer MODEL extends BeanModelMeta }
        ? MODEL
        : Relation extends { model?: Constructable<infer MODEL extends BeanModelMeta> }
          ? MODEL
          : Relation extends { model?: infer MODEL extends BeanModelMeta }
            ? MODEL
            : Relation extends { model?: infer MODELNAME extends keyof IModelClassRecord }
              ? IModelClassRecord[MODELNAME]
              : undefined;

export type TypeUtilGetRelationModelOptions<Relation> = TypeUtilGetModelOptions<
  TypeUtilGetRelationModel<Relation>
>;
export type TypeUtilGetRelationEntity<Relation> = TypeUtilGetModelEntity<
  TypeUtilGetRelationModel<Relation>
>;
export type TypeUtilGetRelationEntityMeta<Relation> = TypeUtilGetModelEntityMeta<
  TypeUtilGetRelationModel<Relation>
>;
export type TypeUtilGetRelationOptions<Relation> = Relation extends { options?: infer OPTIONS }
  ? OPTIONS
  : undefined;
export type TypeUtilGetRelationOptionsAutoload<Relation> = Relation extends {
  options?: { autoload?: infer AUTOLOAD };
}
  ? AUTOLOAD
  : undefined;
export type TypeUtilGetRelationOptionsColumns<Relation> = Relation extends {
  options?: { columns?: infer COLUMNS };
}
  ? COLUMNS
  : undefined;
export type TypeUtilGetRelationOptionsAggrs<Relation> = Relation extends {
  options?: { aggrs?: infer Aggrs };
}
  ? Aggrs
  : undefined;
export type TypeUtilGetRelationOptionsGroups<Relation> = Relation extends {
  options?: { groups?: infer Groups };
}
  ? Groups
  : undefined;
export type TypeUtilGetModelOptions<Model extends BeanModelMeta | undefined> =
  Model extends BeanModelMeta ? Model[TypeSymbolKeyModelOptions] : undefined;
export type TypeUtilGetModelEntity<Model extends BeanModelMeta | undefined> =
  Model extends BeanModelMeta ? Model[TypeSymbolKeyEntity] : undefined;
export type TypeUtilGetModelEntityMeta<Model extends BeanModelMeta | undefined> =
  Model extends BeanModelMeta ? Model[TypeSymbolKeyEntityMeta] : undefined;
export type TypeUtilGetModelOnionName<Model extends BeanModelMeta | undefined> =
  Model extends BeanModelMeta ? Model['$onionName'] : undefined;

export type TypeUtilGetRelationEntityByType<
  Relation,
  IncludeWrapper extends {} | undefined | unknown,
  Depth extends TypeDepthPrev[number] = TypeDepthPrevMax,
> = TypeUtilGetEntityByType<
  TypeUtilGetRelationEntity<Relation>,
  TypeUtilGetRelationType<Relation>,
  TypeUtilGetRelationModel<Relation>,
  IncludeWrapper,
  TypeUtilGetColumnsFromRelationAndIncludeWrapper<Relation, IncludeWrapper>,
  TypeUtilGetAggrsFromRelationAndIncludeWrapper<Relation, IncludeWrapper>,
  TypeUtilGetGroupsFromRelationAndIncludeWrapper<Relation, IncludeWrapper>,
  Depth
>;

export type TypeUtilGetEntityByType<
  TRecord,
  TYPE,
  TModel extends BeanModelMeta | undefined,
  IncludeWrapper extends {} | undefined | unknown,
  Columns,
  Aggrs,
  Groups,
  Depth extends TypeDepthPrev[number] = TypeDepthPrevMax,
> = TYPE extends 'hasMany' | 'belongsToMany'
  ? Groups extends string | string[]
    ? Array<TypeModelRelationResult<TRecord, TModel, IncludeWrapper, Columns, Aggrs, Groups>>
    : Aggrs extends {}
      ? TypeModelRelationResult<TRecord, TModel, IncludeWrapper, Columns, Aggrs> | undefined
      : Array<TypeModelRelationResult<TRecord, TModel, IncludeWrapper, Columns>>
  : [Depth] extends [never]
    ? undefined
    :
        | TypeModelRelationResult<
            TRecord,
            TModel,
            IncludeWrapper,
            Columns,
            undefined,
            undefined,
            TypeDepthPrev[Depth]
          >
        | undefined;

export type TypeUtilGetParamsAggrs<TParams> = TParams extends { aggrs?: infer Aggrs }
  ? Aggrs
  : undefined;
export type TypeUtilGetParamsGroups<TParams> = TParams extends { groups?: infer Groups }
  ? Groups
  : undefined; // not use Groups extends string |string[]
export type TypeUtilGetParamsInlcude<TParams> = TParams extends { include?: infer INCLUDE }
  ? INCLUDE
  : undefined;
export type TypeUtilGetParamsWith<TParams> = TParams extends { with?: infer WITH }
  ? WITH
  : undefined;
export type TypeUtilGetParamsColumns<TParams> = TParams extends { columns?: infer COLUMNS }
  ? COLUMNS
  : undefined;
export type TypeUtilPrepareColumns<TColumns> = TColumns extends '*' | ['*']
  ? undefined
  : TColumns extends string[]
    ? TColumns[number]
    : TColumns extends string
      ? TColumns
      : undefined;
export type TypeUtilEntitySelector<TRecord, TColumns> = [TColumns] extends [keyof TRecord]
  ? Pick<TRecord, TColumns>
  : TRecord;
export type TypeUtilEntityOmit<TRecord, TColumns> = [TColumns] extends [keyof TRecord]
  ? Omit<TRecord, TColumns>
  : TRecord;
export type TypeUtilEntityPartial<TRecord, TColumns> = [TColumns] extends [keyof TRecord]
  ? Partial<Pick<TRecord, TColumns>> & Omit<TRecord, TColumns>
  : TRecord;
export type TypeUtilGetColumnsFromRelationAndIncludeWrapper<
  Relation,
  IncludeWrapper extends {} | undefined | unknown,
> =
  TypeUtilGetParamsColumns<IncludeWrapper> extends string | string[]
    ? TypeUtilGetParamsColumns<IncludeWrapper>
    : TypeUtilGetRelationOptionsColumns<Relation>;

export interface TypeModelSelectAndCount<
  TRecord,
  TModel extends BeanModelMeta | undefined,
  TOptionsRelation,
  TColumns = undefined,
  Aggrs = undefined,
  Groups = undefined,
  Depth extends TypeDepthPrev[number] = TypeDepthPrevMax,
> {
  list: TypeModelRelationResult<
    TRecord,
    TModel,
    TOptionsRelation,
    TColumns,
    Aggrs,
    Groups,
    Depth
  >[];
  total: string;
  pageCount: number;
  pageSize: number;
  pageNo: number;
}

export type TypeModelRelationResult<
  TRecord,
  TModel extends BeanModelMeta | undefined,
  TOptionsRelation,
  TColumns = undefined,
  Aggrs = undefined,
  Groups = undefined,
  Depth extends TypeDepthPrev[number] = TypeDepthPrevMax,
> = Groups extends string | string[]
  ? TypeModelGroupRelationResultGroups<TRecord, Aggrs, Groups, TColumns>
  : Aggrs extends {}
    ? TypeModelAggrRelationResultAggrs<Aggrs>
    : TypeModelRelationResult_Normal<TRecord, TModel, TOptionsRelation, TColumns, Depth>;

export type TypeModelRelationResult_Normal<
  TRecord,
  TModel extends BeanModelMeta | undefined,
  TOptionsRelation,
  TColumns = undefined,
  Depth extends TypeDepthPrev[number] = TypeDepthPrevMax,
> = TypeUtilEntitySelector<
  TRecord,
  TypeUtilPrepareColumns<
    TColumns extends string | string[] ? TColumns : TypeUtilGetParamsColumns<TOptionsRelation>
  >
> &
  (TModel extends BeanModelMeta
    ? OmitNever<
        TypeModelRelationResultMergeInclude<
          TypeUtilGetModelOptions<TModel>,
          TypeUtilGetParamsInlcude<TOptionsRelation>,
          Depth
        >
      > &
        OmitNever<TypeModelRelationResultMergeWith<TypeUtilGetParamsWith<TOptionsRelation>, Depth>>
    : {});

export type TypeModelRelationResultMergeInclude<
  TModelOptions extends IDecoratorModelOptions,
  TInclude extends {} | undefined | unknown,
  Depth extends TypeDepthPrev[number] = TypeDepthPrevMax,
> = {
  [RelationName in keyof TModelOptions['relations']]: TInclude extends {}
    ? TInclude[RelationName] extends {} | boolean
      ? TypeModelRelationResultMergeIncludeWrapper<
          TModelOptions['relations'][RelationName],
          TInclude[RelationName],
          Depth
        >
      : TypeModelRelationResultMergeAutoload<TModelOptions['relations'][RelationName], Depth>
    : TypeModelRelationResultMergeAutoload<TModelOptions['relations'][RelationName], Depth>;
};

export type TypeModelRelationResultMergeWith<
  TWith extends {} | undefined | unknown,
  Depth extends TypeDepthPrev[number] = TypeDepthPrevMax,
> = TWith extends {}
  ? {
      [RelationName in keyof TWith]: TypeModelRelationResultMergeWithRelation<
        TWith[RelationName],
        Depth
      >;
    }
  : {};

export type TypeModelRelationResultMergeAutoload<
  Relation,
  Depth extends TypeDepthPrev[number] = TypeDepthPrevMax,
> =
  TypeUtilGetRelationOptionsAutoload<Relation> extends true
    ? TypeUtilGetRelationEntityByType<Relation, undefined, Depth>
    : never;

export type TypeModelRelationResultMergeIncludeWrapper<
  Relation,
  IncludeWrapper,
  Depth extends TypeDepthPrev[number] = TypeDepthPrevMax,
> = IncludeWrapper extends false
  ? never
  : IncludeWrapper extends true
    ? TypeUtilGetRelationEntityByType<Relation, undefined, Depth>
    : IncludeWrapper extends {}
      ? TypeUtilGetRelationEntityByType<Relation, IncludeWrapper, Depth>
      : never;

export type TypeModelRelationResultMergeWithRelation<
  WithRelation,
  Depth extends TypeDepthPrev[number] = TypeDepthPrevMax,
> = WithRelation extends false
  ? never
  : WithRelation extends true
    ? never
    : WithRelation extends {}
      ? TypeUtilGetRelationEntityByType<
          WithRelation,
          TypeUtilGetRelationOptions<WithRelation>,
          Depth
        >
      : never;
