import type { TableIdentity } from 'table-identity';
import type { OmitNever } from 'vona';

import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { IDecoratorModelOptions } from './onion/model.ts';
import type {
  TypeUtilGetModelOptions,
  TypeUtilGetParamsInlcude,
  TypeUtilGetParamsWith,
  TypeUtilGetRelationEntity,
  TypeUtilGetRelationModel,
  TypeUtilGetRelationOptions,
  TypeUtilGetRelationOptionsAutoload,
  TypeUtilGetRelationType,
} from './relations.ts';
import type { IModelRelationOptionsMetaWrapper } from './relationsDef.ts';

export type TypeModelMutateParamsInclude<MODEL extends BeanModelMeta | undefined> =
  TypeModelMutateParamsIncludeByModelOptions<TypeUtilGetModelOptions<MODEL>>;

export type TypeModelMutateParamsIncludeByModelOptions<
  ModelOptions extends IDecoratorModelOptions | undefined,
> = ModelOptions extends IDecoratorModelOptions
  ? {
      [relationName in keyof ModelOptions['relations']]?: TypeModelMutateParamsRelationOptions<
        ModelOptions['relations'][relationName]
      >;
    }
  : never;

export type TypeModelMutateParamsRelationOptions<Relation> =
  | boolean
  | (IModelRelationOptionsMetaWrapper & {
      include?: TypeModelMutateParamsInclude<TypeUtilGetRelationModel<Relation>>;
      with?: Record<string, unknown>;
    });

export type TypeModelMutateRelationResultMergeInclude<
  TModelOptions extends IDecoratorModelOptions,
  TInclude extends {} | undefined | unknown,
  TForInsertResult extends boolean | undefined = undefined,
> = {
  [RelationName in keyof TModelOptions['relations']]: TInclude extends {} // not use ?: for OmitNever take effect
    ? TInclude[RelationName] extends {} | boolean
      ? TypeModelMutateRelationResultMergeIncludeWrapper<
          TModelOptions['relations'][RelationName],
          TInclude[RelationName],
          TForInsertResult
        >
      : TypeModelMutateRelationResultMergeAutoload<
          TModelOptions['relations'][RelationName],
          TForInsertResult
        >
    : TypeModelMutateRelationResultMergeAutoload<
        TModelOptions['relations'][RelationName],
        TForInsertResult
      >;
};

export type TypeModelMutateRelationResultMergeAutoload<
  Relation,
  TForInsertResult extends boolean | undefined = undefined,
> =
  TypeUtilGetRelationOptionsAutoload<Relation> extends true
    ? TypeUtilMutateGetRelationEntityByType<Relation, undefined, TForInsertResult>
    : never;

export type TypeModelMutateRelationResultMergeIncludeWrapper<
  Relation,
  IncludeWrapper,
  TForInsertResult extends boolean | undefined = undefined,
> = IncludeWrapper extends false
  ? never
  : IncludeWrapper extends true
    ? TypeUtilMutateGetRelationEntityByType<Relation, undefined, TForInsertResult>
    : IncludeWrapper extends {}
      ? TypeUtilMutateGetRelationEntityByType<Relation, IncludeWrapper, TForInsertResult>
      : never;

export type TypeUtilMutateGetRelationEntityByType<
  Relation,
  IncludeWrapper extends {} | undefined | unknown,
  TForInsertResult extends boolean | undefined = undefined,
> = TypeUtilMutateGetEntityByType<
  TypeUtilGetRelationEntity<Relation>,
  TypeUtilGetRelationType<Relation>,
  TypeUtilGetRelationModel<Relation>,
  IncludeWrapper,
  TForInsertResult
>;

export type TypeUtilMutateGetEntityByType<
  TRecord,
  TYPE,
  TModel extends BeanModelMeta | undefined,
  IncludeWrapper extends {} | undefined | unknown,
  TForInsertResult extends boolean | undefined = undefined,
> = TYPE extends 'belongsTo'
  ? never
  : TYPE extends 'belongsToMany'
    ? Array<{ id: TableIdentity; deleted?: boolean }> | undefined
    : TYPE extends 'hasMany'
      ?
          | Array<TypeModelMutateRelationData<TRecord, TModel, IncludeWrapper, TForInsertResult>>
          | undefined
      : TypeModelMutateRelationData<TRecord, TModel, IncludeWrapper, TForInsertResult> | undefined;

export type TypeModelMutateRelationResultMergeWith<
  TWith extends {} | undefined | unknown,
  TForInsertResult extends boolean | undefined = undefined,
> = TWith extends {}
  ? {
      [RelationName in keyof TWith]: TypeModelMutateRelationResultMergeWithRelation<
        TWith[RelationName],
        TForInsertResult
      >;
    }
  : {};

export type TypeModelMutateRelationResultMergeWithRelation<
  WithRelation,
  TForInsertResult extends boolean | undefined = undefined,
> = WithRelation extends false
  ? never
  : WithRelation extends true
    ? never
    : WithRelation extends {}
      ? TypeUtilMutateGetRelationEntityByType<
          WithRelation,
          TypeUtilGetRelationOptions<WithRelation>,
          TForInsertResult
        >
      : never;

export type TypeModelMutateRelationData<
  TRecord,
  TModel extends BeanModelMeta | undefined,
  TOptionsRelation,
  TForInsertResult extends boolean | undefined = undefined,
> = (TForInsertResult extends true ? TRecord : Partial<TRecord>) &
  (TModel extends BeanModelMeta
    ? Partial<
        OmitNever<
          TypeModelMutateRelationResultMergeInclude<
            TypeUtilGetModelOptions<TModel>,
            TypeUtilGetParamsInlcude<TOptionsRelation>,
            TForInsertResult
          >
        >
      > &
        Partial<
          OmitNever<
            TypeModelMutateRelationResultMergeWith<
              TypeUtilGetParamsWith<TOptionsRelation>,
              TForInsertResult
            >
          >
        >
    : {});
