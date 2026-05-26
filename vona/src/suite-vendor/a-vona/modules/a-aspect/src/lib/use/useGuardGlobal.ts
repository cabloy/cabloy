import type { MetadataKey } from 'vona';
import type { TypeUseOnionOmitOptionsGlobal } from 'vona-module-a-onion';

import { isNil } from '@cabloy/utils';
import { cast } from 'vona';
import { setPublic } from 'vona-module-a-openapiutils';

import type { IGuardRecordGlobal } from '../../types/guard.ts';

import { UseOnionGlobalBase } from './useOnionGlobalBase.ts';

export function UseGuardGlobal<T extends keyof IGuardRecordGlobal>(
  guardName: T,
  options?: Partial<TypeUseOnionOmitOptionsGlobal<IGuardRecordGlobal[T]>>,
  fn?: (
    target: object,
    prop?: MetadataKey,
    descriptor?: PropertyDescriptor,
  ) => PropertyDescriptor | undefined,
): ClassDecorator & MethodDecorator {
  return UseOnionGlobalBase('guard', guardName, options, (target, prop, descriptor) => {
    if (guardName === 'a-user:passport' && !isNil(cast(options)?.public)) {
      setPublic(target, prop, descriptor, cast(options)?.public);
    }
    if (!fn) return descriptor;
    return fn(target, prop, descriptor);
  });
}
