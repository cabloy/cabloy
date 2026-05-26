import type { IndexAPI } from '@quasar/app-vite';
import type { UserConfig as ViteUserConfig } from 'vite';
import type { ZovaViteConfigResult } from 'zova-vite';

import { createLogger, mergeConfig } from 'vite';
import { generateConfigDefine } from 'zova-vite';

import type { ConfigContext } from './types.js';

const __SvgIconPattern = /\.metadata\/icons\/groups\/.*?\.svg/;

export function extendViteConf(context: ConfigContext) {
  return function extendViteConf(conf: ViteUserConfig, opts, _api: IndexAPI) {
    const zovaViteMeta = context.zovaViteMeta as ZovaViteConfigResult;
    // conf.build override zovaViteMeta.viteConfig.build
    const minify = conf.build?.minify;
    // have two outDir for ssr
    const outDir = conf.build?.outDir;
    conf.build = mergeConfig(conf.build || {}, zovaViteMeta.viteConfig.build);
    if (minify === false) {
      conf.build.minify = minify;
    }
    if (outDir) {
      conf.build.outDir = outDir;
    }
    // css
    conf.css = mergeConfig(conf.css || {}, {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    });
    // hmr
    if (opts.isClient) {
      conf.server = mergeConfig(conf.server || {}, {
        hmr: {
          port: 24679,
        },
      });
    } else {
      conf.server = mergeConfig(conf.server || {}, {
        hmr: true,
      });
    }
    // assetsInlineLimit
    if (opts.isServer) {
      conf.build.assetsInlineLimit = (filePath: string) => {
        if (__SvgIconPattern.test(filePath)) {
          return false;
        }
      };
    }
    // env
    let env;
    if (opts.isClient) {
      env = zovaViteMeta.env;
    } else {
      env = Object.assign({}, zovaViteMeta.env, {
        SERVER: true,
        CLIENT: false,
      });
      // special for dist files
      process.env.SERVER = env.SERVER;
      process.env.NODE_ENV = 'production'; // patch for vue warn, such as withDirectives: currentRenderingInstance === null
      // process.env.CLIENT = env.CLIENT; // should not set if false
    }
    // define
    const define = generateConfigDefine(env, [
      'NODE_ENV',
      'META_FLAVOR',
      'META_MODE',
      'META_APP_MODE',
      'SERVER',
      'CLIENT',
      'DEV',
      'PROD',
      'SSR',
    ]);
    conf.define = mergeConfig(conf.define || {}, define);
    // ssr
    if (opts.isServer && context.configMeta?.mode === 'development') {
      conf.ssr = mergeConfig(conf.ssr || {}, {
        external: [
          'vue',
          'pinia',
          '@vue/runtime-core',
          '@vue/reactivity',
          '@vue/runtime-dom',
          '@vue/server-renderer',
          '@cabloy/vue-reactivity',
          '@cabloy/vue-runtime-core',
          '@cabloy/vue-runtime-dom',
          '@cabloy/vue-server-renderer',
        ],
        optimizeDeps: {
          noDiscovery: false,
          exclude: [
            'vue',
            'pinia',
            '@vue/runtime-core',
            '@vue/reactivity',
            '@vue/runtime-dom',
            '@vue/server-renderer',
            '@cabloy/vue-reactivity',
            '@cabloy/vue-runtime-core',
            '@cabloy/vue-runtime-dom',
            '@cabloy/vue-server-renderer',
          ],
        },
      });
    }
    // ssr
    if (opts.isServer && context.configMeta?.mode === 'production') {
      conf.ssr = mergeConfig(conf.ssr || {}, {
        target: 'node',
      });
      conf.ssr.noExternal = true;
    }
    // general: logger
    const logger = createLogger();
    const loggerWarn = logger.warn;
    logger.warn = (msg, options) => {
      // ssr: logger
      if (opts.isServer && context.configMeta?.mode === 'development') {
        if (msg.includes('Failed to load source map')) return;
      }
      if (
        msg.includes(
          'Arbitrary module namespace identifier names are not available in the configured target environment',
        )
      )
        return;
      if (
        msg.includes('Big integer literals are not available in the configured target environment')
      )
        return;
      loggerWarn(msg, options);
    };
    conf.customLogger = logger;
  } as any;
}
