import { appMetadata } from '../../core/metadata.ts';
import { SymbolDecoratorProxyDisable } from '../../core/resource.ts';

export function ProxyDisable(): ClassDecorator {
  return function (target) {
    // set metadata
    appMetadata.defineMetadata(SymbolDecoratorProxyDisable, true, target);
  };
}
