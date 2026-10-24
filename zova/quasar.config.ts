/* eslint-env node */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '@quasar/app-vite/wrappers';
import { codeInspectorPlugin } from 'code-inspector-plugin';

export default defineConfig(ctx => {
  return {
    build: {
      extendViteConf(viteConf) {
        if (!ctx.dev) return;
        // Quasar provides this resolver at runtime but omits it from IResolve.
        const resolveEntry = (
          ctx.appPaths.resolve as typeof ctx.appPaths.resolve & { entry: (file: string) => string }
        ).entry;
        viteConf.plugins ??= [];
        viteConf.plugins.unshift(
          codeInspectorPlugin({
            bundler: 'vite',
            dev: ctx.dev,
            enforcePre: true,
            injectTo: resolveEntry('client-entry.js'),
            match: /\.tsx$/,
            exclude: /\/\.metadata\//,
            pathType: 'absolute',
            server: 'close',
            skipSnippets: ['console'],
            behavior: {
              locate: false,
              target: 'vscode://file/{file}:{line}:{column}',
            },
          }),
        );
      },
    },

    devServer: {
      open: false, // opens browser window automatically
    },
  };
});
