import type { MetadataKey } from '../core/metadata.ts';
import type { Constructable } from '../decorator/index.ts';
import type { IMappedClassMetadataOptions, MappedClassMetadataKeys } from './type.ts';

import { appMetadata } from '../core/metadata.ts';
import { SymbolMappedClassMetadataKeys } from './type.ts';

export function registerMappedClassMetadataKey(
  target: object,
  metadataKey: MetadataKey,
  options?: IMappedClassMetadataOptions,
) {
  const metadataKeys = appMetadata.getOwnMetadataMap<
    MetadataKey,
    IMappedClassMetadataOptions | undefined
  >(true, SymbolMappedClassMetadataKeys, target);
  if (!Object.hasOwn(metadataKeys, metadataKey)) {
    metadataKeys[metadataKey] = options;
  }
}

export function getMappedClassMetadataKeys(target: object): MappedClassMetadataKeys | undefined {
  return appMetadata.getMetadata<MappedClassMetadataKeys>(SymbolMappedClassMetadataKeys, target);
}

export function setMappedClassMetadataKeys(target: object, metadataKeys?: MappedClassMetadataKeys) {
  return appMetadata.defineMetadata(SymbolMappedClassMetadataKeys, metadataKeys, target);
}

export function copyPropertiesOfClasses(
  target: Constructable,
  sources: Constructable[],
  filter?: Function,
) {
  for (const source of sources) {
    copyProperties(target, source, ['constructor', 'prototype', 'length', 'name'], filter); // copy static
    copyProperties(target.prototype, source.prototype, ['constructor', 'prototype'], filter); // copy prototype
  }
}

export function copyProperties(
  target: object,
  source: object,
  keysIgnore: MetadataKey[],
  filter?: Function,
) {
  const protos: object[] = [];
  let _proto = source;
  while (_proto) {
    if (!['Object'].includes(_proto.constructor?.name) && !Object.hasOwn(_proto, 'arguments')) {
      protos.unshift(_proto);
    }
    _proto = Object.getPrototypeOf(_proto);
  }
  for (const proto of protos) {
    for (const key of Reflect.ownKeys(proto)) {
      if (keysIgnore.includes(key)) continue;
      if (filter && !filter(key)) continue;
      // desc
      const desc = Object.getOwnPropertyDescriptor(proto, key)!;
      Object.defineProperty(target, key, desc);
      // metadata
      const metaKeys = Reflect.getOwnMetadataKeys(proto, key);
      for (const metaKey of metaKeys) {
        const metaValue = Reflect.getOwnMetadata(metaKey, proto, key);
        Reflect.defineMetadata(metaKey, metaValue, target, key);
      }
    }
  }
}

export function copyMetadataOfClasses(target: object, sources: object[], transform?: Function) {
  //
  const metadataKeys = {};
  for (const source of sources) {
    const _metadataKeys = getMappedClassMetadataKeys(source);
    if (_metadataKeys) {
      Object.assign(metadataKeys, _metadataKeys);
    }
  }
  setMappedClassMetadataKeys(target, metadataKeys);
  //
  for (const metadataKey of Object.getOwnPropertySymbols(metadataKeys)) {
    const metadataKeyOptions = metadataKeys[metadataKey];
    const rulesNew = {};
    for (const source of sources) {
      const rules = appMetadata.getMetadata(metadataKey, source);
      if (!rules) continue;
      if (!transform) {
        Object.assign(rulesNew, rules);
      } else {
        for (const key in rules) {
          const ruleNew = transform(rules, key, metadataKeyOptions);
          if (ruleNew !== undefined) {
            rulesNew[key] = ruleNew;
          }
        }
      }
    }
    appMetadata.defineMetadata(metadataKey, rulesNew, target);
  }
}
