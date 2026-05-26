import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';

import { toUpperCaseFirstChar } from '@cabloy/word-utils';

export default async function (options: IMetadataCustomGenerateOptions): Promise<string> {
  const { sceneName, moduleName, globFiles } = options;
  const contentImports: string[] = [];
  const contentFields: string[] = [];
  for (const globFile of globFiles) {
    const { className, beanName, fileNameJSRelative } = globFile;
    const opionsName = `IDtoOptions${toUpperCaseFirstChar(beanName)}`;
    contentImports.push(`import type { ${className} } from '${fileNameJSRelative}';`);
    contentFields.push(`
    export interface ${opionsName} {
      fields?: TypeEntityOptionsFields<${className}, ${opionsName}[TypeSymbolKeyFieldsMore]>;
    }`);
  }
  if (contentFields.length === 0) return '';
  // combine
  const content = `/** ${sceneName}: begin */
${contentImports.join('\n')}
declare module 'vona-module-${moduleName}' {
  ${contentFields.join('\n')}
}
/** ${sceneName}: end */
`;
  return content;
}
