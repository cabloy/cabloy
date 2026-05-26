import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';

export default async function (options: IMetadataCustomGenerateOptions): Promise<string> {
  const { sceneName, globFiles } = options;
  const contentImports: string[] = [];
  const contentRecordsGlobal: string[] = [];
  for (const globFile of globFiles) {
    const { className, beanName, fileNameJSRelative, isIgnore, isVirtual } = globFile;
    if (isIgnore || isVirtual) continue;
    const beanFullName = beanName;
    contentImports.push(`import type { ${className} } from '${fileNameJSRelative}';`);
    contentRecordsGlobal.push(`'${beanFullName}': ${className};`);
  }
  if (contentImports.length === 0) return '';
  // combine
  const content = `/** ${sceneName}: begin */
${contentImports.join('\n')}
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    ${contentRecordsGlobal.join('\n')}
  }
}
/** ${sceneName}: end */
`;
  return content;
}
