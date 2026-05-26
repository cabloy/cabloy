// Utilities
import { getCurrentInstance, onMounted, readonly, shallowRef, toRef } from 'vue';

// Composables
export function useSsrBoot() {
  const isBooted = shallowRef(false);
  const instance = getCurrentInstance();
  const zova = instance.appContext.app.zova;
  if (zova.sys.env.SSR) {
    if (!zova.ctx.meta.$ssr.isRuntimeSsrPreHydration) {
      isBooted.value = true;
    } else {
      zova.ctx.meta.$ssr.onHydrated(() => {
        isBooted.value = true;
      });
    }
  } else {
    onMounted(() => {
      window.requestAnimationFrame(() => {
        isBooted.value = true;
      });
    });
  }
  const ssrBootStyles = toRef(() =>
    !isBooted.value
      ? {
          transition: 'none !important',
        }
      : undefined,
  );
  return {
    ssrBootStyles,
    isBooted: readonly(isBooted),
  };
}
// # sourceMappingURL=ssrBoot.js.map
