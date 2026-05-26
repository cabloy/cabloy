import type { IGlobBeanFile, OnionSceneMeta } from '@cabloy/module-info';

export async function generateBeanGenerals(
  globFiles: IGlobBeanFile[],
  sceneName: string,
  sceneMeta: OnionSceneMeta,
  moduleName: string,
  _modulePath: string,
) {
  if (globFiles.length === 0) return '';
  //
  const contentImports: string[] = [];
  const contentRecords: string[] = [];
  for (const globFile of globFiles) {
    const { fileNameJSRelative, className, beanName, isIgnore } = globFile;
    const beanFullName = `${moduleName}.${sceneName}.${beanName}`;
    if (isIgnore) continue;
    if (!sceneMeta.scopeResource) {
      contentImports.push(`import { ${className} } from '${fileNameJSRelative}';`);
    }
    contentRecords.push(`'${beanFullName}': ${className};`);
  }
  if (contentRecords.length === 0) return '';
  // combine
  const content = `/** ${sceneName}: begin */
${contentImports.join('\n')}
import 'zova';
declare module 'zova' {
  export interface ${sceneMeta.beanGeneral ? 'IBeanRecordGeneral' : 'IBeanRecordLocal'} {
    ${contentRecords.join('\n')}
  }
}
/** ${sceneName}: end */
`;
  return content;
}
