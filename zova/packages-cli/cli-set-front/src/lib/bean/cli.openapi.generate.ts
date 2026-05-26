import type { IModule, IModuleInfo } from '@cabloy/module-info';
import type { OpenAPITSOptions, SchemaObject, TransformNodeOptions } from '@cabloy/openapi-typescript';
import type { ZovaOpenapiConfig, ZovaOpenapiConfigModule } from 'zova-openapi';

import { BeanCliBase } from '@cabloy/cli';
import { extend } from '@cabloy/extend';
import { catchError, matchSelector } from '@cabloy/utils';
import { toLowerCaseFirstChar, toUpperCaseFirstChar } from '@cabloy/word-utils';
import fse from 'fs-extra';
import path from 'node:path';
import { rimraf } from 'rimraf';
import ts from 'typescript';

declare module '@cabloy/cli' {
  interface ICommandArgv {}
}

interface INodeActionInfo {
  api: string;
  apiLower: string;
  action: string;
  operationId: string;
  node: ts.PropertySignature;
  nodeTypeInfo: TypeNodeTypeInfo;
}

interface INodeTypeInfoItem {
  question: boolean;
  nodeType: ts.TypeLiteralNode;
}
type TypeNodeTypeInfo = Record<string, INodeTypeInfoItem>;

interface IAstCache {
  ast: ts.Node[];
  contents: string;
}
type TypeAstCaches = Record<string, IAstCache>;

export class CliOpenapiGenerate extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // config file
    const configFile = path.join(argv.projectPath, 'openapi.config.ts');
    if (!fse.existsSync(configFile)) {
      throw new Error('Please generate config first!');
    }
    const configInstance = await this.helper.importDynamic(configFile);
    const config = (await configInstance.default()) as ZovaOpenapiConfig;
    // modules: not vendor/node_modules
    let moduleNames = argv._;
    if (moduleNames.length === 0) {
      moduleNames = this.modulesMeta.modulesArray
        .filter(item => {
          if (item.info.node_modules || item.info.vendor) return false;
          const configFile = path.join(item.root, 'cli/openapi.config.ts');
          return fse.existsSync(configFile);
        })
        .map(item => item.info.relativeName);
    }
    if (moduleNames.length === 0) return;
    // openapi-typescript
    const openapiTypescript = await import('@cabloy/openapi-typescript');
    // loop
    const total = moduleNames.length;
    const __caches: TypeAstCaches = {};
    for (let index = 0; index < total; index++) {
      const moduleName = moduleNames[index];
      // log
      await this.console.log({
        total,
        progress: index,
        text: moduleName,
      });
      // generate res
      const moduleInfo = this.helper.parseModuleInfo(moduleName);
      const module = this.helper.findModule(moduleName);
      await this._generateOpenapi(total, openapiTypescript, config, moduleInfo, module, __caches);
    }
  }

  async _generateOpenapi(
    total: number,
    openapiTypescript: any,
    config: ZovaOpenapiConfig,
    moduleInfo: IModuleInfo,
    module: IModule,
    __caches: TypeAstCaches,
  ) {
    const { argv } = this.context;
    // config file
    const configFile = path.join(module.root, 'cli/openapi.config.ts');
    if (!fse.existsSync(configFile)) {
      throw new Error(`Please generate config of ${moduleInfo.relativeName} first!`);
    }
    const configInstance = await this.helper.importDynamic(configFile);
    const moduleConfigCli = (await configInstance.default()) as ZovaOpenapiConfigModule;
    const moduleConfig = extend(true, { apiMeta: false, apiSchema: true }, config.default, moduleConfigCli, config.modules[moduleInfo.relativeName]);
    const cache = await this._outputFiles(openapiTypescript, moduleConfig, moduleInfo, module, __caches);
    // generate
    await this._generateApis(openapiTypescript, cache.ast, moduleConfig, moduleInfo, module);
    // tools.metadata
    if (!argv.nometadata || total > 1) {
      await this.helper.invokeCli([':tools:metadata', moduleInfo.relativeName], { cwd: argv.projectPath });
    }
  }

  async _outputFiles(
    openapiTypescript: any,
    moduleConfig: ZovaOpenapiConfigModule,
    _moduleInfo: IModuleInfo,
    module: IModule,
    __caches: TypeAstCaches,
  ) {
    if (!moduleConfig.source) throw new Error('source not found');
    // cache
    let cache = __caches[moduleConfig.source];
    if (!cache) {
      const [ast, error] = await catchError(() => {
        return openapiTypescript.default(moduleConfig.source!, _patchOpenapiTSOptions(moduleConfig.options));
      });
      if (error) {
        error.message = `${error.message}: ${moduleConfig.source}`;
        throw error;
      }
      const contents = openapiTypescript.astToString(ast as any);
      cache = __caches[moduleConfig.source] = { ast: ast as any, contents };
    }
    // rimraf
    await rimraf(path.join(module.root, 'src/api'));
    // rimraf
    await rimraf(path.join(module.root, 'src/apiMeta'));
    // rimraf
    await rimraf(path.join(module.root, 'src/apiSchema'));
    // output: openapi/types.ts
    const outputFile = path.join(module.root, 'src/api/openapi/types.ts');
    await fse.outputFile(outputFile, cache.contents);
    await this.helper.formatFile({ fileName: outputFile });
    // output: openapi/schemas.ts
    const schemasFile = path.join(module.root, 'src/api/openapi/schemas.ts');
    const contentSchemas = this._generateSchemas(cache.ast);
    await fse.outputFile(schemasFile, contentSchemas || 'export {}');
    await this.helper.formatFile({ fileName: schemasFile });
    // output: openapi/baseURL.ts
    const baseURLFile = path.join(module.root, 'src/api/openapi/baseURL.ts');
    await fse.outputFile(
      baseURLFile,
      `import type { ZovaSys } from 'zova';

export const OpenApiBaseURL = (sys: ZovaSys) => {
  return sys.util.getOpenApiBaseURL('OPENAPI_BASE_URL_${module.name.replace('-', '_').toUpperCase()}');
};
`,
    );
    await this.helper.formatFile({ fileName: baseURLFile });
    // output: openapi/index.ts
    const indexFile = path.join(module.root, 'src/api/openapi/index.ts');
    await fse.outputFile(indexFile, "export * from './baseURL.js';\nexport * from './schemas.js';\nexport * from './types.js';");
    await this.helper.formatFile({ fileName: indexFile });
    return cache;
  }

  _generateSchemas(ast: ts.Node[]) {
    const nodeComponents = ast.find(node => ts.isInterfaceDeclaration(node) && node.name.text === 'components') as
      | ts.InterfaceDeclaration
      | undefined;
    if (!nodeComponents) return '';
    const nodeTypeInfoComponents = _parseNodeType(nodeComponents)!;
    if (!nodeTypeInfoComponents.schemas) return '';
    const nodeTypeInfoSchemas = _parseNodeType(nodeTypeInfoComponents.schemas.nodeType)!;
    const typeSchemas: string[] = [];
    for (const key in nodeTypeInfoSchemas) {
      const schemaName = `ApiSchema${key
        .replaceAll('.', '-')
        .split('-')
        .map(item => toUpperCaseFirstChar(item))
        .join('')}`;
      typeSchemas.push(`export type ${schemaName} = components["schemas"]["${key}"];`);
      typeSchemas.push(`export type ${schemaName}Partial = Partial<${schemaName}>;`);
    }
    let contentSchemas = typeSchemas.join('\n');
    if (contentSchemas.includes('components["schemas"]')) {
      contentSchemas = `import type { components } from './types.js';\n${contentSchemas}`;
    }
    contentSchemas = `// eslint-disable\n${contentSchemas}`;
    return contentSchemas;
  }

  async _generateApis(openapiTypescript: any, ast: ts.Node[], moduleConfig: ZovaOpenapiConfigModule, _moduleInfo: IModuleInfo, module: IModule) {
    const nodeApis = this._getNodeApis(ast, moduleConfig);
    if (!nodeApis) return;
    for (const apiName in nodeApis) {
      const apiNameLower = toLowerCaseFirstChar(apiName);
      const nodeApi = nodeApis[apiName];
      const { apiContent, apiMetaContent, apiSchemaContent } = this._generateApi(openapiTypescript, ast, apiName, nodeApi);
      // api
      const apiFile = path.join(module.root, `src/api/${apiNameLower}.ts`);
      await fse.outputFile(apiFile, apiContent);
      await this.helper.formatFile({ fileName: apiFile });
      // apiMeta
      if (moduleConfig.apiMeta) {
        const apiMetaFile = path.join(module.root, `src/apiMeta/${apiNameLower}.ts`);
        await fse.outputFile(apiMetaFile, apiMetaContent);
        await this.helper.formatFile({ fileName: apiMetaFile });
      }
      // apiSchema
      if (moduleConfig.apiSchema) {
        const apiSchemaFile = path.join(module.root, `src/apiSchema/${apiNameLower}.ts`);
        await fse.outputFile(apiSchemaFile, apiSchemaContent);
        await this.helper.formatFile({ fileName: apiSchemaFile });
      }
    }
  }

  _generateAction(openapiTypescript: any, ast: ts.Node[], nodeActionInfo: INodeActionInfo) {
    // pathInfo
    const pathInfo = _getRequestPathInfo(ast, nodeActionInfo);
    // contentTypes
    const contentTypes: string[] = [];
    contentTypes.push(`\n/** ${nodeActionInfo.operationId} */`);
    // name: ApiAction
    const nameApiAction = `Api${nodeActionInfo.api}${nodeActionInfo.action}`;
    // name: path
    const nameRequestPath = `Api${nameApiAction}Path`;
    contentTypes.push(`export const ${nameRequestPath} = '${pathInfo.path}';`);
    contentTypes.push(`export type ${nameRequestPath} = '${pathInfo.path}' `);
    // name: method
    const nameRequestMethod = `Api${nameApiAction}Method`;
    contentTypes.push(`export type ${nameRequestMethod} = '${pathInfo.method}';`);
    // name: params/query/headers
    const parametersInfo: Record<string, { name: string; question: boolean }> = {};
    const nodeTypeInfoParameters = _parseNodeType(nodeActionInfo.nodeTypeInfo.parameters.nodeType)!;
    // authToken
    let contentAuthToken = '';
    if (nodeActionInfo.nodeTypeInfo.authToken) {
      contentAuthToken = ', true';
    } else {
      // should not set false
      // contentAuthToken = ', false';
    }
    for (const key of ['path', 'query', 'header']) {
      if (_isNodeNever(nodeTypeInfoParameters[key].nodeType)) continue;
      const key2 = key === 'path' ? 'params' : key === 'header' ? 'headers' : key;
      const key2Upper = toUpperCaseFirstChar(key2);
      const info = {
        name: `Api${nameApiAction}Request${key2Upper}`,
        question: nodeTypeInfoParameters[key].question,
      };
      parametersInfo[key2] = info;
      contentTypes.push(`export type ${info.name} = paths[${nameRequestPath}][${nameRequestMethod}]['parameters']['${key}'];`);
    }
    // name: request body
    let nameRequestBody = '';
    let nameRequestBodyQuestion: boolean = true;
    let isUpload = false;
    if (!_isNodeNever(nodeActionInfo.nodeTypeInfo.requestBody.nodeType)) {
      nameRequestBody = `Api${nameApiAction}RequestBody`;
      nameRequestBodyQuestion = nodeActionInfo.nodeTypeInfo.requestBody.question;
      const nodeRequestBodyInfo = _parseNodeType(nodeActionInfo.nodeTypeInfo.requestBody.nodeType)!;
      const nodeRequestBodyContentInfo = _parseNodeType(nodeRequestBodyInfo.content.nodeType)!;
      const nodeRequestBodyApplicationJson = nodeRequestBodyContentInfo['application/json'] ?? nodeRequestBodyContentInfo['multipart/form-data'];
      isUpload = !!nodeRequestBodyContentInfo['multipart/form-data'];
      const typeRequestBody = openapiTypescript.astToString(nodeRequestBodyApplicationJson.nodeType);
      contentTypes.push(`export type ${nameRequestBody} = ${typeRequestBody};`);
    }
    // name: response body
    const nameResponseBody = `Api${nameApiAction}ResponseBody`;
    contentTypes.push(
      `export type ${nameResponseBody} = paths[${nameRequestPath}][${nameRequestMethod}]['responses']['200']['content']['application/json']['data'];`,
    );
    // content: options
    const contentOptions: string[] = [];
    let contentOptionsQuestion: boolean = true;
    for (const key of ['params', 'query', 'headers']) {
      const info = parametersInfo[key];
      if (!info) continue;
      if (!info.question) contentOptionsQuestion = false;
      contentOptions.push(`${key}${_q(info.question)}: ${info.name};`);
    }
    const contentOptions2 =
      contentOptions.length > 0
        ? `options${_q(contentOptionsQuestion)}: {\n${contentOptions.join('\n')}\n} & IApiActionOptions,`
        : `options${_q(contentOptionsQuestion)}: IApiActionOptions,`;
    // content: request body
    let contentRequestBody = '';
    if (!['get', 'delete'].includes(pathInfo.method)) {
      if (!nameRequestBody) {
        contentRequestBody = `body${_q(contentOptionsQuestion)}: undefined,`;
      } else {
        if (nameRequestBodyQuestion) {
          contentRequestBody = `body${_q(contentOptionsQuestion)}: ${nameRequestBody} | undefined,`;
        } else {
          contentRequestBody = `body: ${nameRequestBody},`;
        }
      }
    }
    // content: path translate
    const contentPathTranslate = parametersInfo.params
      ? `this.$pathTranslate(${nameRequestPath}, options${_q(contentOptionsQuestion)}.params),`
      : `${nameRequestPath},`;
    // content: comment
    const contentComments = pathInfo.comments && pathInfo.comments.length > 0 ? `/*${pathInfo.comments.join()}*/\n` : '';
    // content: body
    const contentBodyParams = isUpload ? 'this.$formData(body)' : 'body';
    // content: signature
    const contentSignature = `${contentComments}${nodeActionInfo.action}(
      ${contentRequestBody}
      ${contentOptions2}
    ) {
      return this.$fetch.${pathInfo.method}<any, ${nameResponseBody}>(
        ${contentPathTranslate} ${contentRequestBody ? `${contentBodyParams},` : ''}
        this.$configPrepare(OpenApiBaseURL(this.sys), options${contentAuthToken}),
      );
    }\n`;
    return [contentTypes.join('\n'), contentSignature, nodeActionInfo.action, nameRequestPath, pathInfo.method];
  }

  _generateApi(openapiTypescript: any, ast: ts.Node[], apiName: string, nodeApi: Record<string, INodeActionInfo>) {
    const apiNameLower = toLowerCaseFirstChar(apiName);
    const contentTypes: string[] = [];
    const contentSignatures: string[] = [];
    const contentActions: string[] = [];
    const contentApiPaths: string[] = [];
    const contentApiMethods: string[] = [];
    for (const actionName in nodeApi) {
      const nodeActionInfo = nodeApi[actionName];
      const contentAction = this._generateAction(openapiTypescript, ast, nodeActionInfo);
      const [_contentType, _contentSignature, _action, _apiPath, _apiMethod] = contentAction;
      contentTypes.push(_contentType);
      contentSignatures.push(_contentSignature);
      contentActions.push(_action);
      contentApiPaths.push(_apiPath);
      contentApiMethods.push(_apiMethod);
    }
    //
    const contentTypes2 = contentTypes.join('\n');
    const importsType: string[] = [];
    if (contentSignatures.length > 0) importsType.push('OpenApiBaseURL');
    if (contentTypes2.includes('components["schemas"]')) importsType.push('type components');
    if (contentTypes2.includes('paths[')) importsType.push('type paths');
    const contentImportsType = importsType.length > 0 ? `import { ${importsType.join(', ')} } from './openapi/index.js';` : '';
    // apiContent
    const apiContent = `import { Api, BeanApiBase, IApiActionOptions } from 'zova-module-a-api';
${contentImportsType}

${contentTypes2}

@Api()
export class Api${apiName} extends BeanApiBase {
  ${contentSignatures.join('\n')}
}
`;
    // apiMetaContent/apiSchemaContent
    const importsApiPath: string[] = [];
    const contentMetaSignatures: string[] = [];
    const contentSchemaSignatures: string[] = [];
    for (let i = 0; i < contentActions.length; i++) {
      importsApiPath.push(contentApiPaths[i]);
      contentMetaSignatures.push(`get ${contentActions[i]}() {
    return [${contentApiPaths[i]}, '${contentApiMethods[i]}'];
  }
`);
      contentSchemaSignatures.push(`${contentActions[i]}(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(${contentApiPaths[i]}, '${contentApiMethods[i]}', options);
  }
`);
    }
    const contentImportsApiPath = importsApiPath.length > 0 ? `import { ${importsApiPath.join(', ')} } from '../api/${apiNameLower}.js';` : '';
    const apiMetaContent = `import { BeanBase } from 'zova';
import { ApiMeta } from 'zova-module-a-api';
${contentImportsApiPath}

@ApiMeta()
export class ApiMeta${apiName} extends BeanBase {
  ${contentMetaSignatures.join('\n')}
}
`;
    const apiSchemaContent = `import { BeanBase } from 'zova';
import { ApiSchema, IApiSchemaOptions } from 'zova-module-a-api';
${contentImportsApiPath}

@ApiSchema()
export class ApiSchema${apiName} extends BeanBase {
  ${contentSchemaSignatures.join('\n')}
}
`;
    return { apiContent, apiMetaContent, apiSchemaContent };
  }

  _getNodeApis(ast: ts.Node[], moduleConfig: ZovaOpenapiConfigModule) {
    const nodeOperations = ast.find(node => ts.isInterfaceDeclaration(node) && node.name.text === 'operations') as
      | ts.InterfaceDeclaration
      | undefined;
    if (!nodeOperations) return;
    const apis: Record<string, Record<string, INodeActionInfo>> = {};
    for (let index = 0; index < nodeOperations.members.length; index++) {
      const node = nodeOperations.members[index];
      if (!ts.isPropertySignature(node)) continue;
      const operationId = (node.name as ts.Identifier).text;
      if (!_checkOperationIdEnabled(moduleConfig, operationId)) continue;
      let [api, action] = operationId.toString().split('_');
      if (!action) {
        action = api;
        api = 'default';
      }
      if (!apis[api]) {
        apis[api] = {};
      }
      apis[api][action] = {
        api,
        apiLower: toLowerCaseFirstChar(api),
        action,
        operationId,
        node,
        nodeTypeInfo: _parseNodeType(node.type as ts.TypeLiteralNode)!,
      };
    }
    return apis;
  }
}

function _getRequestPathInfo(ast: ts.Node[], nodeActionInfo: INodeActionInfo) {
  const nodePaths = ast.find(node => ts.isInterfaceDeclaration(node) && node.name.text === 'paths') as ts.InterfaceDeclaration | undefined;
  if (!nodePaths) throw new Error('paths not found');
  let path;
  let method;
  let comments;
  const nodePath = nodePaths.members.find(node => {
    if (!ts.isPropertySignature(node)) return false;
    if (!node.type || !ts.isTypeLiteralNode(node.type)) return false;
    path = (node.name as ts.StringLiteral).text;
    const nodeMethod = node.type.members.find(item => {
      if (!ts.isPropertySignature(item)) return false;
      if (!item.type || !ts.isIndexedAccessTypeNode(item.type)) return false;
      const operationId = ((item.type.indexType as ts.LiteralTypeNode).literal as ts.StringLiteral).text;
      if (operationId !== nodeActionInfo.operationId) return false;
      method = (item.name as ts.Identifier).text;
      // comment
      const nodeComments = (item as any).emitNode?.leadingComments;
      if (nodeComments) {
        comments = nodeComments.map(nodeComment => nodeComment.text);
      }
      return true;
    });
    return !!nodeMethod;
  }) as ts.PropertySignature | undefined;
  if (!nodePath) throw new Error('path not found');
  return { path, method, comments, nodePath };
}

function _parseNodeType(nodeType?: ts.TypeLiteralNode | ts.InterfaceDeclaration) {
  if (!nodeType || !nodeType.members) return;
  const nodeTypeInfo: TypeNodeTypeInfo = {};
  nodeType.members.forEach(node => {
    if (!ts.isPropertySignature(node)) return;
    const name = (node.name as ts.Identifier).text;
    const value = node.type as ts.TypeLiteralNode;
    nodeTypeInfo[name] = {
      question: !!node.questionToken,
      nodeType: value,
    };
  });
  return nodeTypeInfo;
}

function _isNodeNever(node: ts.Node) {
  return node.kind === ts.SyntaxKind.NeverKeyword;
}

function _q(question: boolean) {
  return question ? '?' : '';
}

function _checkOperationIdEnabled(moduleConfig: ZovaOpenapiConfigModule, selector?: string) {
  if (!selector) return false;
  if (!moduleConfig.operations?.match && !moduleConfig.operations?.ignore) return true;
  return (
    (moduleConfig.operations?.match && matchSelector(moduleConfig.operations?.match, selector)) ||
    (moduleConfig.operations?.ignore && !matchSelector(moduleConfig.operations?.ignore, selector))
  );
}

/**
 * https://github.com/openapi-ts/openapi-typescript/issues/1214
 * https://openapi-ts.dev/node#example-blob-types
 */
const BLOB = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Blob')); // `Blob`
const DATE = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Date')); // `Date`
// const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull()); // `null`
const UNDEFINED = ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword);

function _patchOpenapiTSOptions(options?: OpenAPITSOptions) {
  const transformCustom = options?.transform;
  const postTransformCustom = options?.postTransform;
  return Object.assign(
    {
      defaultNonNullable: false,
    },
    options,
    {
      transform(schemaObject: SchemaObject, options: TransformNodeOptions) {
        if (transformCustom) {
          const res = transformCustom(schemaObject, options);
          if (res !== undefined) return res;
        }
        // multipart
        if (schemaObject.format === 'binary') {
          if (options.path?.includes('multipart~1form-data') || options.path?.includes('application~1octet-stream')) {
            return {
              // schema: schemaObject.nullable
              //   ? ts.factory.createUnionTypeNode([BLOB, NULL])
              //   : BLOB,
              schema: BLOB,
              questionToken: schemaObject.nullable,
            };
          }
        } else if (schemaObject.format && ['date', 'date-time'].includes(schemaObject.format)) {
          return {
            schema: DATE,
            questionToken: schemaObject.nullable,
          };
        }
        // default
        return undefined;
      },
      postTransform(type: ts.TypeNode, options: TransformNodeOptions): ts.TypeNode | undefined {
        if (postTransformCustom) {
          const res = postTransformCustom(type, options);
          if (res !== undefined) return res;
        }
        // path param
        const paramMatched = options.path?.match(/parameters\/path\/([^/]+)$/);
        if (paramMatched) {
          const paramName = paramMatched[1];
          if (options.path?.includes(`{${paramName}?}`)) {
            return ts.factory.createUnionTypeNode([type, UNDEFINED]);
          }
        }
      },
    },
  );
}
