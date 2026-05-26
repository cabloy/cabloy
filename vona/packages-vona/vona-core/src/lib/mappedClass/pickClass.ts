import type { Constructable } from '../decorator/type/constructable.ts';
import type { TypePickClass } from './pickClassInner.ts';

import { appHmrDeps } from '../core/hmrDeps.ts';
import { PickClassInner } from './pickClassInner.ts';

export function PickClass<T>(classRef: Constructable<T>): Constructable<T>;
export function PickClass<T, KEYS extends Array<keyof T>>(
  classRef: Constructable<T>,
  keys: KEYS,
): Constructable<Pick<T, KEYS[number]>>;
export function PickClass<T, KEYS extends Array<keyof T> | undefined = undefined>(
  classRef: Constructable<T>,
  keys?: KEYS,
): TypePickClass<T, KEYS> {
  appHmrDeps.addBean(classRef);
  abstract class TargetClass {}
  return PickClassInner(TargetClass as any, classRef, keys);
}
