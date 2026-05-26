import type { Constructable } from 'vona';

import { ensureArray } from '@cabloy/utils';
import { PickClassInner } from 'vona';

import type { BeanModelMeta } from '../../bean/bean.model/bean.model_meta.ts';
import type { TypeDtoGroupResult } from '../../types/dto/dtoGroup.ts';
import type { TypeModelSelectAggrParamsAggrs } from '../../types/modelAggr.ts';
import type { TypeModelColumnsStrict } from '../../types/modelWhere.ts';
import type { IModelClassRecord } from '../../types/onion/model.ts';
import type { TypeModelOfModelLike, TypeSymbolKeyEntity } from '../../types/relations.ts';

import { getClassEntityFromClassModel, prepareClassModel } from '../../common/utils.ts';
import { _DtoAggregate_inner } from './dtoAggregate.ts';

export function DtoGroup<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  Groups extends TypeModelColumnsStrict<TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity]>,
  Aggrs extends
    | TypeModelSelectAggrParamsAggrs<TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity]>
    | undefined = undefined,
  Columns extends
    | TypeModelColumnsStrict<TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity]>
    | undefined = undefined,
>(
  modelLike: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
  groups: Groups,
  aggrs?: Aggrs,
  columns?: Columns,
): Constructable<
  TypeDtoGroupResult<TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity], Aggrs, Groups, Columns>
> {
  return _DtoGroup_raw(modelLike, groups, aggrs, columns);
}

function _DtoGroup_raw<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  Groups extends TypeModelColumnsStrict<TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity]>,
  Aggrs extends
    | TypeModelSelectAggrParamsAggrs<TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity]>
    | undefined = undefined,
  Columns extends
    | TypeModelColumnsStrict<TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity]>
    | undefined = undefined,
>(
  modelLike: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
  groups: Groups,
  aggrs?: Aggrs,
  columns?: Columns,
): Constructable<
  TypeDtoGroupResult<TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity], Aggrs, Groups, Columns>
> {
  abstract class TargetClass {}
  // model
  const modelClass = prepareClassModel(modelLike);
  // entity
  const entityClass = getClassEntityFromClassModel(modelClass);
  // columns/groups
  const displays = ensureArray(columns ?? groups);
  if (displays) {
    PickClassInner(TargetClass as any, entityClass, displays as any);
  }
  // aggrs
  if (aggrs) {
    _DtoAggregate_inner(TargetClass as any, modelLike, aggrs);
  }
  // ok
  return TargetClass as any;
}
