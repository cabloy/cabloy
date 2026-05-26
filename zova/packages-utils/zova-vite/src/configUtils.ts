import type { IBundleVendor, ZovaConfigMeta } from '@cabloy/module-info';

import * as dotenv from '@cabloy/dotenv';
import { glob } from '@cabloy/module-glob';
import path from 'node:path';

import type { ZovaViteConfigOptions } from './types.ts';

import { getEnvMeta } from './utils.ts';

// const __ModuleLibs = [
//   /src\/module\/([^/]*)\//,
//   /src\/module-vendor\/([^/]*)\//,
//   /src\/suite\/.*\/modules\/([^/]*)\//,
//   /src\/suite-vendor\/.*\/modules\/([^/]*)\//,
//   /\/zova-module-([^/]*)\//,
// ];

const __ZovaManualChunkVendorsSys = [
  { match: ['~commonjsHelpers.js'], output: 'commonjsHelper' },
  { match: ['~plugin-vue:export-helper'], output: 'vue' },
  {
    match: [
      'vue',
      'vue/jsx-runtime',
      '@vue/runtime-dom',
      '@vue/shared',
      '@vue/reactivity',
      '@vue/server-renderer',
      '@cabloy/vue-runtime-core',
      '@cabloy/vue-runtime-dom',
      '@cabloy/vue-reactivity',
      '@cabloy/vue-server-renderer',
    ],
    output: 'vue',
  },
  { match: ['vue-router', '@cabloy/vue-router'], output: 'vue-router' },
  {
    match: [
      'reflect-metadata',
      '@cabloy',
      'zova',
      '~packages-zova/zova/',
      'zova-core',
      '~packages-zova/zova-core/',
      '@cabloy/logger',
      '~packages-utils/logger/',
      'mutate-on-copy',
      '~packages-utils/mutate-on-copy/',
      '@cabloy/word-utils',
      '~packages-utils/word-utils/',
      'zova-jsx',
      '~packages-utils/zova-jsx/',
      'zova-openapi',
      '~packages-utils/zova-openapi/',
    ],
    output: 'zova',
  },
  { match: ['pinia'], output: 'pinia' },
  { match: ['@faker-js'], output: 'faker' },
];

export function createConfigUtils(
  configMeta: ZovaConfigMeta,
  configOptions: ZovaViteConfigOptions,
): {
  loadEnvs: () => { [name: string]: string };
  loadModulesMeta: () => ReturnType<typeof glob>;
  codeSplittingGroups: () => any[];
} {
  let __modulesMeta: Awaited<ReturnType<typeof glob>>;
  return {
    loadEnvs: __loadEnvs,
    loadModulesMeta: __loadModulesMeta,
    codeSplittingGroups: __codeSplittingGroups,
  };

  //////////////////////////////

  function __loadEnvs() {
    const meta = getEnvMeta(configMeta);
    const envDir = path.join(configOptions.appDir, 'env');
    const envs = dotenv.loadEnvs(meta, envDir, '.env');
    const res = Object.assign(
      {
        NODE_ENV: meta.mode,
      },
      envs,
      {
        META_FLAVOR: meta.flavor,
        META_MODE: meta.mode,
        META_APP_MODE: meta.appMode,
      },
      // compatible with quasar
      {
        DEV: meta.mode === 'development',
        PROD: meta.mode === 'production',
        SSR: meta.appMode === 'ssr',
        // DEBUGGING: meta.mode === 'development',
        // CLIENT: envs!.APP_SERVER === 'true',
        // SERVER: envs!.APP_SERVER !== 'true',
        // MODE: meta.appMode,
      },
    );
    for (const key of [
      'NODE_ENV',
      'META_FLAVOR',
      'META_MODE',
      'META_APP_MODE',
      'DEV',
      'PROD',
      'SSR',
    ]) {
      if ((res[key] as any) !== false) {
        process.env[key] = res[key];
      }
    }
    // ok
    return res;
  }

  async function __loadModulesMeta() {
    const meta = getEnvMeta(configMeta);
    // modules
    __modulesMeta = await glob({
      projectMode: 'zova',
      projectPath: configOptions.appDir,
      disabledModules: __getDisabledModules(),
      disabledSuites: process.env.PROJECT_DISABLED_SUITES,
      log: false,
      meta,
    });
    return __modulesMeta;
  }

  function __getDisabledModules() {
    let modules: string[] | string = process.env.PROJECT_DISABLED_MODULES ?? '';
    if (!Array.isArray(modules)) modules = modules ? modules.split(',') : [];
    return modules;
  }

  // function __configManualChunk_adjustId(id: string) {
  //   //
  //   id = id.replace(/\\/g, '/');
  //   const appDir = configOptions.appDir.replace(/\\/g, '/');
  //   //
  //   let index = id.indexOf(appDir);
  //   if (index > -1) {
  //     id = id.substring(index + appDir.length);
  //   }
  //   //
  //   index = id.lastIndexOf('node_modules');
  //   if (index > -1) {
  //     id = id.substring(index + 'node_modules'.length);
  //   }
  //   return id;
  // }

  // function __codeSplittingGroups(id: string) {
  //   let output = __configManualChunk(id);
  //   if (output && process.env.BUILD_CHUNK_OBFUSCATION === 'true') {
  //     output = _configManualChunk_Obfuscation(output);
  //   }
  //   return output;
  // }

  // function _configManualChunk_Obfuscation(output: string) {
  //   if (!__chunkNameHashes[output]) {
  //     __chunkNameHashes[output] = `Chunk-${crypto.createHash('sha1').update(output).digest('hex').slice(0, 6)}`;
  //   }
  //   return __chunkNameHashes[output];
  // }

  function __codeSplittingGroups() {
    let groups: any[] = [];
    // begin
    groups = groups.concat(_configManualChunk_vendorsModulesBegin());
    // sys
    groups = groups.concat(_configManualChunk_vendorsSys());
    // custom
    groups = groups.concat(_configManualChunk_vendorsCustom());
    // vendors
    groups = groups.concat(_configManualChunk_vendorsModules());
    // modules
    groups = groups.concat(_configManualChunk_modules());
    // end
    groups = groups.concat(_configManualChunk_vendorsModulesEnd());
    // debug
    if (configOptions.zovaManualChunk?.debug) {
      groups.push({
        name: id => {
          // eslint-disable-next-line
          console.log(id);
        },
      });
    }
    // ok
    return groups;
  }

  function _configManualChunk_vendorsSys() {
    return _configChunkVendorsToGroups(__ZovaManualChunkVendorsSys);
  }

  function _configManualChunk_vendorsCustom() {
    return _configChunkVendorsToGroups(configOptions.zovaManualChunk?.vendors || []);
  }

  function _configManualChunk_vendorsModules() {
    // vendors
    let vendors: IBundleVendor[] = [];
    // modules
    const { modules } = __modulesMeta;
    // loop
    for (const moduleName in modules) {
      const module = modules[moduleName];
      const vendorsModule = module.package.zovaModule?.bundle?.vendors;
      if (vendorsModule) {
        vendors = vendors.concat(vendorsModule);
      }
    }
    return _configChunkVendorsToGroups(vendors);
  }

  function _configManualChunk_vendorsModulesBegin() {
    const groups: any[] = [];
    if (process.env.BUILD_MINIFY === 'false') {
      groups.push({
        test: /\.zova\/config\.ts/,
        name: '-zova-config',
      });
    }
    groups.push({
      test: /\.fake\.ts/,
      name: '-zova-mock',
    });
    return groups;
  }

  function _configManualChunk_vendorsModulesEnd() {
    const groups: any[] = [];
    return groups;
  }

  function _configChunkVendorsToGroups(vendors: IBundleVendor[]) {
    const groups: any[] = [];
    for (const vendor of vendors) {
      for (const match of vendor.match) {
        let test;
        if (typeof match === 'string') {
          if (match[0] === '~') {
            test = match.substring(1);
          } else {
            test = `node_modules/${match}/`;
          }
        } else {
          test = match;
        }
        groups.push({
          test,
          name: vendor.output,
        });
      }
    }
    return groups;
  }

  function _configManualChunk_modules() {
    const appDir = configOptions.appDir.replace(/\\/g, '/');
    // groups
    const groups: any[] = [];
    // modules
    const { modules } = __modulesMeta;
    // loop
    for (const moduleName in modules) {
      const module = modules[moduleName];
      //
      let test = module.root;
      let index = test.indexOf(appDir);
      if (index > -1) {
        test = test.substring(index + appDir.length);
      }
      index = test.lastIndexOf('node_modules');
      if (index > -1) {
        test = test.substring(index + 'node_modules'.length);
      }
      groups.push({
        test: `${test}/`,
        name: moduleName,
      });
    }
    return groups;
  }

  // function _configManualChunk_match(id: string, vendors) {
  //   const matchItem = vendors.find(item => {
  //     return item.match.some(item => {
  //       if (typeof item === 'string') {
  //         const matchItem = item[0] === '~' ? item.substring(1) : `/${item}/`;
  //         return id.includes(matchItem);
  //       }
  //       return item.test(id);
  //     });
  //   });
  //   if (matchItem) return matchItem.output;
  //   return null;
  // }
}
