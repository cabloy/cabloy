import { appMetadata } from '../../core/sys/metadata.ts';
import { SymbolDecoratorProxyDisable } from '../../core/sys/resource.ts';

export function ProxyDisable(): ClassDecorator {
  return function (target) {
    // set metadata
    appMetadata.defineMetadata(SymbolDecoratorProxyDisable, true, target);
  };
}
