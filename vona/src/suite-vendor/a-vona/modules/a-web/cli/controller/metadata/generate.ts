import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';

import { combineApiPathControllerAndActionRaw } from '@cabloy/utils';
import { toUpperCaseFirstChar } from '@cabloy/word-utils';

export default async function (options: IMetadataCustomGenerateOptions): Promise<string> {
  const { sceneName, moduleName, globFiles } = options;
  const contentResources: string[] = [];
  const contentImports: string[] = [];
  const contentActions: string[] = [];
  const contentPaths: Record<string, string[]> = {};
  for (const globFile of globFiles) {
    const { className, beanName, fileNameJSRelative, fileContent } = globFile;
    const opionsName = `IControllerOptions${toUpperCaseFirstChar(beanName)}`;
    if (fileContent.includes('@Resource()')) {
      contentResources.push(`'${moduleName}:${beanName}': never;`);
    }
    contentImports.push(
      `// @ts-ignore ignore\nimport type { ${className} } from '${fileNameJSRelative}';`,
    );
    contentActions.push(`
    export interface ${opionsName} {
      actions?: TypeControllerOptionsActions<${className}>;
    }`);
    // controllerPath
    const controllerPath = __parseControllerPath(fileContent);
    if (controllerPath === false) continue;
    // actionPath;
    const actionPaths = __parseActionPaths(fileContent);
    for (const [method, actionPath] of actionPaths) {
      if (!contentPaths[method]) contentPaths[method] = [];
      const apiPath = __combineApiPath(moduleName, controllerPath, actionPath);
      if (!apiPath.includes(':')) {
        contentPaths[method].push(`'${apiPath}': undefined;`);
      } else {
        // const apiPath1 = apiPath.replace(/(:[^/]+)/g, (_, _part) => {
        //   return ':_string_';
        // });
        // const apiPath2 = apiPath.replace(/(\/:[^/]+)/g, (_, part) => {
        //   return `:{${part.substring(2)}}`;
        // });
        // const apiPath3 = apiPath.replace(/(:[^/]+)/g, (_, _part) => {
        //   return '${string}';
        // });
        // contentPaths[method].push(`'${apiPath1}': '${apiPath2}'`);
        contentPaths[method].push(`'${apiPath}': undefined;`);
      }
    }
  }
  let contentRecord = '';
  for (const method in contentPaths) {
    contentRecord += `export interface IApiPath${method}Record{
        ${contentPaths[method].join('\n')}
    }\n`;
  }
  const contentRecord2 = contentRecord
    ? `declare module 'vona-module-a-web' {
  ${contentRecord}
}`
    : '';
  const contentResources2 =
    contentResources.length > 0
      ? `import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      ${contentResources.join('\n')}
    }
  }
  `
      : '';
  // combine
  const content = `/** ${sceneName}: begin */
${contentImports.join('\n')}
declare module 'vona-module-${moduleName}' {
  ${contentActions.join('\n')}
}
${contentRecord2}
${contentResources2}
/** ${sceneName}: end */
`;
  return content;
}

function __parseControllerPath(fileContent: string): string | false {
  let matched = fileContent.match(
    /@Controller<.*?>\(\{[\s\S]*?path: ('[^']*')[\s\S]*?\}[\s\S]*?\)\s*export class/,
  );
  if (!matched) {
    matched = fileContent.match(/@Controller<.*?>\(([^)]*)\)/);
  }
  if (!matched) return false;
  const controllerPath = matched[1];
  if (controllerPath === '') return '';
  return controllerPath.split(',')[0].replaceAll("'", '');
}

function __parseActionPaths(fileContent: string): [string, string][] {
  const actionPaths: [string, string][] = [];
  const matches = fileContent.match(
    /(@Web\.get|@Web\.post|@Web\.delete|@Web\.put|@Web\.patch)\([\s\S]*?\)/g,
  );
  if (!matches) return [];
  for (const match of matches) {
    const matches2 = match.match(/@([^(]*)\(([\s\S]*?)\)/);
    if (!matches2) throw new Error('parse action path error');
    let actionPath = matches2[2];
    if (actionPath !== '' && !actionPath.startsWith("'")) continue; // exclude regexp
    if (actionPath.startsWith("'")) {
      const pos = actionPath.indexOf("'", 1);
      actionPath = actionPath.substring(1, pos);
    }
    const method = toUpperCaseFirstChar(matches2[1].substring(4));
    actionPaths.push([method, actionPath]);
  }
  return actionPaths;
}

function __combineApiPath(
  moduleName: string,
  controllerPath: string | undefined,
  actionPath: RegExp | string | undefined,
) {
  return combineApiPathControllerAndActionRaw(moduleName, controllerPath, actionPath, true);
}
