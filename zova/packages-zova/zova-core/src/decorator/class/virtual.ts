import { appMetadata } from '../../core/sys/metadata.ts';
import { SymbolDecoratorVirtual } from '../../core/sys/resource.ts';

export function Virtual(): ClassDecorator {
  return function (target) {
    // set metadata
    appMetadata.defineMetadata(SymbolDecoratorVirtual, true, target);
  };
}
