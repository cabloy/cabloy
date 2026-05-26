import { appMetadata } from '../../core/sys/metadata.ts';
import { SymbolDecoratorPreload } from '../../core/sys/resource.ts';

export function Preload(): ClassDecorator {
  return function (target) {
    // set metadata
    appMetadata.defineMetadata(SymbolDecoratorPreload, true, target);
  };
}
