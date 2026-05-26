import type { IFilterRecordLocal } from '../../types/filter.ts';

import { UseOnionBase } from './useOnionBase.ts';

export function UseFilter<T extends keyof IFilterRecordLocal>(
  filterName: T,
  options?: Partial<IFilterRecordLocal[T]>,
): ClassDecorator & MethodDecorator {
  return UseOnionBase('filter', filterName, options);
}
