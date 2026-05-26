import type { Constructable } from '../decorator/type/constructable.ts';

import { copyMetadataOfClasses, copyPropertiesOfClasses } from './utils.ts';

export function PartialClass<T>(classRef: Constructable<T>): Constructable<Partial<T>>;
export function PartialClass<T, K extends keyof T>(
  classRef: Constructable<T>,
  keys: K[],
): Constructable<Partial<Pick<T, (typeof keys)[number]>> & Omit<T, (typeof keys)[number]>>;
export function PartialClass<T, K extends keyof T>(classRef: Constructable<T>, keys?: K[]): any {
  abstract class TargetClass {}
  copyMetadataOfClasses(
    TargetClass.prototype,
    [classRef.prototype],
    (rules, key, metadataKeyOptions) => {
      if (keys && !keys.includes(key)) return rules[key];
      if (metadataKeyOptions?.partialClass) {
        return metadataKeyOptions?.partialClass(rules[key]);
      }
      return rules[key];
    },
  );
  copyPropertiesOfClasses(TargetClass as any, [classRef]);
  return TargetClass as any;
}
