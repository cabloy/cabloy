import type { MetadataKey } from 'vona';

import { appMetadata } from 'vona';
import { SymbolUseOnionLocal, SymbolUseOnionOptions } from 'vona-module-a-onion';

export function UseOnionBase(
  sceneName: string,
  onionName: string,
  options?: any,
): ClassDecorator & MethodDecorator {
  return function (target: object, prop?: MetadataKey, descriptor?: PropertyDescriptor) {
    return UseOnionBaseDirect(sceneName, onionName, options, target, prop, descriptor);
  } as any;
}

export function UseOnionBaseDirect(
  sceneName: string,
  onionName: string,
  options: any,
  target: object,
  prop?: MetadataKey,
  descriptor?: PropertyDescriptor,
) {
  const onionsOptions = appMetadata.getOwnMetadataMap(false, SymbolUseOnionOptions, target, prop);
  const onionsLocal = appMetadata.getOwnMetadataMap<string, string[]>(
    false,
    SymbolUseOnionLocal,
    target,
    prop,
  );
  //
  const beanFullName = onionName.replace(':', `.${sceneName}.`);
  onionsOptions[beanFullName] = options;
  if (!onionsLocal[sceneName]) onionsLocal[sceneName] = [];
  onionsLocal[sceneName].push(onionName);
  return descriptor;
}
