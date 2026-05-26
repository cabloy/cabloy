import type { OnionSceneMeta } from '@cabloy/module-info';

import { globBeanFiles } from './utils.ts';

export async function generateBeanGenerals(
  sceneName: string,
  sceneMeta: OnionSceneMeta,
  moduleName: string,
  modulePath: string,
) {
  const globFiles = await globBeanFiles(sceneName, sceneMeta, moduleName, modulePath);
  if (globFiles.length === 0) return '';
  //
  const contentImports: string[] = [];
  const contentRecords: string[] = [];
  for (const globFile of globFiles) {
    const { fileNameJSRelative, className, beanName, isIgnore } = globFile;
    const beanFullName = `${moduleName}.${sceneName}.${beanName}`;
    if (isIgnore) continue;
    if (!sceneMeta.scopeResource) {
      contentImports.push(`import type { ${className} } from '${fileNameJSRelative}';`);
    }
    contentRecords.push(`'${beanFullName}': ${className};`);
  }
  if (contentRecords.length === 0) return '';
  // combine
  const content = `/** ${sceneName}: begin */
${contentImports.join('\n')}
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    ${contentRecords.join('\n')}
  }
}
/** ${sceneName}: end */
`;
  return content;
}
