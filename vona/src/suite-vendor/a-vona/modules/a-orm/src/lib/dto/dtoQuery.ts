import type { Constructable } from 'vona';

import { $Class } from 'vona';

import { DtoQueryBase } from '../../types/dto/dtoQueryBase.ts';

export function DtoQuery<T, K extends keyof T>(classRef: Constructable<T>, keys: K[]) {
  return $Class.mixin(DtoQueryBase, $Class.partial($Class.pick(classRef, keys)));
}
