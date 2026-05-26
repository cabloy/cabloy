import { getCurrentInstance, shallowRef } from 'vue';

import { IN_BROWSER } from '../util/index.js';
// Composables
import { useDisplay } from './display.js';
// Utilities
export function useHydration() {
  if (!IN_BROWSER) return shallowRef(false);
  const { ssr } = useDisplay();
  if (ssr) {
    const isMounted = shallowRef(false);
    const instance = getCurrentInstance();
    const zova = instance.appContext.app.zova;
    if (!zova.ctx.meta.$ssr.isRuntimeSsrPreHydration) {
      isMounted.value = true;
    } else {
      zova.ctx.meta.$ssr.onHydrated(() => {
        isMounted.value = true;
      });
    }
    return isMounted;
  } else {
    return shallowRef(true);
  }
}
// # sourceMappingURL=hydration.js.map
