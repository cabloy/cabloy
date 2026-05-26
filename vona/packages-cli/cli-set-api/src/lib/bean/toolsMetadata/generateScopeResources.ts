import type { OnionSceneMeta } from '@cabloy/module-info';

import { replaceTemplate, toUpperCaseFirstChar } from '@cabloy/word-utils';

import { globBeanFiles } from './utils.ts';

export async function generateScopeResources(
  sceneName: string,
  sceneMeta: OnionSceneMeta,
  moduleName: string,
  modulePath: string,
) {
  const sceneNameCapitalize = toUpperCaseFirstChar(sceneName);
  const globFiles = await globBeanFiles(sceneName, sceneMeta, moduleName, modulePath);
  if (globFiles.length === 0) return '';
  //
  const contentImports: string[] = [];
  const contentRecords: string[] = [];
  for (const globFile of globFiles) {
    const { fileNameJSRelative, className, beanName, isIgnore } = globFile;
    if (isIgnore) continue;
    contentImports.push(`import type { ${className} } from '${fileNameJSRelative}';`);
    let typeClassName = className;
    if (sceneMeta.scopeResourceTypeTemplate) {
      typeClassName = replaceTemplate(sceneMeta.scopeResourceTypeTemplate, { className })!;
    }
    contentRecords.push(`'${beanName}': ${typeClassName};`);
  }
  if (contentImports.length === 0) return '';
  // combine
  const content = `/** ${sceneName}: begin */
${contentImports.join('\n')}
export interface IModule${sceneNameCapitalize} {
  ${contentRecords.join('\n')}
}
/** ${sceneName}: end */
`;
  return content;
}
