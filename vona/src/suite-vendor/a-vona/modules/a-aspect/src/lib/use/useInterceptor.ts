import type { IInterceptorRecordLocal } from '../../types/interceptor.ts';

import { UseOnionBase } from './useOnionBase.ts';

export function UseInterceptor<T extends keyof IInterceptorRecordLocal>(
  interceptorName: T,
  options?: Partial<IInterceptorRecordLocal[T]>,
): ClassDecorator & MethodDecorator {
  return UseOnionBase('interceptor', interceptorName, options);
}
