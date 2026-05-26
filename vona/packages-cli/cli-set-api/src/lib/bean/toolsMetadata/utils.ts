import type { IGlobBeanFile, OnionSceneMeta } from '@cabloy/module-info';

import { stringToCapitalize, toUpperCaseFirstChar } from '@cabloy/word-utils';
import fse from 'fs-extra';
import { globby } from 'globby';
import path from 'node:path';

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

export async function globBeanFiles(
  sceneName: string,
  sceneMeta: OnionSceneMeta,
  moduleName: string,
  modulePath: string,
): Promise<IGlobBeanFile[]> {
  const result: IGlobBeanFile[] = [];
  const sceneNameCapitalize = toUpperCaseFirstChar(sceneName);
  const pattern = sceneMeta.sceneIsolate
    ? `src/${sceneName}/*.ts(x)?`
    : `src/bean/${sceneName}.*.ts(x)?`;
  const files = await globby(pattern, { cwd: modulePath });
  if (files.length === 0) return result;
  files.sort();
  for (const file of files) {
    const filePath = path.join(modulePath, file);
    const fileName = path.basename(file);
    if (fileName.startsWith('_')) continue;
    const parts = fileName.split('.').slice(0, -1);
    if (sceneMeta.sceneIsolate && parts.length !== 1) continue;
    if (!sceneMeta.sceneIsolate && parts.length < 2) continue;
    const isIgnore = checkIgnoreOfParts(parts);
    const fileNameJS = fileName; // fileName.replace('.ts', '.js');
    const fileNameJSRelative = sceneMeta.sceneIsolate
      ? `../${sceneName}/${fileNameJS}`
      : `../bean/${fileNameJS}`;
    const className =
      (sceneMeta.sceneIsolate ? sceneNameCapitalize : '') +
      parts.map(item => toUpperCaseFirstChar(item)).join('');
    const beanName = parts[parts.length - 1];
    const beanNameFull = `${moduleName}:${beanName}`;
    const beanNameCapitalize = toUpperCaseFirstChar(beanName);
    const beanFullName = sceneName === 'bean' ? beanName : `${moduleName}.${sceneName}.${beanName}`;
    const fileContent = isIgnore ? '' : fse.readFileSync(filePath).toString();
    const isVirtual = fileContent.includes('@Virtual()');
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
    });
  }
  return result;
}

export function extractBeanInfo(sceneName: string, fileContent: string, sceneMeta: OnionSceneMeta) {
  const sceneNameCapitalize = toUpperCaseFirstChar(sceneName);
  // optionsCustomInterface
  let optionsCustomInterface: string | undefined;
  let optionsCustomInterfaceFrom: string | undefined;
  let reg = new RegExp(`@${sceneNameCapitalize}<(I${sceneNameCapitalize}Options[^>]*)>`);
  let matches = fileContent.match(reg);
  if (matches) {
    optionsCustomInterface = matches[1];
    // optionsCustomInterfaceFrom
    reg = new RegExp(
      `import type {[\\s\\S]*?${optionsCustomInterface}[, ][\\s\\S]*?} from '([^']*)'`,
    );
    matches = fileContent.match(reg);
    if (matches) {
      optionsCustomInterfaceFrom = matches[1];
    }
  }
  // isGlobal
  const isGlobal = sceneMeta.hasLocal ? fileContent.includes('@Global()') : true;
  return { optionsCustomInterface, optionsCustomInterfaceFrom, isGlobal };
}

// fileContent.match(/@.*?\(\{([\s\S]*?)global: true([\s\S]*?)\}([\s\S]*?)\)\s*export class/)
