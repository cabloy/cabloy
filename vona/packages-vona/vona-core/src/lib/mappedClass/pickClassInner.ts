import type { Constructable } from '../decorator/type/constructable.ts';

import { copyMetadataOfClasses, copyPropertiesOfClasses } from './utils.ts';

export type TypePickClass<
  T,
  KEYS extends Array<keyof T> | undefined = undefined,
> = KEYS extends any[] ? Constructable<Pick<T, KEYS[number]>> : Constructable<T>;

export function PickClassInner<T, KEYS extends Array<keyof T> | undefined = undefined>(
  classTarget: Constructable,
  classRef: Constructable<T>,
  keys?: KEYS,
): TypePickClass<T, KEYS> {
  copyMetadataOfClasses(classTarget.prototype, [classRef.prototype], (rules, key) => {
    if (!keys || keys.includes(key)) {
      return rules[key];
    }
  });
  copyPropertiesOfClasses(classTarget as any, [classRef], key => {
    return !keys || keys.includes(key);
  });
  return classTarget as any;
}
