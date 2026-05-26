import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { IModelClassRecord } from '../types/onion/model.ts';
import type {
  TypeModelClassLike,
  TypeModelOfModelLike,
  TypeModelsClassLikeGeneral,
  TypeSymbolKeyEntity,
} from '../types/relations.ts';
import type {
  IModelRelationOptionsManyStatic,
  IModelRelationOptionsOneStatic,
} from './relationsStatic.ts';

function hasOne<
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  OPTIONS extends IModelRelationOptionsOneStatic<TypeModelOfModelLike<MODEL>>,
>(
  classModel: TypeModelClassLike<MODEL>,
  key: keyof TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity],
  options?: OPTIONS,
): any {
  // :  IModelRelationHasOne<MODEL, AUTOLOAD, COLUMNS> {
  return { type: 'hasOne', model: classModel, key, options };
}

function belongsTo<
  MODELSelf extends BeanModelMeta | keyof IModelClassRecord,
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  OPTIONS extends IModelRelationOptionsOneStatic<TypeModelOfModelLike<MODEL>>,
>(
  _classModelSelf: TypeModelClassLike<MODELSelf>,
  classModel: TypeModelClassLike<MODEL>,
  key: keyof TypeModelOfModelLike<MODELSelf>[TypeSymbolKeyEntity],
  options?: OPTIONS,
): any {
  // : IModelRelationBelongsTo<MODELSelf, MODEL, AUTOLOAD, COLUMNS> {
  return { type: 'belongsTo', model: classModel, key, options };
}

function hasMany<
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  OPTIONS extends IModelRelationOptionsManyStatic<TypeModelOfModelLike<MODEL>, ModelJoins, Group>,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
  Group extends boolean | undefined = undefined,
>(
  classModel: TypeModelClassLike<MODEL>,
  key: keyof TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity],
  options?: OPTIONS,
  _modelJoins?: ModelJoins,
  _group?: Group,
): any {
  // : IModelRelationHasMany<MODEL, AUTOLOAD, COLUMNS, ModelJoins> {
  return { type: 'hasMany', model: classModel, key, options };
}

function belongsToMany<
  MODELMiddle extends BeanModelMeta | keyof IModelClassRecord,
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  OPTIONS extends IModelRelationOptionsManyStatic<TypeModelOfModelLike<MODEL>, ModelJoins, Group>,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
  Group extends boolean | undefined = undefined,
>(
  classModelMiddle: TypeModelClassLike<MODELMiddle>,
  classModel: TypeModelClassLike<MODEL>,
  keyFrom: keyof TypeModelOfModelLike<MODELMiddle>[TypeSymbolKeyEntity],
  keyTo: keyof TypeModelOfModelLike<MODELMiddle>[TypeSymbolKeyEntity],
  options?: OPTIONS,
  _modelJoins?: ModelJoins,
  _group?: Group,
): any {
  // : IModelRelationBelongsToMany<MODELMiddle, MODEL, AUTOLOAD, COLUMNS, ModelJoins> {
  return {
    type: 'belongsToMany',
    modelMiddle: classModelMiddle,
    model: classModel,
    keyFrom,
    keyTo,
    options,
  };
}

export const $relation = {
  hasOne,
  belongsTo,
  hasMany,
  belongsToMany,
};

// function hasMany<
//   MODEL extends BeanModelMeta | (keyof IModelClassRecord),
//   AUTOLOAD extends boolean = boolean,
//   COLUMNS
//   extends TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]> = TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>,
//   ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
//   Aggrs extends TypeModelSelectAggrParamsAggrs<
//     TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]
//   > | undefined = undefined, // TypeModelSelectAggrParamsAggrs<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>,
//   Groups extends TypeModelColumnsStrict<
//     TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]
//   > | undefined = undefined, // TypeModelColumnsStrict<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>,
// >(
//   classModel: TypeModelClassLike<MODEL>,
//   key: keyof TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity],
//   options?: IModelRelationOptionsMany<TypeModelOfModelLike<MODEL>, AUTOLOAD, COLUMNS, ModelJoins, Aggrs, Groups>,
//   _modelJoins?: ModelJoins,
//   _aggrs?: Aggrs,
//   _groups?: Groups,
// ): any { // : IModelRelationHasMany<MODEL, AUTOLOAD, COLUMNS, ModelJoins> {
//   return { type: 'hasMany', model: classModel, key, options };
// }

// function belongsToMany<
//   MODELMiddle extends BeanModelMeta | (keyof IModelClassRecord),
//   MODEL extends BeanModelMeta | (keyof IModelClassRecord),
//   AUTOLOAD extends boolean = boolean,
//   COLUMNS
//   extends TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]> = TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>,
//   ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
//   Aggrs extends TypeModelSelectAggrParamsAggrs<
//     TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]
//   > | undefined = undefined, // TypeModelSelectAggrParamsAggrs<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>,
//   Groups extends TypeModelColumnsStrict<
//     TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]
//   > | undefined = undefined, // TypeModelColumnsStrict<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>,
// >(
//   classModelMiddle: TypeModelClassLike<MODELMiddle>,
//   classModel: TypeModelClassLike<MODEL>,
//   keyFrom: keyof TypeModelOfModelLike<MODELMiddle>[TypeSymbolKeyEntity],
//   keyTo: keyof TypeModelOfModelLike<MODELMiddle>[TypeSymbolKeyEntity],
//   options?: IModelRelationOptionsMany<TypeModelOfModelLike<MODEL>, AUTOLOAD, COLUMNS, ModelJoins, Aggrs, Groups>,
//   _modelJoins?: ModelJoins,
//   _aggrs?: Aggrs,
//   _groups?: Groups,
// ): any { // : IModelRelationBelongsToMany<MODELMiddle, MODEL, AUTOLOAD, COLUMNS, ModelJoins> {
//   return { type: 'belongsToMany', modelMiddle: classModelMiddle, model: classModel, keyFrom, keyTo, options };
// }
