import { getCurrentInstance } from 'vue';

import type { ZovaContext } from '../core/context/context.ts';

export function useContext(): ZovaContext {
  const instance = getCurrentInstance();
  return instance?.zova as ZovaContext;
}
