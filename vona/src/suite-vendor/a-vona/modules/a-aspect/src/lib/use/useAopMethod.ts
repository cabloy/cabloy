import type { MetadataKey } from 'vona';

import { appMetadata, registerMappedClassMetadataKey } from 'vona';

import type { IAopMethodRecord, IUseAopMethodPropMetadata } from '../../types/aopMethod.ts';

import { SymbolDecoratorUseAopMethod } from '../../types/aopMethod.ts';

export function UseAopMethod<T extends keyof IAopMethodRecord>(
  aopMethodName: T,
  options?: Partial<IAopMethodRecord[T]>,
): PropertyDescriptor & MethodDecorator {
  return function (target: object, prop: MetadataKey, descriptor?: PropertyDescriptor) {
    registerMappedClassMetadataKey(target, SymbolDecoratorUseAopMethod);
    const uses = appMetadata.getOwnMetadataMap<MetadataKey, IUseAopMethodPropMetadata<T>[]>(
      true,
      SymbolDecoratorUseAopMethod,
      target,
    );
    if (!uses[prop]) uses[prop] = [];
    uses[prop].push({ onionName: aopMethodName, options });
    return descriptor;
  } as any;
}
