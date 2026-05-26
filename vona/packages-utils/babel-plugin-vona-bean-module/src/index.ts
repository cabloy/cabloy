import type { PluginPass } from '@babel/core';
import type { NodePath, Visitor } from '@babel/traverse';

import { /* template, */ types as t } from '@babel/core';
import { parseInfoFromPath } from '@cabloy/module-info';

interface ContextInfo {
  needBeanInfo: boolean;
}

export interface PluginZovaBeanModuleOptions {
  brandName: 'zova' | 'vona';
}

export default function (_plugin: any, options: PluginZovaBeanModuleOptions) {
  const visitor: Visitor<PluginPass> = {
    Program(path: NodePath<t.Program>, state) {
      const beanInfo = __parseBeanInfo(state);
      if (!beanInfo) return;
      // context
      const context: ContextInfo = {
        needBeanInfo: false,
      };
      // traverse
      path.traverse(createVisitor(context, beanInfo));
      // insertImport
      if (context.needBeanInfo) {
        insertImport(path, options);
      }
    },
  };
  return { visitor };
}

function createVisitor(context: ContextInfo, beanInfo) {
  return {
    ExpressionStatement(path: NodePath<t.ExpressionStatement>) {
      if (!t.isAssignmentExpression(path.node.expression)) return;
      const right = path.node.expression.right;
      if (!t.isCallExpression(right)) return;
      if ((right.callee as t.Identifier).name !== '__decorate') return;
      if (right.arguments.length !== 2) return;
      const decorators = right.arguments[0];
      if (!t.isArrayExpression(decorators)) return;
      const decoratorNode = __createDecoratorNode(beanInfo);
      decorators.elements.push(decoratorNode);
      context.needBeanInfo = true;
    },
  };
}

function insertImport(path: NodePath<t.Program>, options: PluginZovaBeanModuleOptions) {
  const nodeImport = t.importDeclaration(
    [t.importSpecifier(t.identifier('__z_BeanInfo'), t.stringLiteral('BeanInfo'))],
    t.stringLiteral(options.brandName),
  );
  path.get('body')[0].insertBefore(nodeImport);
}

function __parseBeanInfo(state) {
  const sourceFileName = state.file.opts.sourceFileName || state.file.opts.filename || '';
  const moduleName = __getModuleName(sourceFileName);
  if (!moduleName) return;
  return { module: moduleName };
}

function __getModuleName(sourceFileName: string | null | undefined) {
  if (!__checkIfValid(sourceFileName)) return;
  const moduleInfo = parseInfoFromPath(sourceFileName);
  if (!moduleInfo) return;
  return moduleInfo.relativeName;
}

function __createDecoratorNode(beanInfo) {
  const propertyNodeModule = t.objectProperty(
    t.identifier('module'),
    t.stringLiteral(beanInfo.module),
  );
  const objectExpression = t.objectExpression([propertyNodeModule]);
  const callExpression = t.callExpression(t.identifier('__z_BeanInfo'), [objectExpression]);
  return callExpression;
}

// function __applyDecorator(expression: t.CallExpression, moduleName: string) {
//   const propertyNode = t.objectProperty(t.identifier('module'), t.stringLiteral(moduleName));
//   const args = expression.arguments;
//   if (args.length === 0) {
//     const objectExpression = t.objectExpression([propertyNode]);
//     args.push(objectExpression);
//   } else {
//     const objectExpression = args[0] as t.ObjectExpression;
//     objectExpression.properties.push(propertyNode);
//   }
// }

function __checkIfValid(fileName?: string | null) {
  if (!fileName) return false;
  return !['src/boot/app/', '.zova/app/', 'src/backend/', '.vona/'].some(item => {
    return fileName.includes(item);
  });
}
