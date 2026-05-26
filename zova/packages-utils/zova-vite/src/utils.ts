import type { ZovaConfigMeta, ZovaMetaAppMode, ZovaMetaFlavor } from '@cabloy/module-info';

import fse from 'fs-extra';
import compileTemplate from 'lodash/template.js';
import parseArgs from 'minimist';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function getFlavor(offset: number = 2): ZovaMetaFlavor {
  return getEnvFromCli('FLAVOR', 'flavor', 'admin', offset) as ZovaMetaFlavor;
}

export function getAppMode(offset: number = 2): ZovaMetaAppMode {
  return getEnvFromCli('APPMODE', 'appMode', 'ssr', offset) as ZovaMetaAppMode;
}

export function getEnvMeta(configMeta: ZovaConfigMeta) {
  return {
    flavor: configMeta.flavor,
    mode: configMeta.mode,
    appMode: configMeta.appMode,
    local: 'local',
  };
}

export function getOutDir() {
  return process.env.BUILD_OUTDIR || `dist/${process.env.META_APP_MODE}-${process.env.META_FLAVOR}`;
}

export function getOutReleasesDir() {
  return `dist-releases/${process.env.META_APP_MODE}-${process.env.META_FLAVOR}-${process.env.APP_VERSION}`;
}

export function getEnvFromCli(
  cliEnvName: string,
  cliArgName: string,
  defaultValue: string,
  offset: number = 2,
): string {
  let value = process.env[cliEnvName];
  if (!value) {
    const argv = parseArgs(process.argv.slice(offset));
    value = argv[cliArgName];
  }
  if (!value) {
    value = defaultValue;
  }
  return value;
}

export function resolveTemplatePath(file: string) {
  return new URL(path.join('../templates', file), import.meta.url);
}

export function generateConfigDefine(env, translates?: string[]) {
  const acc = {};
  for (const key in env) {
    if (!translates || translates.includes(key)) {
      acc[`process.env.${key}`] = JSON.stringify(env[key]);
    } else {
      acc[`process.env.${key}`] = `'process.env.${key}->sys.env.${key}'`;
    }
  }
  return acc;
}

// export function setModuleAlias() {
//   // alias
//   const alias = {
//     '@vue/babel-plugin-jsx': '@cabloy/vue-babel-plugin-jsx',
//     '@vue/compiler-sfc': '@cabloy/vue-compiler-sfc',
//     '@vue/runtime-core': '@cabloy/vue-runtime-core',
//     '@vue/runtime-dom': '@cabloy/vue-runtime-dom',
//     '@vue/reactivity': '@cabloy/vue-reactivity',
//     '@vue/server-renderer': '@cabloy/vue-server-renderer',
//     'vue-router': '@cabloy/vue-router',
//   };
//   for (const key in alias) {
//     moduleAlias.addAlias(key, alias[key]);
//   }
//   return alias;
// }

export function getAbsolutePathOfModule(id: string, postfix: string = 'index.js') {
  const require = createRequire(import.meta.url);
  let modulePath = require.resolve(id);
  if (postfix) {
    let pos = modulePath.lastIndexOf(postfix);
    if (pos === -1) {
      pos = modulePath.lastIndexOf(postfix.replaceAll('/', '\\'));
    }
    if (pos > -1) {
      modulePath = modulePath.substring(0, modulePath.length - postfix.length - 1);
    }
  }
  return modulePath;
}

export function requireModule(id: string) {
  const require = createRequire(import.meta.url);
  return require(id);
}

export async function copyTemplateFile(fileSrc: URL | string, fileDest: string, variables?) {
  if (!variables) {
    await fse.copyFile(fileSrc, fileDest);
    return;
  }
  // src
  const contentSrc = (await fse.readFile(fileSrc, 'utf-8')).toString();
  const template = compileTemplate(contentSrc);
  // dest
  const contentDest = template(variables);
  await fse.writeFile(fileDest, contentDest, 'utf-8');
}

export async function loadJSONFile(fileName: URL | string) {
  const pkgContent = (await fse.readFile(fileName)).toString();
  return JSON.parse(pkgContent);
}

export async function saveJSONFile(fileName: URL | string, json: object) {
  await fse.writeFile(fileName, `${JSON.stringify(json, null, 2)}\n`);
}

export function copyTemplateIfNeed(fileSrc, fileDest) {
  if (!fse.existsSync(fileDest)) {
    fse.copyFileSync(fileSrc, fileDest);
  }
}

export function pathToHref(fileName: string): string {
  return pathToFileURL(fileName).href;
}
