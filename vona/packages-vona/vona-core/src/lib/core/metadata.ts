import { isUndefined } from '@cabloy/utils';
import 'reflect-metadata';

export type MetadataKey = symbol | string;

export class AppMetadata {
  defineMetadata<V>(
    metadataKey: MetadataKey,
    metadataValue: V,
    target: object,
    prop?: MetadataKey,
  ) {
    if (isUndefined(prop)) {
      Reflect.defineMetadata(metadataKey, metadataValue, target);
    } else {
      Reflect.defineMetadata(metadataKey, metadataValue, target, prop);
    }
  }

  hasOwnMetadata(metadataKey: MetadataKey, target: object, prop?: MetadataKey): boolean {
    if (isUndefined(prop)) return Reflect.hasOwnMetadata(metadataKey, target);
    return Reflect.hasOwnMetadata(metadataKey, target, prop);
  }

  hasMetadata(metadataKey: MetadataKey, target: object, prop?: MetadataKey): boolean {
    if (isUndefined(prop)) return Reflect.hasMetadata(metadataKey, target);
    return Reflect.hasMetadata(metadataKey, target, prop);
  }

  getOwnMetadata<V>(metadataKey: MetadataKey, target: object, prop?: MetadataKey): V | undefined {
    if (isUndefined(prop)) return Reflect.getOwnMetadata(metadataKey, target);
    return Reflect.getOwnMetadata(metadataKey, target, prop);
  }

  getMetadata<V>(metadataKey: MetadataKey, target: object, prop?: MetadataKey): V | undefined {
    if (isUndefined(prop)) return Reflect.getMetadata(metadataKey, target);
    return Reflect.getMetadata(metadataKey, target, prop);
  }

  getOwnMetadataArray<Entry>(
    inherit: boolean,
    metadataKey: MetadataKey,
    target: object,
    prop?: MetadataKey,
  ): Array<Entry> {
    let own: Array<Entry> | undefined = this.getOwnMetadata(metadataKey, target, prop);
    if (!own) {
      if (!inherit) {
        own = [];
      } else {
        const parent: Array<Entry> | undefined = this.getMetadata(metadataKey, target, prop);
        if (parent) {
          own = parent.slice();
        } else {
          own = [];
        }
      }
      this.defineMetadata(metadataKey, own, target, prop);
    }
    return own;
  }

  getOwnMetadataMap<K extends PropertyKey, V>(
    inherit: boolean,
    metadataKey: MetadataKey,
    target: object,
    prop?: MetadataKey,
  ): Record<K, V> {
    let own: Record<K, V> | undefined = this.getOwnMetadata(metadataKey, target, prop);
    if (!own) {
      if (!inherit) {
        own = {} as Record<K, V>;
      } else {
        const parent: Record<K, V> | undefined = this.getMetadata(metadataKey, target, prop);
        if (parent) {
          own = Object.assign({}, parent);
        } else {
          own = {} as Record<K, V>;
        }
      }
      this.defineMetadata(metadataKey, own, target, prop);
    }
    return own;
  }

  getDesignType(target: object, prop?: MetadataKey) {
    return this.getMetadata('design:type', target, prop);
  }

  getDesignParamtypes(target: object, prop?: MetadataKey) {
    return this.getMetadata('design:paramtypes', target, prop);
  }

  getDesignReturntype(target: object, prop?: MetadataKey) {
    return this.getMetadata('design:returntype', target, prop);
  }
}

export const appMetadata = new AppMetadata();
