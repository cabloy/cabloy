import type { MetadataKey } from '../../core/sys/metadata.ts';
import type { IDecoratorVueElement, TypeDecoratorVue } from './types.ts';

import { appMetadata } from '../../core/sys/metadata.ts';
import { SymbolDecoratorVueElements } from './types.ts';

export function createVueDecorator<OPTIONS>(
  type: TypeDecoratorVue,
  options?: OPTIONS,
): PropertyDecorator & MethodDecorator {
  return function (target: object, prop: MetadataKey, descriptor?: PropertyDescriptor) {
    const vues = appMetadata.getOwnMetadataMap<MetadataKey, IDecoratorVueElement<OPTIONS>[]>(
      true,
      SymbolDecoratorVueElements,
      target,
    );
    if (!vues[prop]) vues[prop] = [];
    vues[prop].push({
      type,
      descriptor: descriptor!,
      options,
    });
  };
}
