import type { TypeConfirmArray, TypeRecordValues } from 'vona';

import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { IDecoratorModelOptions } from './onion/model.ts';
import type {
  TypeModelOfModelLike,
  TypeModelsClassLikeGeneral,
  TypeSymbolKeyEntity,
  TypeSymbolKeyEntityMeta,
  TypeUtilGetModelOnionName,
  TypeUtilGetModelOptions,
  TypeUtilGetRelationEntityMeta,
  TypeUtilGetRelationModel,
} from './relations.ts';

export type TypeEntityTableColumnNames<EntityMeta extends { $table: string } | undefined> =
  EntityMeta extends { $table: string }
    ? keyof {
        [K in keyof EntityMeta as K extends '$table' | '$comment' | '$default'
          ? never
          : K extends string
            ? `${EntityMeta['$table']}.${K}`
            : never]: EntityMeta[K];
      }
    : never;
export type TypeEntityTableColumnNamesShort<Entity> = keyof Entity;

export type TypeEntityTableColumns<
  Entity extends {} | undefined,
  EntityMeta extends { $table: string } | undefined,
> = Entity extends {}
  ? EntityMeta extends { $table: string }
    ? {
        [K in keyof Entity as K extends string ? `${EntityMeta['$table']}.${K}` : never]: Entity[K];
      }
    : {}
  : {};
export type TypeEntityTableColumnsShort<Entity> = Entity;

export type TypeEntityTableColumnsOfModelDirect<TModel extends BeanModelMeta | undefined> =
  TModel extends BeanModelMeta
    ? TypeEntityTableColumns<TModel[TypeSymbolKeyEntity], TModel[TypeSymbolKeyEntityMeta]>
    : {};

export type TypeEntityTableColumnNamesOfModels<A extends BeanModelMeta[]> =
  TypeEntityTableColumnNames<A[number][TypeSymbolKeyEntityMeta]>;

// export type TypeEntityTableColumnNamesOfModelOptions<TModelOptions extends IDecoratorModelOptions> = TypeEntityTableColumnNames<TypeRecordValues<{
//   [RelationName in keyof TModelOptions['relations']]: TypeUtilGetRelationEntityMeta<TModelOptions['relations'][RelationName]>;
// }>>;
export type TypeEntityTableColumnNamesOfModelOptions<TModelOptions extends IDecoratorModelOptions> =
  TModelOptions['relations'] extends {}
    ? TypeRecordValues<{
        [RelationName in keyof TModelOptions['relations']]: TypeEntityTableColumnNames<
          TypeUtilGetRelationEntityMeta<TModelOptions['relations'][RelationName]>
        >;
      }>
    : never;

export type TypeEntityTableColumnsOfModelOptions<TModelOptions extends IDecoratorModelOptions> =
  TModelOptions['relations'] extends {}
    ? TypeEntityTableColumnsOfModelDirect<
        TypeRecordModelValues<{
          [RelationName in keyof TModelOptions['relations']]: TypeUtilGetRelationModel<
            TModelOptions['relations'][RelationName]
          >;
        }>
      >
    : {};

export type TypeModelsOfModelOptions<TModelOptions extends IDecoratorModelOptions> =
  TModelOptions['relations'] extends {}
    ? TypeRecordModelValues<{
        [RelationName in keyof TModelOptions['relations']]: TypeUtilGetRelationModel<
          TModelOptions['relations'][RelationName]
        >;
      }>
    : never;

export type TypeModelOnionNamesOfModelOptions<TModelOptions extends IDecoratorModelOptions> =
  TModelOptions['relations'] extends {}
    ? TypeRecordValues<{
        [RelationName in keyof TModelOptions['relations']]: TypeUtilGetModelOnionName<
          TypeUtilGetRelationModel<TModelOptions['relations'][RelationName]>
        >;
      }>
    : undefined; // not use never

export type TypeRecordModelValues<TRecord extends Record<string, BeanModelMeta | undefined>> =
  TRecord[keyof TRecord];

export type TypeEntityTableColumnNamesOfModelClass<TModel extends BeanModelMeta> =
  TypeEntityTableColumnNamesOfModelOptions<TypeUtilGetModelOptions<TModel>>;

export type TypeEntityTableColumnsOfModelClass<TModel extends BeanModelMeta> =
  TypeEntityTableColumnsOfModelOptions<TypeUtilGetModelOptions<TModel>>;

export type TypeModelsOfModelClass<TModel extends BeanModelMeta> = TypeModelsOfModelOptions<
  TypeUtilGetModelOptions<TModel>
>;

export type TypeModelOnionNamesOfModelClass<TModel extends BeanModelMeta> =
  TypeModelOnionNamesOfModelOptions<TypeUtilGetModelOptions<TModel>>;

export type TypeEntityTableColumnNamesOfModelJoins<TModelJoins extends TypeModelsClassLikeGeneral> =
  TypeEntityTableColumnNames<
    TypeModelOfModelLike<TypeConfirmArray<TModelJoins>[number]>[TypeSymbolKeyEntityMeta]
  >;

export type TypeEntityTableColumnsOfModelJoins<TModelJoins extends TypeModelsClassLikeGeneral> =
  TypeEntityTableColumnsOfModelDirect<TypeModelOfModelLike<TypeConfirmArray<TModelJoins>[number]>>;

export type TypeEntityTableColumnNamesOfModelSelf<TModel extends BeanModelMeta> =
  | TypeEntityTableColumnNames<TModel[TypeSymbolKeyEntityMeta]>
  | TypeEntityTableColumnNamesShort<TModel[TypeSymbolKeyEntity]>;

export type TypeEntityTableColumnsOfModelSelf<TModel extends BeanModelMeta> =
  TypeEntityTableColumnsOfModelDirect<TModel> &
    TypeEntityTableColumnsShort<TModel[TypeSymbolKeyEntity]>;

export type TypeEntityTableColumnNamesOfGeneral<
  TModelJoins extends TypeModelsClassLikeGeneral | undefined,
  TModel extends BeanModelMeta | undefined,
> = TModel extends BeanModelMeta
  ? TModelJoins extends TypeModelsClassLikeGeneral
    ?
        | TypeEntityTableColumnNamesOfModelJoins<TModelJoins>
        | TypeEntityTableColumnNamesOfModelSelf<TModel>
    : TypeEntityTableColumnNamesOfModelClass<TModel> | TypeEntityTableColumnNamesOfModelSelf<TModel>
  : undefined;

export type TypeEntityTableColumnsOfGeneral<
  TModelJoins extends TypeModelsClassLikeGeneral | undefined,
  TModel extends BeanModelMeta | undefined,
> = TModel extends BeanModelMeta
  ? TModelJoins extends TypeModelsClassLikeGeneral
    ? TypeEntityTableColumnsOfModelJoins<TModelJoins> & TypeEntityTableColumnsOfModelSelf<TModel>
    : TypeEntityTableColumnsOfModelClass<TModel> & TypeEntityTableColumnsOfModelSelf<TModel>
  : undefined;
