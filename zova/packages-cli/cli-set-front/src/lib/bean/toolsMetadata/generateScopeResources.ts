import type { IGlobBeanFile, OnionSceneMeta } from '@cabloy/module-info';

import { toUpperCaseFirstChar } from '@cabloy/word-utils';

export async function generateScopeResources(
  globFiles: IGlobBeanFile[],
  sceneName: string,
  _sceneMeta: OnionSceneMeta,
  _moduleName: string,
  _modulePath: string,
) {
  const sceneNameCapitalize = toUpperCaseFirstChar(sceneName);
  if (globFiles.length === 0) return '';
  //
  const contentImports: string[] = [];
  const contentRecords: string[] = [];
  for (const globFile of globFiles) {
    const { fileNameJSRelative, className, beanName, isIgnore } = globFile;
    if (isIgnore) continue;
    contentImports.push(`import { ${className} } from '${fileNameJSRelative}';`);
    contentRecords.push(`'${beanName}': ${className};`);
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
