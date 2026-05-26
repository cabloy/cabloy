import type { Constructable } from 'vona';

import { $Class } from 'vona';

import { DtoQueryPageBase } from '../../types/dto/dtoQueryPageBase.ts';

export function DtoQueryPage<T, KEYS extends Array<keyof T>>(
  classRef: Constructable<T>,
  keys: KEYS,
) {
  return $Class.mixin(DtoQueryPageBase, $Class.partial($Class.pick(classRef, keys)));
}
