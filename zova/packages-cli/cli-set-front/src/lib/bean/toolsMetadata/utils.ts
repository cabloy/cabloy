import type { IGlobBeanFile, OnionSceneMeta } from '@cabloy/module-info';

import {
  skipPrefix,
  stringToCapitalize,
  toLowerCaseFirstChar,
  toUpperCaseFirstChar,
} from '@cabloy/word-utils';
import fse from 'fs-extra';
import { globby } from 'globby';
import path from 'node:path';

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function checkIgnoreOfParts(parts: string[]) {
  const indexLast = parts.length - 1;
  if (parts[indexLast].endsWith('_')) {
    parts[indexLast] = parts[indexLast].substring(0, parts[indexLast].length - 1);
    return true;
  }
  return false;
}

export function getScopeModuleName(moduleName: string) {
  return `ScopeModule${stringToCapitalize(moduleName, '-')}`;
}

export async function globAllTsFiles(
  moduleName: string,
  modulePath: string,
): Promise<IGlobBeanFile[]> {
  const result: IGlobBeanFile[] = [];
  const files = await globby('src/**/*.ts(x)?', { cwd: modulePath });
  if (files.length === 0) return result;
  files.sort();
  const pathMetadata = path.join(modulePath, 'src/.metadata');
  for (const file of files) {
    const filePath = path.join(modulePath, file);
    const fileName = path.basename(file);
    if (fileName.startsWith('_')) continue;
    const parts = fileName.split('.').slice(0, -1);
    const isIgnore = checkIgnoreOfParts(parts);
    const fileNameJS = fileName.replace('.ts', '.js').replace('.tsx', '.jsx');
    const fileNameJSRelative = path
      .relative(pathMetadata, filePath)
      .replace(/\\/g, '/')
      .replace('.ts', '.js')
      .replace('.tsx', '.jsx');
    const fileContent = fse.readFileSync(filePath).toString();
    const isVirtual = fileContent.includes('@Virtual()');
    const isPreload = fileContent.includes('@Preload()');
    const matches = fileContent
      .replace('@ProxyDisable()', '')
      .match(/\s@([^\s<]+)\S*?\([\s\S]*?\)\sexport class ([^ \n<]+)/);
    if (!matches) continue;
    const className = matches[2];
    const sceneNameCapitalize = isVirtual
      ? matches[1] === 'Virtual'
        ? 'Bean'
        : matches[1]
      : matches[1];
    const sceneName = toLowerCaseFirstChar(sceneNameCapitalize);
    const beanName = parseBeanName(className, sceneName);
    const beanNameFull = `${moduleName}:${beanName}`;
    const beanNameCapitalize = toUpperCaseFirstChar(beanName);
    const beanFullName = `${moduleName}.${sceneName}.${beanName}`;
    result.push({
      sceneName,
      sceneNameCapitalize,
      file: filePath,
      fileContent,
      fileName,
      fileNameJS,
      fileNameJSRelative,
      className,
      beanName,
      beanNameFull,
      beanNameCapitalize,
      beanFullName,
      isIgnore,
      isVirtual,
      isPreload,
    });
  }
  return result;
}

export function parseBeanName(className: string, scene: string) {
  return skipPrefix(className, scene, true)!;
}

export function extractBeanInfo(sceneName: string, fileContent: string, sceneMeta: OnionSceneMeta) {
  const sceneNameCapitalize = toUpperCaseFirstChar(sceneName);
  // optionsCustomInterface
  let optionsCustomInterface: string | undefined;
  let optionsCustomInterfaceFrom: string | undefined;
  let reg = new RegExp(
    `@${escapeRegExp(sceneNameCapitalize)}<(I${escapeRegExp(sceneNameCapitalize)}Options[^>]*)>`,
  );
  let matches = fileContent.match(reg);
  if (matches) {
    optionsCustomInterface = matches[1];
    // optionsCustomInterfaceFrom
    reg = new RegExp(
      `import {[\\s\\S]*?${escapeRegExp(optionsCustomInterface)}[, ][\\s\\S]*?} from '([^']*)'`,
    );
    matches = fileContent.match(reg);
    if (matches) {
      optionsCustomInterfaceFrom = matches[1];
    }
  }
  // isGlobal
  const isGlobal = sceneMeta.hasLocal
    ? fileContent.match(/@.*?\(\{([\s\S]*?)global: true([\s\S]*?)\}([\s\S]*?)\)\s*export class/)
    : true;
  return { optionsCustomInterface, optionsCustomInterfaceFrom, isGlobal };
}

export function beanFullNameFromOnionName(onionName: string, sceneName: string): string {
  return onionName.replace(':', `.${sceneName}.`);
}

export function onionNameFromBeanFullName(beanFullName: string, sceneName: string): string {
  return beanFullName.replace(`.${sceneName}.`, ':');
}
