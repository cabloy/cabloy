import type { Constructable } from '../decorator/type/constructable.ts';

import { copyMetadataOfClasses, copyPropertiesOfClasses } from './utils.ts';

export function PickClass<T, K extends keyof T>(
  classRef: Constructable<T>,
  keys: K[],
): Constructable<Pick<T, (typeof keys)[number]>> {
  abstract class TargetClass {}
  copyMetadataOfClasses(TargetClass.prototype, [classRef.prototype], (rules, key) => {
    if (keys.includes(key)) {
      return rules[key];
    }
  });
  copyPropertiesOfClasses(TargetClass as any, [classRef], key => {
    return keys.includes(key);
  });
  return TargetClass as any;
}
