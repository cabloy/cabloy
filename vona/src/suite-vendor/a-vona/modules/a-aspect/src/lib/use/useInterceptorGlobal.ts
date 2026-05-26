import type { TypeUseOnionOmitOptionsGlobal } from 'vona-module-a-onion';

import type { IInterceptorRecordGlobal } from '../../types/interceptor.ts';

import { UseOnionGlobalBase } from './useOnionGlobalBase.ts';

export function UseInterceptorGlobal<T extends keyof IInterceptorRecordGlobal>(
  interceptorName: T,
  options?: Partial<TypeUseOnionOmitOptionsGlobal<IInterceptorRecordGlobal[T]>>,
): ClassDecorator & MethodDecorator {
  return UseOnionGlobalBase('interceptor', interceptorName, options);
}
