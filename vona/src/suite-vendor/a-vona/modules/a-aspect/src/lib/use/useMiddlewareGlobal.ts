import type { TypeUseOnionOmitOptionsGlobal } from 'vona-module-a-onion';

import type { IMiddlewareRecordGlobal } from '../../types/middleware.ts';

import { UseOnionGlobalBase } from './useOnionGlobalBase.ts';

export function UseMiddlewareGlobal<T extends keyof IMiddlewareRecordGlobal>(
  middlewareName: T,
  options?: Partial<TypeUseOnionOmitOptionsGlobal<IMiddlewareRecordGlobal[T]>>,
): ClassDecorator & MethodDecorator {
  return UseOnionGlobalBase('middleware', middlewareName, options);
}
