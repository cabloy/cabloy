import { appMetadata } from '../../core/metadata.ts';
import { SymbolDecoratorGlobal } from '../../core/resource.ts';

export function Global(): ClassDecorator {
  return function (target) {
    // set metadata
    appMetadata.defineMetadata(SymbolDecoratorGlobal, true, target);
  };
}
