import type { ZovaSys } from '../core/sys/sys.ts';

import { sys } from '../core/sys/sys.ts';

export function useSys(): ZovaSys {
  return sys;
}
