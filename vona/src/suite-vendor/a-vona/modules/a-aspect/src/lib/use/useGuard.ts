import type { IGuardRecordLocal } from '../../types/guard.ts';

import { UseOnionBase } from './useOnionBase.ts';

export function UseGuard<T extends keyof IGuardRecordLocal>(
  guardName: T,
  options?: Partial<IGuardRecordLocal[T]>,
): ClassDecorator & MethodDecorator {
  return UseOnionBase('guard', guardName, options);
}
