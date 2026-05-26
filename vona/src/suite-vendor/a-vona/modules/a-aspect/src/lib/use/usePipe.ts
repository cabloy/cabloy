import type { IPipeRecordLocal } from '../../types/pipe.ts';

import { UseOnionBase } from './useOnionBase.ts';

export function UsePipe<T extends keyof IPipeRecordLocal>(
  pipeName: T,
  options?: Partial<IPipeRecordLocal[T]>,
): ClassDecorator & MethodDecorator {
  return UseOnionBase('pipe', pipeName, options);
}
