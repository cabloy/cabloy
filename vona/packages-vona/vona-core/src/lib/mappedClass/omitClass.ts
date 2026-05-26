import type { Constructable } from '../decorator/type/constructable.ts';

import { appHmrDeps } from '../core/hmrDeps.ts';
import { copyMetadataOfClasses, copyPropertiesOfClasses } from './utils.ts';

export function OmitClass<T, K extends keyof T>(
  classRef: Constructable<T>,
  keys: K[],
): Constructable<Omit<T, (typeof keys)[number]>> {
  appHmrDeps.addBean(classRef);
  abstract class TargetClass {}
  copyMetadataOfClasses(TargetClass.prototype, [classRef.prototype], (rules, key) => {
    if (!keys.includes(key)) {
      return rules[key];
    }
  });
  copyPropertiesOfClasses(TargetClass as any, [classRef], key => {
    return !keys.includes(key);
  });
  return TargetClass as any;
}
