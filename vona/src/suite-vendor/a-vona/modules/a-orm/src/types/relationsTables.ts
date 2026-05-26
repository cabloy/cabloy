import type { TypeConfirmArray, TypeRecordValues } from 'vona';

import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { IDecoratorModelOptions } from './onion/model.ts';
import type {
  TypeModelOfModelLike,
  TypeModelsClassLikeGeneral,
  TypeSymbolKeyEntityMeta,
  TypeUtilGetModelOptions,
  TypeUtilGetRelationEntityMeta,
} from './relations.ts';

export type TypeEntityTableNames<EntityMeta extends { $table: string } | undefined> =
  EntityMeta extends { $table: infer TableName } ? TableName : never;

export type TypeEntityTableNamesOfModelOptions<TModelOptions extends IDecoratorModelOptions> =
  TModelOptions['relations'] extends {}
    ? TypeRecordValues<{
        [RelationName in keyof TModelOptions['relations']]: TypeEntityTableNames<
          TypeUtilGetRelationEntityMeta<TModelOptions['relations'][RelationName]>
        >;
      }>
    : never;

export type TypeEntityTableNamesOfModelJoins<TModelJoins extends TypeModelsClassLikeGeneral> =
  TypeEntityTableNames<
    TypeModelOfModelLike<TypeConfirmArray<TModelJoins>[number]>[TypeSymbolKeyEntityMeta]
  >;

export type TypeEntityTableNamesOfModelClass<TModel extends BeanModelMeta> =
  TypeEntityTableNamesOfModelOptions<TypeUtilGetModelOptions<TModel>>;

export type TypeEntityTableNamesOfGeneral<
  TModelJoins extends TypeModelsClassLikeGeneral | undefined,
  TModel extends BeanModelMeta | undefined,
> = TModel extends BeanModelMeta
  ? TModelJoins extends TypeModelsClassLikeGeneral
    ? TypeEntityTableNamesOfModelJoins<TModelJoins>
    : TypeEntityTableNamesOfModelClass<TModel>
  : undefined;
