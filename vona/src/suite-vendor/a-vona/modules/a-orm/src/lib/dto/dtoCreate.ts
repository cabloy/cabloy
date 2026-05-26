import type { Constructable } from 'vona';

import type { BeanModelMeta } from '../../bean/bean.model/bean.model_meta.ts';
import type { IDtoMutateParams, TypeDtoMutateResult } from '../../types/dto/dtoMutate.ts';
import type { IModelClassRecord } from '../../types/onion/model.ts';

import { _DtoMutate_raw } from './dtoMutate.ts';

export function DtoCreate<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  T extends IDtoMutateParams<ModelLike> | undefined = undefined,
>(
  modelLike: ModelLike extends BeanModelMeta
    ? (() => Constructable<ModelLike>) | Constructable<ModelLike>
    : ModelLike,
  params?: T,
): Constructable<
  TypeDtoMutateResult<
    ModelLike,
    T,
    'create',
    'id' | 'iid' | 'deleted' | 'createdAt' | 'updatedAt',
    true
  >
> {
  return _DtoMutate_raw(
    modelLike,
    params,
    'create',
    ['id', 'iid', 'deleted', 'createdAt', 'updatedAt'] as any,
    true,
    undefined,
  );
}
