import type { types as t } from '@babel/core';
import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';

import { combineApiPathControllerAndActionRaw } from '@cabloy/utils';
import { toUpperCaseFirstChar } from '@cabloy/word-utils';

export default async function (options: IMetadataCustomGenerateOptions): Promise<string> {
  const { sceneName, moduleName, globFiles, cli } = options;
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
    const file = cli.helper.gogocode(fileContent, {
      parseOptions: { sourceType: 'module', plugins: ['typescript', 'decorators-legacy'] },
    }).node as t.File;
    const declaration = file.program.body
      .map(statement =>
        statement.type === 'ExportNamedDeclaration' || statement.type === 'ExportDefaultDeclaration'
          ? statement.declaration
          : statement,
      )
      .find(
        (node): node is t.ClassDeclaration =>
          node?.type === 'ClassDeclaration' && node.id?.name === className,
      );
    if (!declaration) continue;
    // controllerPath
    const controllerPath = __parseControllerPath(declaration);
    if (controllerPath === false) continue;
    // actionPath;
    const actionPaths = __parseActionPaths(declaration);
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

function __parseControllerPath(declaration: t.ClassDeclaration): string | false {
  for (const decorator of declaration.decorators ?? []) {
    const call = decorator.expression;
    if (
      call.type !== 'CallExpression' ||
      call.callee.type !== 'Identifier' ||
      call.callee.name !== 'Controller'
    ) {
      continue;
    }
    const argument = call.arguments[0];
    if (!argument) return '';
    if (argument.type === 'StringLiteral') return argument.value;
    if (argument.type !== 'ObjectExpression') return false;
    // Read the last explicit path; a later spread/computed key makes it dynamic.
    for (const property of argument.properties.toReversed()) {
      if (property.type === 'SpreadElement' || property.computed) return false;
      const key = property.key;
      if (
        (key.type === 'Identifier' && key.name === 'path') ||
        (key.type === 'StringLiteral' && key.value === 'path')
      ) {
        return property.type === 'ObjectProperty' && property.value.type === 'StringLiteral'
          ? property.value.value
          : false;
      }
    }
    return '';
  }
  return false;
}

function __parseActionPaths(declaration: t.ClassDeclaration): [string, string][] {
  const actionPaths: [string, string][] = [];
  for (const member of declaration.body.body) {
    if (member.type !== 'ClassMethod') continue;
    for (const decorator of member.decorators ?? []) {
      const call = decorator.expression;
      if (call.type !== 'CallExpression') continue;
      const callee = call.callee;
      if (
        callee.type !== 'MemberExpression' ||
        callee.computed ||
        callee.object.type !== 'Identifier' ||
        callee.object.name !== 'Web' ||
        callee.property.type !== 'Identifier' ||
        !['get', 'post', 'delete', 'put', 'patch'].includes(callee.property.name)
      ) {
        continue;
      }
      const argument = call.arguments[0];
      // Options-only and no-argument decorators map to the root action route.
      // RegExp and other dynamic expressions cannot supply static route metadata.
      if (!argument || argument.type === 'ObjectExpression') {
        actionPaths.push([toUpperCaseFirstChar(callee.property.name), '']);
      } else if (argument.type === 'StringLiteral') {
        actionPaths.push([toUpperCaseFirstChar(callee.property.name), argument.value]);
      }
    }
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
