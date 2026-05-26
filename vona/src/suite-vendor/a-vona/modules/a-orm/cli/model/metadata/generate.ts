import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';

import { types as t } from '@babel/core';

import { __parseMagics } from './magic.ts';

export default async function (options: IMetadataCustomGenerateOptions): Promise<string> {
  const { sceneName, moduleName, globFiles, cli } = options;
  const contentRelations: string[] = [];
  const contentRecords: string[] = [];
  const contentModels: string[] = [];
  // const contentModelsOptions: string[] = [];
  for (const globFile of globFiles) {
    const { className, beanName, fileContent, beanNameCapitalize } = globFile;
    const ast = cli.helper.gogocode(fileContent);
    const _reg = `@Model<$$$0>({$$$1})export class ${className} extends $$$2 {}`;
    const astNodes = ast.find(_reg).match.$$$1;
    const entityName = __parseEntityName(__getAstNode(astNodes as any, 'entity'));
    const relations = __parseRelations(__getAstNode(astNodes as any, 'relations'));
    const magics = __parseMagics(cli, ast, globFile, entityName);
    const entityMetaName = `${entityName}Meta`;
    const opionsName = `IModelOptions${beanNameCapitalize}`;
    if (relations && relations.length > 0) {
      contentRelations.push(`export interface ${opionsName} {
        relations: {
          ${relations.join('\n')}
        };
      }`);
    }
    contentRecords.push(`export interface ${className} {
      [SymbolKeyEntity]: ${entityName};
      [SymbolKeyEntityMeta]: ${entityMetaName};
      [SymbolKeyModelOptions]: ${opionsName};
      get<T extends IModelGetOptions<${entityName},${className}>>(where: TypeModelWhere<${entityName}>, options?: T): Promise<TypeModelRelationResult<${entityName}, ${className}, T> | undefined>;
      mget<T extends IModelGetOptions<${entityName},${className}>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<${entityName}, ${className}, T>[]>;
      selectAndCount<T extends IModelSelectParams<${entityName},${className},ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<${entityName}, ${className}, T>>;
      select<T extends IModelSelectParams<${entityName},${className},ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<${entityName}, ${className}, T>[]>;
      insert<T extends IModelInsertOptions<${entityName},${className}>>(data?: TypeModelMutateRelationData<${entityName},${className}, T>, options?: T): Promise<TypeModelMutateRelationData<${entityName},${className}, T, true>>;
      insertBulk<T extends IModelInsertOptions<${entityName},${className}>>(items: TypeModelMutateRelationData<${entityName},${className}, T>[], options?: T): Promise<TypeModelMutateRelationData<${entityName},${className}, T, true>[]>;
      update<T extends IModelUpdateOptions<${entityName},${className}>>(data: TypeModelMutateRelationData<${entityName},${className}, T>, options?: T): Promise<TypeModelMutateRelationData<${entityName},${className}, T>>;
      updateBulk<T extends IModelUpdateOptions<${entityName},${className}>>(items: TypeModelMutateRelationData<${entityName},${className}, T>[], options?: T): Promise<TypeModelMutateRelationData<${entityName},${className}, T>[]>;
      delete<T extends IModelDeleteOptions<${entityName},${className}>>(where?: TypeModelWhere<${entityName}>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<${entityName},${className}>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<${entityName},${className}>>(data?: TypeModelMutateRelationData<${entityName},${className}, T>, options?: T): Promise<TypeModelMutateRelationData<${entityName},${className}, T>>;
      mutateBulk<T extends IModelMutateOptions<${entityName},${className}>>(items: TypeModelMutateRelationData<${entityName},${className}, T>[], options?: T): Promise<TypeModelMutateRelationData<${entityName},${className}, T>[]>;
      count<T extends IModelSelectCountParams<${entityName},${className},ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<${entityName},${className},ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<${entityName},${className},ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<${entityName},${className},ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<${entityName},${className},ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<${entityName}, T>[]>;
      ${magics.join('\n')}
    }`);
    contentModels.push(`'${moduleName}:${beanName}': ${className};`);
    // only override cache.keyAux which not enough
    // contentModelsOptions.push(`export interface ${opionsName} {
    //   cache?: {
    //     keyAux?: keyof ${entityName};
    //   };
    // }`);
  }
  if (contentRelations.length === 0 && contentRecords.length === 0 && contentModels.length === 0)
    return '';
  // combine
  const content = `/** ${sceneName}: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-${moduleName}' {
  ${contentRelations.join('\n')}
  ${contentRecords.join('\n')}
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    ${contentModels.join('\n')}
  }
}
/** ${sceneName}: end */
`;
  return content;
}

function __getAstNode(astNodes: Array<t.ObjectProperty>, name: string) {
  return astNodes.find(node => (node.key as t.Identifier).name === name) as t.ObjectProperty;
}

function __parseEntityName(node: t.ObjectProperty): string {
  return (node.value as t.Identifier).name;
  // const matched = fileContent.match(/@Model<.*?>\(\{[\s\S]*?entity: (Entity\S+)[\s\S]*?\}[\s\S]*?\)\s*export class/);
  // if (!matched) return false;
  // const entityName = matched[1];
  // if (entityName === '') return '';
  // return entityName.split(',')[0];
}

function __parseRelations(node?: t.ObjectProperty) {
  if (!node) return;
  const relations: string[] = [];
  const nodeRelations = node.value as t.ObjectExpression;
  for (const nodeRelation of nodeRelations.properties) {
    relations.push(__parseRelation(nodeRelation as t.ObjectProperty));
  }
  return relations;
}

function __parseRelation(nodeRelation: t.ObjectProperty) {
  const relationName = (nodeRelation.key as t.Identifier).name;
  const callExpression = nodeRelation.value as t.CallExpression;
  const relationType = ((callExpression.callee as t.MemberExpression).property as t.Identifier)
    .name;
  const args: t.Node[] = callExpression.arguments;
  // relation
  if (relationType === 'hasOne') {
    return `${relationName}: ${__parseRelationHasOne(args)};`;
  } else if (relationType === 'belongsTo') {
    return `${relationName}: ${__parseRelationBelongsTo(args)};`;
  } else if (relationType === 'hasMany') {
    return `${relationName}: ${__parseRelationHasMany(args)};`;
  } else if (relationType === 'belongsToMany') {
    return `${relationName}: ${__parseRelationBelongsToMany(args)};`;
  }
  return '';
}

function __parseRelationHasOne(args: t.Node[]) {
  // classModel
  const classModel = __parseRelation_classModel(args[0]);
  // key
  const key = __parseRelation_key(args[1]);
  // options
  const options = __parseRelation_options(args[2]);
  // combine
  return `IModelRelationHasOne<${classModel}, '${key}', ${options.autoload}, ${options.columns}>`;
}

function __parseRelationBelongsTo(args: t.Node[]) {
  // classModelSelf
  const classModelSelf = __parseRelation_classModel(args[0]);
  // classModel
  const classModel = __parseRelation_classModel(args[1]);
  // options
  const options = __parseRelation_options(args[3]);
  // combine
  return `IModelRelationBelongsTo<${classModelSelf}, ${classModel}, ${options.autoload}, ${options.columns}>`;
}

function __parseRelationHasMany(args: t.Node[]) {
  // classModel
  const classModel = __parseRelation_classModel(args[0]);
  // key
  const key = __parseRelation_key(args[1]);
  // options
  const options = __parseRelation_options(args[2]);
  // modelJoins
  const modelJoins = __parseRelation_modelJoins(args[3]);
  // combine
  return `IModelRelationHasMany<${classModel}, '${key}', ${options.autoload}, ${options.columns}, ${modelJoins}, ${options.aggrs}, ${options.groups}>`;
}

function __parseRelationBelongsToMany(args: t.Node[]) {
  // classModelMiddle
  const classModelMiddle = __parseRelation_classModel(args[0]);
  // classModel
  const classModel = __parseRelation_classModel(args[1]);
  // options
  const options = __parseRelation_options(args[4]);
  // modelJoins
  const modelJoins = __parseRelation_modelJoins(args[5]);
  // combine
  return `IModelRelationBelongsToMany<${classModelMiddle}, ${classModel}, ${options.autoload}, ${options.columns},${modelJoins},${options.aggrs},${options.groups}>`;
}

function __parseRelation_classModel(node: t.Node) {
  if (t.isArrowFunctionExpression(node)) {
    return (node.body as t.Identifier).name;
  } else if (t.isIdentifier(node)) {
    return node.name;
  } else if (t.isStringLiteral(node)) {
    return `'${node.value}'`;
  }
  throw new Error('invalid classModel');
}

function __parseRelation_key(node: t.Node) {
  if (t.isStringLiteral(node)) {
    return node.value;
  }
  throw new Error('invalid key');
}

function __parseRelation_modelJoins(node?: t.Node) {
  if (!node) return 'undefined';
  if (t.isIdentifier(node) && node.name === 'undefined') return 'undefined';
  let modelJoins;
  if (t.isArrayExpression(node)) {
    modelJoins = node.elements.map(item => __parseRelation_classModel(item!));
  } else {
    modelJoins = [__parseRelation_classModel(node)];
  }
  return `[${modelJoins.join(',')}]`;
  // const content = `${modelJoins.join('|')}`;
  // return `${content} | Array<${content}>`;
}

function __parseRelation_aggrs(node?: t.Node) {
  if (!node) return 'undefined';
  if (t.isIdentifier(node) && node.name === 'undefined') return 'undefined';
  const aggrs = __parseRelation_aggrs_inner(node as t.ObjectExpression);
  return `{ ${aggrs.join(';')} }`;
}

function __parseRelation_aggrs_inner(node: t.ObjectExpression) {
  const aggrs: string[] = [];
  for (const _nodeProperty of node.properties) {
    const nodeProperty = _nodeProperty as t.ObjectProperty;
    const key = (nodeProperty.key as t.Identifier).name;
    const value = __parseColumns(nodeProperty);
    if (value) {
      aggrs.push(`${key}?: ${__joinColumnsType(value, true)}`);
    }
  }
  return aggrs;
}

function __parseRelation_options(node: t.Node) {
  const options = __parseRelation_options_inner(node);
  let autoload;
  let columns;
  let groups;
  let aggrs;
  // autoload
  if (options?.autoload) {
    autoload = 'true';
  } else {
    autoload = 'false';
  }
  // groups
  if (!options?.groups) {
    groups = 'undefined';
  } else {
    groups = __joinColumnsType(options?.groups, true);
  }
  // aggrs
  if (!options?.aggrs) {
    aggrs = 'undefined';
  } else {
    aggrs = options?.aggrs;
  }
  // columns
  if (!options?.columns) {
    if (options?.groups) {
      columns = 'undefined';
    } else {
      columns = 'undefined'; // '\'*\'';
    }
  } else {
    if (options?.columns.includes('*')) {
      columns = "'*'";
    } else {
      columns = __joinColumnsType(options?.columns, false);
    }
  }
  return { autoload, columns, groups, aggrs };
}

function __parseRelation_options_inner(node: t.Node) {
  if (!node) return undefined;
  if (!t.isObjectExpression(node)) throw new Error('invalid options');
  let autoload;
  let columns: string[] | undefined;
  let groups;
  let aggrs;
  for (const _nodeProperty of node.properties) {
    const nodeProperty = _nodeProperty as t.ObjectProperty;
    const key = (nodeProperty.key as t.Identifier).name;
    if (key === 'autoload') {
      autoload = (nodeProperty.value as t.BooleanLiteral).value;
    } else if (key === 'columns') {
      columns = __parseColumns(nodeProperty);
    } else if (key === 'groups') {
      groups = __parseColumns(nodeProperty);
    } else if (key === 'aggrs') {
      aggrs = __parseRelation_aggrs(nodeProperty.value);
    }
  }
  return { autoload, columns, groups, aggrs };
}

function __parseColumns(node: t.ObjectProperty) {
  if (t.isArrayExpression(node.value)) {
    return node.value.elements.map(item => (item as t.StringLiteral).value);
  } else if (t.isStringLiteral(node.value)) {
    return [node.value.value];
  }
}

function __joinColumnsType(columns: string[], withArray: boolean) {
  const temp = columns.map(item => `'${item}'`).join('|');
  return withArray ? `${temp} | Array<${temp}>` : temp;
}
