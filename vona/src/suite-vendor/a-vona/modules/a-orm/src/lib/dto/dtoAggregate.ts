import type { Constructable } from 'vona';

import { ensureArray } from '@cabloy/utils';
import { Api, v } from 'vona-module-a-openapiutils';
import z from 'zod';

import type { BeanModelMeta } from '../../bean/bean.model/bean.model_meta.ts';
import type { TypeDtoAggrResult } from '../../types/dto/dtoAggregate.ts';
import type { TypeModelSelectAggrParamsAggrs } from '../../types/modelAggr.ts';
import type { IModelClassRecord } from '../../types/onion/model.ts';
import type { TypeModelOfModelLike, TypeSymbolKeyEntity } from '../../types/relations.ts';

export function DtoAggregate<
  Aggrs extends TypeModelSelectAggrParamsAggrs<
    TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity]
  >,
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
>(
  modelLike: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
  aggrs: Aggrs,
): Constructable<TypeDtoAggrResult<Aggrs>> {
  return _DtoAggregate_raw(modelLike, aggrs);
}

function _DtoAggregate_raw<
  Aggrs extends TypeModelSelectAggrParamsAggrs<
    TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity]
  >,
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
>(
  modelLike: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
  aggrs: Aggrs,
): Constructable<TypeDtoAggrResult<Aggrs>> {
  abstract class TargetClass {}
  return _DtoAggregate_inner(TargetClass as any, modelLike, aggrs);
}

export function _DtoAggregate_inner<
  Aggrs extends TypeModelSelectAggrParamsAggrs<
    TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity]
  >,
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
>(
  classTarget: Constructable,
  _modelLike: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
  aggrs: Aggrs,
): Constructable<TypeDtoAggrResult<Aggrs>> {
  for (const key in aggrs) {
    const columns = ensureArray(aggrs[key]);
    if (!columns) continue;
    for (const column of columns) {
      const column2 = `${key}_${column === '*' ? 'all' : column}`;
      Api.field(v.optional(), z.string())(classTarget.prototype, column2);
    }
  }
  return classTarget as any;
}
