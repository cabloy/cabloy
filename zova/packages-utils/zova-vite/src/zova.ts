import type { ZovaConfigMeta } from '@cabloy/module-info';
import type { BuildEnvironmentOptions, CommonServerOptions } from 'vite';

import type { ZovaViteConfigOptions, ZovaViteConfigResult } from './types.ts';

import { createConfigUtils } from './configUtils.ts';
import { generateEntryFiles } from './generateEntryFiles.ts';
import { getOutDir } from './utils.ts';
import { generateVitePlugins } from './vitePlugins.ts';

const __SvgIconPattern = /\.metadata\/icons\/groups\/.*?\.svg/;

export async function generateZovaViteMeta(
  configMeta: ZovaConfigMeta,
  configOptions: ZovaViteConfigOptions,
): Promise<ZovaViteConfigResult> {
  // config utils
  const configUtils = createConfigUtils(configMeta, configOptions);
  // env
  const env = configUtils.loadEnvs();
  // modulesMeta
  const modulesMeta = await configUtils.loadModulesMeta();
  // server
  const server = __getConfigServer();
  // build
  const build = __getConfigBuild();
  // alias
  const alias = Object.assign(
    {},
    // {
    //   '@': path.join(configOptions.appDir, 'src/legacy'),
    // },
  );
  // vitePlugins
  const vitePlugins = generateVitePlugins(configOptions, modulesMeta);
  // viteConfig
  const viteConfig = {
    root: configOptions.appDir,
    base: env.APP_PUBLIC_PATH,
    mode: configMeta.mode,
    server,
    build,
    resolve: {
      alias,
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
  };
  // generateEntryFiles
  await generateEntryFiles(configMeta, configOptions, modulesMeta, env);
  // ok
  return {
    env,
    vitePlugins,
    viteConfig,
  };

  //////////////////////////////

  function __getConfigServer() {
    // proxy
    const proxy = {};
    if (process.env.PROXY_API_ENABLED === 'true') {
      proxy[process.env.PROXY_API_PREFIX!] = {
        target: process.env.PROXY_API_BASE_URL,
        changeOrigin: true,
      };
    }
    // server
    const server: CommonServerOptions = {
      proxy,
    };
    // devServerHost
    if (process.env.DEV_SERVER_HOSTNAME) {
      if (process.env.DEV_SERVER_HOSTNAME === 'true') {
        server.host = true;
      } else {
        server.host = process.env.DEV_SERVER_HOSTNAME;
      }
    }
    if (process.env.DEV_SERVER_PORT) {
      server.port = Number(process.env.DEV_SERVER_PORT);
    }
    return server;
  }

  function __getConfigBuild() {
    const outDir = getOutDir();
    const groups = configUtils.codeSplittingGroups();
    const build: BuildEnvironmentOptions = {
      outDir,
      rolldownOptions: {
        preserveEntrySignatures: 'allow-extension',
        output: {
          strictExecutionOrder: true,
          codeSplitting: {
            groups,
            includeDependenciesRecursively: false,
          },
        },
      },
      assetsInlineLimit: (filePath: string) => {
        if (__SvgIconPattern.test(filePath)) {
          return false;
        }
      },
      // keep_classnames not take effect for 'oxc'
      minify: process.env.BUILD_MINIFY === 'false' ? false : 'terser',
      terserOptions: {
        keep_classnames: true,
      },
    };
    return build;
  }
}
