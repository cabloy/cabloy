import type { glob } from '@cabloy/module-glob';

import babel from '@cabloy/vite-plugin-babel';
import fse from 'fs-extra';
import path from 'node:path';
import devtoolsJson from 'vite-plugin-devtools-json';
// import vitePluginChecker from 'vite-plugin-checker';
import { vitePluginFakeServer } from 'vite-plugin-fake-server-turbo';

import type { ZovaViteConfigOptions, ZovaVitePlugin } from './types.ts';

import { getAbsolutePathOfModule, requireModule } from './utils.ts';
import { cssCollectPlugin } from './vitePluginCssCollect.ts';
import { hmrPlugin } from './vitePluginHmr.ts';

export function generateVitePlugins(
  configOptions: ZovaViteConfigOptions,
  modulesMeta: Awaited<ReturnType<typeof glob>>,
) {
  const vitePlugins: ZovaVitePlugin[] = [];
  vitePlugins.push(__getVitePluginTs());
  vitePlugins.push(__getVitePluginTsx());
  if (process.env.MOCK_ENABLED === 'true') {
    vitePlugins.push(__getVitePluginMock(configOptions, modulesMeta));
  }
  vitePlugins.push(__getVitePluginDevtoolsJson());
  vitePlugins.push(__getVitePluginCss());
  vitePlugins.push(__getVitePluginHmr());
  // vitePlugins.push(__getVitePluginChecker(configOptions));
  return vitePlugins;

  //////////////////////////////

  function __getVitePluginTs() {
    const babelPluginZovaBeanModule = getAbsolutePathOfModule('babel-plugin-zova-bean-module', '');
    const babelPluginZovaBeanUse = getAbsolutePathOfModule('babel-plugin-zova-bean-use', '');
    const babelPluginTransformTypescriptMetadata = getAbsolutePathOfModule(
      'babel-plugin-transform-typescript-metadata',
      '',
    );
    const babelPluginProposalDecorators = getAbsolutePathOfModule(
      '@babel/plugin-proposal-decorators',
      '',
    );
    const babelPluginTransformClassProperties = getAbsolutePathOfModule(
      '@babel/plugin-transform-class-properties',
      '',
    );
    const babelPluginTransformTypescript = getAbsolutePathOfModule(
      '@babel/plugin-transform-typescript',
      '',
    );
    return [
      'vite-plugin-babel',
      babel,
      {
        filter: /\.ts$/,
        babelConfig: {
          babelrc: false,
          configFile: false,
          plugins: [
            [babelPluginZovaBeanModule, { brandName: 'zova' }],
            [babelPluginZovaBeanUse],
            [babelPluginTransformTypescriptMetadata],
            [babelPluginProposalDecorators, { version: 'legacy' }],
            [babelPluginTransformClassProperties, { loose: true }],
            [babelPluginTransformTypescript],
          ],
        },
      },
      undefined,
    ] as ZovaVitePlugin;
  }

  function __getVitePluginTsx() {
    const vueJsxPlugin = requireModule('@vitejs/plugin-vue-jsx');
    const babelPluginZovaComponent = getAbsolutePathOfModule('babel-plugin-zova-component', '');
    const babelPluginZovaBehavior = getAbsolutePathOfModule('babel-plugin-zova-behavior', '');
    const babelPluginZovaBeanModule = getAbsolutePathOfModule('babel-plugin-zova-bean-module', '');
    const babelPluginZovaBeanUse = getAbsolutePathOfModule('babel-plugin-zova-bean-use', '');
    const babelPluginTransformTypescriptMetadata = getAbsolutePathOfModule(
      'babel-plugin-transform-typescript-metadata',
      '',
    );
    const babelPluginProposalDecorators = getAbsolutePathOfModule(
      '@babel/plugin-proposal-decorators',
      '',
    );
    const babelPluginTransformClassProperties = getAbsolutePathOfModule(
      '@babel/plugin-transform-class-properties',
      '',
    );
    return [
      '@vitejs/plugin-vue-jsx',
      vueJsxPlugin,
      {
        include: /\.[jt]sx$/,
        babelPlugins: [
          [babelPluginZovaComponent],
          [babelPluginZovaBehavior],
          [babelPluginZovaBeanModule, { brandName: 'zova' }],
          [babelPluginZovaBeanUse],
          [babelPluginTransformTypescriptMetadata],
          [babelPluginProposalDecorators, { version: 'legacy' }],
          [babelPluginTransformClassProperties, { loose: true }],
        ],
      },
      undefined,
    ] as ZovaVitePlugin;
  }

  function __getVitePluginDevtoolsJson() {
    return ['vite-plugin-devtools-json', devtoolsJson, {}, undefined] as ZovaVitePlugin;
  }

  function __getVitePluginCss() {
    return ['vite-plugin-zova-css-collect', cssCollectPlugin, {}, undefined] as ZovaVitePlugin;
  }

  function __getVitePluginHmr() {
    return ['vite-plugin-zova-hmr', hmrPlugin, {}, undefined] as ZovaVitePlugin;
  }

  function __getVitePluginMock(
    configOptions: ZovaViteConfigOptions,
    _modulesMeta: Awaited<ReturnType<typeof glob>>,
  ) {
    const include = [];
    __prepareMockIncludes(include, configOptions, modulesMeta);
    const logger = process.env.MOCK_LOGGER === 'true';
    const basename = process.env.MOCK_BASE_NAME || '';
    const build =
      process.env.MOCK_BUILD === 'true'
        ? {
            port: Number(process.env.MOCK_BUILD_PORT || 8888),
            outDir: process.env.MOCK_BUILD_OUTPUT || 'dist-mock',
          }
        : false;
    const cors = process.env.MOCK_BUILD_CORS === 'true';
    return [
      'vite-plugin-fake-server',
      vitePluginFakeServer,
      {
        include,
        exclude: ['_*'],
        infixName: 'fake',
        watch: true,
        logger,
        basename,
        enableDev: process.env.MOCK_ENABLED === 'true',
        enableProd: !build,
        build,
        cors,
      },
      undefined,
    ] as ZovaVitePlugin;
  }

  function __prepareMockIncludes(
    includes: string[],
    _configOptions: ZovaViteConfigOptions,
    modulesMeta: Awaited<ReturnType<typeof glob>>,
  ) {
    // modules
    const { modules } = modulesMeta;
    // loop
    for (const moduleName in modules) {
      const module = modules[moduleName];
      const mockPath = path.join(module.root, 'mock');
      if (fse.existsSync(mockPath)) {
        const relativePath = path.relative(configOptions.appDir, mockPath);
        includes.push(relativePath);
      }
    }
  }

  // function __getVitePluginChecker(configOptions: ZovaViteConfigOptions) {
  //   const tsconfigPath = path.join(configOptions.appDir, 'tsconfig.vue-tsc.json');
  //   return [
  //     'vite-plugin-checker',
  //     vitePluginChecker,
  //     {
  //       vueTsc: {
  //         tsconfigPath,
  //       },
  //       eslint: {
  //         lintCommand: 'eslint "./**/*.{js,ts,tsx,mjs,mts,cjs,cts,vue}"',
  //       },
  //     },
  //     { server: false },
  //   ] as ZovaVitePlugin;
  // }
}
