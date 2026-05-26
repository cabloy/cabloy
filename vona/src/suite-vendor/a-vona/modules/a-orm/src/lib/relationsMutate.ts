import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { IModelClassRecord } from '../types/onion/model.ts';
import type {
  TypeModelClassLike,
  TypeModelOfModelLike,
  TypeSymbolKeyEntity,
} from '../types/relations.ts';
import type {
  IModelRelationBelongsToManyDynamic,
  IModelRelationHasManyDynamic,
  IModelRelationHasOneDynamic,
} from '../types/relationsDefDynamic.ts';
import type {
  IModelRelationOptionsBelongsToManyMutate,
  IModelRelationOptionsManyMutate,
  IModelRelationOptionsOneMutate,
} from '../types/relationsDefMutate.ts';

function hasOne<
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  KEY extends keyof TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity],
  OPTIONS extends IModelRelationOptionsOneMutate<TypeModelOfModelLike<MODEL>>,
>(
  classModel: TypeModelClassLike<MODEL>,
  key: KEY,
  options?: OPTIONS,
): IModelRelationHasOneDynamic<MODEL, KEY, OPTIONS> {
  return { type: 'hasOne', model: classModel, key, options };
}

// function belongsTo<
//   MODELSelf extends BeanModelMeta | (keyof IModelClassRecord),
//   MODEL extends BeanModelMeta | (keyof IModelClassRecord),
//   OPTIONS extends IModelRelationOptionsOneMutate<TypeModelOfModelLike<MODEL>>,
// >(
//   _classModelSelf: TypeModelClassLike<MODELSelf>,
//   classModel: TypeModelClassLike<MODEL>,
//   key: keyof TypeModelOfModelLike<MODELSelf>[TypeSymbolKeyEntity],
//   options?: OPTIONS,
// ): IModelRelationBelongsToDynamic<MODELSelf, MODEL, OPTIONS> {
//   return { type: 'belongsTo', model: classModel, key, options };
// }

function hasMany<
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  KEY extends keyof TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity],
  // not use `| undefined = undefined` or `= {}`
  OPTIONS extends IModelRelationOptionsManyMutate<TypeModelOfModelLike<MODEL>>,
>(
  classModel: TypeModelClassLike<MODEL>,
  key: KEY,
  options?: OPTIONS,
): IModelRelationHasManyDynamic<MODEL, KEY, OPTIONS> {
  return { type: 'hasMany', model: classModel, key, options };
}

function belongsToMany<
  MODELMiddle extends BeanModelMeta | keyof IModelClassRecord,
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  OPTIONS extends IModelRelationOptionsBelongsToManyMutate<TypeModelOfModelLike<MODEL>>,
>(
  classModelMiddle: TypeModelClassLike<MODELMiddle>,
  classModel: TypeModelClassLike<MODEL>,
  keyFrom: keyof TypeModelOfModelLike<MODELMiddle>[TypeSymbolKeyEntity],
  keyTo: keyof TypeModelOfModelLike<MODELMiddle>[TypeSymbolKeyEntity],
  options?: OPTIONS,
): IModelRelationBelongsToManyDynamic<MODELMiddle, MODEL, OPTIONS> {
  return {
    type: 'belongsToMany',
    modelMiddle: classModelMiddle,
    model: classModel,
    keyFrom,
    keyTo,
    options,
  };
}

export const $relationMutate = {
  hasOne,
  // belongsTo,
  hasMany,
  belongsToMany,
};
