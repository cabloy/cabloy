import type { Constructable } from 'vona';

import type { BeanModelMeta } from '../../bean/bean.model/bean.model_meta.ts';
import type { IDtoGetParams } from '../../types/dto/dtoGet.ts';
import type { TypeDtoSelectAndCountResult } from '../../types/dto/dtoSelectAndCount.ts';
import type { IModelClassRecord } from '../../types/onion/model.ts';

import { DtoGet } from './dtoGet.ts';
import { DtoListAndCount } from './dtoListAndCount.ts';

export function DtoSelectAndCount<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  T extends IDtoGetParams<ModelLike> | undefined = undefined,
>(
  modelLike: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
  params?: T,
): Constructable<TypeDtoSelectAndCountResult<ModelLike, T>> {
  const DtoGetResult = DtoGet(modelLike, params);
  return DtoListAndCount(DtoGetResult);
}
