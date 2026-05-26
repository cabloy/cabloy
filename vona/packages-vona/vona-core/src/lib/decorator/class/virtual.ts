import { appMetadata } from '../../core/metadata.ts';
import { SymbolDecoratorVirtual } from '../../core/resource.ts';

export function Virtual(): ClassDecorator {
  return function (target) {
    // set metadata
    appMetadata.defineMetadata(SymbolDecoratorVirtual, true, target);
  };
}
