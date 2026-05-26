import { getCurrentInstance } from 'vue';

import type { ZovaApplication } from '../core/index.ts';

export function useApp(): ZovaApplication {
  const instance = getCurrentInstance();
  return instance?.appContext.app.zova as ZovaApplication;
}
