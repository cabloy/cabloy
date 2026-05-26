import type { IMiddlewareRecordLocal } from '../../types/middleware.ts';

import { UseOnionBase } from './useOnionBase.ts';

export function UseMiddleware<T extends keyof IMiddlewareRecordLocal>(
  middlewareName: T,
  options?: Partial<IMiddlewareRecordLocal[T]>,
): ClassDecorator & MethodDecorator {
  return UseOnionBase('middleware', middlewareName, options);
}
