import type { OnionSceneMeta } from '@cabloy/module-info';

import { replaceTemplate } from '@cabloy/utils';
import { toUpperCaseFirstChar } from '@cabloy/word-utils';
import { beanFullNameFromOnionName } from 'vona-core';

import { extractBeanInfo, getScopeModuleName, globBeanFiles } from './utils.ts';

export async function generateOnions(
  sceneName: string,
  sceneMeta: OnionSceneMeta,
  moduleName: string,
  modulePath: string,
) {
  const scopeModuleName = getScopeModuleName(moduleName);
  const sceneNameCapitalize = toUpperCaseFirstChar(sceneName);
  const globFiles = await globBeanFiles(sceneName, sceneMeta, moduleName, modulePath);
  if (globFiles.length === 0) return '';
  //
  const contentExports: string[] = [];
  const contentScopes: string[] = [];
  const contentImports: string[] = [];
  const contentRecordsGlobal: string[] = [];
  const contentRecordsLocal: string[] = [];
  let needImportOptionsGlobalInterface;
  for (const globFile of globFiles) {
    const {
      fileContent,
      fileNameJSRelative,
      sceneName,
      className,
      beanNameFull,
      isIgnore,
      isVirtual,
    } = globFile;
    const isBeanGlobal = fileNameJSRelative.includes('../bean/bean.');
    contentExports.push(`export * from '${fileNameJSRelative}';`);
    if (isIgnore) continue; // get scope() also can be ignored
    // options
    let onionOptions;
    if (!sceneMeta.optionsNone) {
      // fileInfo
      const fileInfo = extractBeanInfo(sceneName, fileContent, sceneMeta);
      // import options
      if (fileInfo.optionsCustomInterface) {
        contentImports.push(
          `import type { ${fileInfo.optionsCustomInterface} } from '${fileInfo.optionsCustomInterfaceFrom || fileNameJSRelative}';`,
        );
      }
      // valueOptionsCustomInterface
      let valueOptionsCustomInterface = fileInfo.optionsCustomInterface;
      if (valueOptionsCustomInterface && sceneMeta.optionsCustomInterfaceTemplate) {
        valueOptionsCustomInterface = replaceTemplate(sceneMeta.optionsCustomInterfaceTemplate, {
          optionsCustomInterface: valueOptionsCustomInterface,
        });
      }
      // record
      if (fileInfo.isGlobal) {
        if (valueOptionsCustomInterface) {
          onionOptions = valueOptionsCustomInterface;
          contentRecordsGlobal.push(`'${beanNameFull}': ${valueOptionsCustomInterface};`);
        } else {
          if (sceneMeta.optionsGlobalInterfaceName) {
            onionOptions = sceneMeta.optionsGlobalInterfaceName;
            contentRecordsGlobal.push(
              `'${beanNameFull}': ${sceneMeta.optionsGlobalInterfaceName};`,
            );
            needImportOptionsGlobalInterface = true;
          } else {
            contentRecordsGlobal.push(`'${beanNameFull}': never;`);
          }
        }
      } else {
        if (valueOptionsCustomInterface) {
          onionOptions = valueOptionsCustomInterface;
          contentRecordsLocal.push(`'${beanNameFull}': ${valueOptionsCustomInterface};`);
        } else {
          contentRecordsLocal.push(`'${beanNameFull}': never;`);
        }
      }
    }
    // get scope() also can be ignored
    if (!['entity', 'dto'].includes(sceneName) && !isVirtual) {
      contentScopes.push(`
        export interface ${className} {
          /** @internal */
          get scope(): ${scopeModuleName};
        }`);
      if (!isBeanGlobal) {
        const contentOnionOptions = onionOptions ? `get $onionOptions(): ${onionOptions};` : '';
        contentScopes.push(`
          export interface ${className} {
            get $beanFullName(): '${beanFullNameFromOnionName(beanNameFull, sceneName as never)}';
            get $onionName(): '${beanNameFull}';
            ${contentOnionOptions}
          }`);
      }
    }
  }
  // middlewareGlobal
  const exportRecordsMiddlewareGlobal = `
    export interface I${sceneNameCapitalize}Record${sceneMeta.hasLocal ? 'Global' : ''} {
      ${contentRecordsGlobal.join('\n')}
    }
`;
  // middlewareLocal
  const exportRecordsMiddlewareLocal = `
export interface I${sceneNameCapitalize}RecordLocal {
  ${contentRecordsLocal.join('\n')}
}
`;
  // combine
  const content = `/** ${sceneName}: begin */
${contentExports.join('\n')}
${contentImports.join('\n')}
${
  needImportOptionsGlobalInterface
    ? `import { type ${sceneMeta.optionsGlobalInterfaceName} } from '${sceneMeta.optionsGlobalInterfaceFrom || 'vona'}';`
    : `import '${sceneMeta.optionsGlobalInterfaceFrom || 'vona'}';`
}
declare module '${sceneMeta.optionsGlobalInterfaceFrom || 'vona'}' {
  ${contentRecordsGlobal.length > 0 ? exportRecordsMiddlewareGlobal : ''}
  ${contentRecordsLocal.length > 0 ? exportRecordsMiddlewareLocal : ''}
}
declare module 'vona-module-${moduleName}' {
  ${contentScopes.join('\n')} 
}
/** ${sceneName}: end */
`;
  return content;
}
