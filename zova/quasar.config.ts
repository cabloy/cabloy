/* eslint-env node */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '@quasar/app-vite/wrappers';

export default defineConfig(_ctx => {
  return {
    build: {
      // extendViteConf(_viteConf) {},
      // viteVuePluginOptions: {},
    },

    devServer: {
      open: false, // opens browser window automatically
    },
  };
});
