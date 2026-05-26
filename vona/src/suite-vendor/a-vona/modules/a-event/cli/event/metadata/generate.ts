import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';

export default async function (options: IMetadataCustomGenerateOptions): Promise<string> {
  const { sceneName, globFiles } = options;
  const contentImports: string[] = [];
  const contentRecords: string[] = [];
  for (const globFile of globFiles) {
    const { beanNameCapitalize, beanNameFull, fileNameJSRelative } = globFile;
    const typeData = `TypeEvent${beanNameCapitalize}Data`;
    const typeResult = `TypeEvent${beanNameCapitalize}Result`;
    contentImports.push(`import type { ${typeData}, ${typeResult} } from '${fileNameJSRelative}';`);
    contentRecords.push(`'${beanNameFull}': EventOn<${typeData}, ${typeResult}>;`);
  }
  if (contentImports.length === 0) return '';
  const contentImportEventOn =
    contentImports.length > 0 ? "import type { EventOn } from 'vona-module-a-event';" : '';
  // combine
  const content = `/** ${sceneName}: begin */
${contentImports.join('\n')}
${contentImportEventOn} 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    ${contentRecords.join('\n')}
  }
}
/** ${sceneName}: end */
`;
  return content;
}
