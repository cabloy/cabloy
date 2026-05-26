import type { Constructable } from '../decorator/type/constructable.ts';

import { appHmrDeps } from '../core/hmrDeps.ts';

export function ExtendClass<T>(classRef: Constructable<T>): Constructable<T> {
  appHmrDeps.addBean(classRef);
  return classRef;
}
