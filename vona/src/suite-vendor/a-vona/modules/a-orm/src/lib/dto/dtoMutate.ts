import type { Constructable } from 'vona';

import { mutate } from 'mutate-on-copy';
import { $Class } from 'vona';

import type { BeanModelMeta } from '../../bean/bean.model/bean.model_meta.ts';
import type {
  IDtoMutateParams,
  TypeDtoMutateResult,
  TypeDtoMutateType,
} from '../../types/dto/dtoMutate.ts';
import type { TypeModelColumnsStrict } from '../../types/modelWhere.ts';
import type { IModelClassRecord } from '../../types/onion/model.ts';
import type { TypeModelOfModelLike, TypeSymbolKeyEntity } from '../../types/relations.ts';
import type { IRelationItem } from '../../types/relationsDef.ts';

import {
  getClassEntityFromClassModel,
  prepareClassModel,
  prepareColumns,
} from '../../common/utils.ts';
import { _DtoGet_relations } from './dtoGet.ts';

export function DtoMutate<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  T extends IDtoMutateParams<ModelLike> | undefined = undefined,
>(
  modelLike: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
  params?: T,
): Constructable<TypeDtoMutateResult<ModelLike, T, 'mutate', undefined, true>> {
  return _DtoMutate_raw(modelLike, params, 'mutate', undefined, true, undefined);
}

export function _DtoMutate_raw<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  T extends IDtoMutateParams<ModelLike> | undefined = undefined,
  ColumnsOmitDefault extends
    | TypeModelColumnsStrict<TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity]>
    | undefined = undefined,
>(
  modelLike: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
  params?: T,
  mutateTypeTopLevel?: TypeDtoMutateType,
  columnsOmitDefault?: ColumnsOmitDefault,
  topLevel?: boolean,
  relation?: IRelationItem,
) {
  // model
  const modelClass = prepareClassModel(modelLike);
  // entity
  let entityClass = getClassEntityFromClassModel(modelClass);
  // columns
  let columns = prepareColumns(params?.columns);
  if (columns) {
    if (!topLevel) {
      if (mutateTypeTopLevel === 'create') {
        for (const key of ['deleted', 'id']) {
          const index = columns.indexOf(key as any);
          if (index > -1) {
            columns = mutate(columns, copyState => {
              copyState.splice(index, 1);
            });
          }
        }
      } else {
        for (const key of ['deleted', 'id']) {
          if (!columns.includes(key as any)) {
            columns = mutate(columns, copyState => {
              copyState.unshift(key as any);
            });
          }
        }
      }
    }
    entityClass = $Class.pick(entityClass, columns);
  } else {
    const columns =
      columnsOmitDefault ??
      (mutateTypeTopLevel === 'create'
        ? ['id', 'iid', 'deleted', 'createdAt', 'updatedAt']
        : ['iid', 'createdAt', 'updatedAt']);
    entityClass = $Class.omit(entityClass, prepareColumns(columns as any) as any);
  }
  if (!topLevel && mutateTypeTopLevel !== 'create') {
    entityClass = $Class.partial(entityClass, ['id', 'deleted'] as any);
  }
  if (!topLevel && relation) {
    const [_relationName, relationReal] = relation;
    const { type, key } = relationReal;
    if (type === 'hasOne' || type === 'hasMany') {
      entityClass = $Class.omit(entityClass, key);
    }
  }
  // relations
  _DtoGet_relations(modelClass, entityClass, params as any, mutateTypeTopLevel);
  return entityClass as any;
}
