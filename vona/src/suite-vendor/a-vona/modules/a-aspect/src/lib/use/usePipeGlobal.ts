import type { TypeUseOnionOmitOptionsGlobal } from 'vona-module-a-onion';

import type { IPipeRecordGlobal } from '../../types/pipe.ts';

import { UseOnionGlobalBase } from './useOnionGlobalBase.ts';

export function UsePipeGlobal<T extends keyof IPipeRecordGlobal>(
  pipeName: T,
  options?: Partial<TypeUseOnionOmitOptionsGlobal<IPipeRecordGlobal[T]>>,
): ClassDecorator & MethodDecorator {
  return UseOnionGlobalBase('pipe', pipeName, options);
}
