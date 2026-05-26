import type { App } from 'vue';

import type { ZovaContext } from '../core/index.ts';

export const PluginBean = {
  install(app: App) {
    app.mixin({
      created() {
        // this._ is instance, not use self.$
        const ctx: ZovaContext = this._.zova;
        if (ctx) {
          ctx.meta.component.activate();
        }
      },
    });
  },
};
