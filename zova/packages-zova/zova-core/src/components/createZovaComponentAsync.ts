import { defineAsyncComponent } from 'vue';

import { useSys } from '../composables/useSys.ts';

export function createZovaComponentAsync(module: string, name?: string) {
  return defineAsyncComponent(() => {
    return new Promise(resolve => {
      const sys = useSys();
      sys.meta.component.use(module, name).then(value => {
        resolve(value as any);
      });
    });
  });
}
