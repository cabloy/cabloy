import type { TypeUseOnionOmitOptionsGlobal } from 'vona-module-a-onion';

import type { IFilterRecordGlobal } from '../../types/filter.ts';

import { UseOnionGlobalBase } from './useOnionGlobalBase.ts';

export function UseFilterGlobal<T extends keyof IFilterRecordGlobal>(
  filterName: T,
  options?: Partial<TypeUseOnionOmitOptionsGlobal<IFilterRecordGlobal[T]>>,
): ClassDecorator & MethodDecorator {
  return UseOnionGlobalBase('filter', filterName, options);
}
