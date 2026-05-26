import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';
import type { IGlobBeanFile } from '@cabloy/module-info';

import { combineResourceName } from '@cabloy/utils';
import { toUpperCaseFirstChar } from '@cabloy/word-utils';
import fse from 'fs-extra';
import path from 'node:path';

import type { IControllerInfo } from './types.ts';

export async function generateMetaPage(
  options: IMetadataCustomGenerateOptions,
  globFiles: [IGlobBeanFile, IControllerInfo][],
) {
  if (globFiles.length === 0) return '';
  const { moduleName } = options;
  const contentImports: string[] = [];
  const contentImportsRest: string[] = [];
  const contentNameRecords: string[] = [];
  const contentPathRecords: string[] = [];
  const contentPathRecordsRest: string[] = [];
  const contentPathSchemas: string[] = [];
  const contentNameSchemas: string[] = [];
  const contentRecords: string[] = [];
  const srcDirRest = path.join(options.cli.context.argv.projectPath, '.zova-rest');
  for (const [globFile, controllerInfo] of globFiles) {
    const { className } = globFile;
    const { name, hasSchemaParams, hasSchemaQuery } = controllerInfo;
    const namespace = `NS${className}`;
    const namespaceRest = _combineModuleNameControllerName(moduleName, className);
    contentImports.push(`export * from './page/${name}.js';`);
    if (hasSchemaParams || hasSchemaQuery) {
      contentImports.push(`import { ${namespace} } from './page/${name}.js';`);
      // rest
      const restIndexFileRelative = path.relative(
        srcDirRest,
        path.join(options.modulePath, `src/.metadata/page/${name}.js`),
      );
      contentImportsRest.push(
        `import { ${namespace} as ${namespaceRest} } from '${restIndexFileRelative}';`,
      );
    }
    // controller.tsx
    const { routePath, routeName } = _extractRoutePathOrName(options, globFile, controllerInfo);
    // no matter that: route.meta?.absolute
    const routePathFull = routePath
      ? `/${moduleName.replace('-', '/')}/${routePath}`
      : `/${moduleName.replace('-', '/')}`;
    const routeNameFull = `${moduleName}:${routeName}`;
    contentPathRecords.push(
      _combineContentPathRecord(routePathFull, hasSchemaParams, hasSchemaQuery, namespace),
    );
    contentPathRecordsRest.push(
      _combineContentPathRecord(routePathFull, hasSchemaParams, hasSchemaQuery, namespaceRest),
    );
    if (!routeName) {
      // contentPathRecords.push(_combineContentPathRecord(routePathFull, hasSchemaParams, hasSchemaQuery, className));
    } else {
      //
      // const apiPath1 = routePathFull.replace(/(:[^/]+)/g, (_, _part) => {
      //   return ':_string_';
      // });
      // const apiPath2 = routePathFull.replace(/(\/:[^/]+)/g, (_, part) => {
      //   return `:{${part.substring(2)}}`;
      // });
      // const apiPath3 = routePathFull.replace(/(:[^/]+)/g, (_, _part) => {
      //   return '${string}';
      // });
      // contentPathRecords.push(_combineContentPathRecord(apiPath1, `'${apiPath2}'`, hasSchemaQuery, className));
      // contentPathRecords.push(_combineContentPathRecord(routePathFull, `\`${apiPath3}\``, hasSchemaQuery, className));
      // contentPathRecords.push(_combineContentPathRecord(routePathFull, hasSchemaParams, hasSchemaQuery, className));
      //
      contentNameRecords.push(`'${routeNameFull}': undefined;`);
    }
    // schema
    if (!routeName) {
      if (hasSchemaQuery) {
        contentPathSchemas.push(`'${routePathFull}': {
          query: ${namespace}.querySchema,
        },`);
      }
    } else {
      if (hasSchemaQuery || hasSchemaParams) {
        contentNameSchemas.push(`'${routeNameFull}': {
          ${hasSchemaParams ? `params: ${namespace}.paramsSchema,` : ''}
          ${hasSchemaQuery ? `query: ${namespace}.querySchema,` : ''}
        },`);
      }
    }
    //
    const _contentRecords_parts: string[] = [];
    if (hasSchemaParams) _contentRecords_parts.push(`$params: ${namespace}.ParamsOutput;`);
    if (hasSchemaQuery) _contentRecords_parts.push(`$query: ${namespace}.QueryOutput;`);
    if (_contentRecords_parts.length > 0) {
      contentRecords.push(`export interface ${className} {
        ${_contentRecords_parts.join('\n')}
      }`);
    }
  }
  // combine
  const content = `/** pages: begin */
${contentImports.join('\n')}
export * from '../routes.js';
${contentPathRecords.length > 0 ? "import { TypePagePathSchema } from 'zova-module-a-router';" : ''}
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  ${contentPathRecords.join('\n')}
}
export interface IPageNameRecord {
  ${contentNameRecords.join('\n')}
}
}
export const pagePathSchemas = {
${contentPathSchemas.join('\n')}
};
export const pageNameSchemas = {
${contentNameSchemas.join('\n')}
};
declare module 'zova-module-${moduleName}' {
  ${contentRecords.join('\n')}
}
/** pages: end */
`;
  return content;
}

function _combineModuleNameControllerName(moduleName: string, className: string) {
  return `NS${toUpperCaseFirstChar(combineResourceName(className, moduleName, false, false))}`;
}

function _extractRoutePathOrName(
  options: IMetadataCustomGenerateOptions,
  _globFile: IGlobBeanFile,
  controllerInfo: IControllerInfo,
) {
  const cli = options.cli;
  const targetFile = path.join(options.modulePath, 'src/routes.ts');
  const content = fse.readFileSync(targetFile).toString('utf8');
  const ast = cli.helper.gogocode(content);
  if (!ast || !ast.find) {
    // eslint-disable-next-line
    console.log(targetFile);
  }
  const astNode = ast.find('export const routes: IModuleRoute[] = [$_$]');
  const astMatches = astNode.match[0];
  const astMatch = astMatches.find(item => {
    return (item.node as any).properties.some(prop => {
      return (
        prop.key.name === 'component' &&
        (prop.value.name === controllerInfo.nameCapitalize ||
          prop.value.name === `ZPage${controllerInfo.nameCapitalize}`)
      );
    });
  });
  if (!astMatch) {
    throw new Error(`page route not found: ${controllerInfo.nameCapitalize}`);
  }
  const astPropPath = (astMatch?.node as any)?.properties.find(prop => {
    return prop.key.name === 'path';
  });
  const routePath = astPropPath?.value.value || '';
  const astPropName = (astMatch?.node as any)?.properties.find(prop => {
    return prop.key.name === 'name';
  });
  const routeName = astPropName?.value.value;
  return { routePath, routeName };
}

function _combineContentPathRecord(
  key: string,
  hasSchemaParams,
  hasSchemaQuery: boolean,
  namespace: string,
) {
  return `'${key}': TypePagePathSchema<${hasSchemaParams ? `${namespace}.ParamsInput` : 'undefined'},${hasSchemaQuery ? `${namespace}.QueryInput` : 'undefined'}>;`;
  // return `'${key}': {
  //   path: ${value},
  //   schema: ${hasSchemaQuery ? `${namespace}.QueryInput` : 'undefined'},
  // };`;
}
