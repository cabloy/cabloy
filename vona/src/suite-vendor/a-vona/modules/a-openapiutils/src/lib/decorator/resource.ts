import { appMetadata } from 'vona';

import { SymbolControllerResource } from '../const/decorator.ts';

export function Resource(): ClassDecorator {
  return function (target: object) {
    // controller resource
    appMetadata.defineMetadata(SymbolControllerResource, true, target);
  };
}
