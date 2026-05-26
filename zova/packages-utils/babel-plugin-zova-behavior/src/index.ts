import type { PluginPass } from '@babel/core';
import type { NodePath, Visitor } from '@babel/traverse';

import { /* template, */ types as t } from '@babel/core';
import { parseFirstWord } from '@cabloy/word-utils';

import { getTag } from './utils.ts';

// interface ComponentFindInfo {
//   import: ImportInfo;
//   component: ComponentInfo;
// }

interface ContextInfo {
  behaviors: boolean;
}

export default function () {
  const visitor: Visitor<PluginPass> = {
    Program(path: NodePath<t.Program>, state) {
      // context
      const context: ContextInfo = {
        behaviors: false,
      };
      // traverse
      path.traverse(createVisitor(context), state);
      if (context.behaviors) {
        // insertImport
        insertImport(path);
      }
    },
  };
  return { visitor };
}

function createVisitor(context: ContextInfo) {
  return {
    JSXElement(path: NodePath<t.JSXElement>, state: PluginPass) {
      const nodePath = path.get('openingElement');
      const { tag } = buildProps(path, state);
      const behaviors: any[] = [];
      for (let index = nodePath.node.attributes.length - 1; index >= 0; index--) {
        const attr = nodePath.node.attributes[index];
        if (!t.isJSXAttribute(attr) || !t.isJSXIdentifier(attr.name)) continue;
        const propName = (attr.name as t.JSXIdentifier).name;
        if (propName === 'bs_all') {
          const expression = (attr.value as t.JSXExpressionContainer)?.expression;
          if (t.isArrayExpression(expression)) {
            behaviors.push(...expression.elements);
          } else {
            behaviors.push(expression);
          }
          nodePath.node.attributes.splice(index, 1);
        } else if (propName.startsWith('bs-')) {
          const onionName = _parseBehaviorName(propName);
          if (onionName) {
            if (!attr.value || t.isStringLiteral(attr.value)) {
              behaviors.push(t.stringLiteral(onionName));
            } else if (t.isJSXExpressionContainer(attr.value)) {
              const objectExpression = t.objectExpression([
                t.objectProperty(
                  t.stringLiteral(onionName),
                  attr.value.expression as t.ObjectExpression,
                ),
              ]);
              behaviors.push(objectExpression);
            }
            nodePath.node.attributes.splice(index, 1);
          }
        }
      }
      if (behaviors.length > 0) {
        nodePath.node.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('behaviors'),
            t.jsxExpressionContainer(t.arrayExpression(behaviors)),
          ),
        );
        // path.get('openingElement').node.name.name
        if (t.isJSXIdentifier(nodePath.node.name)) {
          context.behaviors = true;
          nodePath.node.name.name = 'ZBehavior__';
          const props = [t.objectProperty(t.identifier('component'), tag)];
          if (t.isStringLiteral(tag)) {
            props.push(t.objectProperty(t.identifier('name'), t.stringLiteral(tag.value)));
          }
          const objectExpression = t.objectExpression(props);
          nodePath.node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('behaviorTag'),
              t.jsxExpressionContainer(objectExpression),
            ),
          );
          // -> ()=>{}
          const children = (nodePath.container as any)?.children;
          if (children && children.length > 0 && !_checkIfHasJsxExpression(children)) {
            const expressionArray = t.arrayExpression();
            expressionArray.elements = (nodePath.container as any)?.children;
            const expressionSlot = t.arrowFunctionExpression([], expressionArray);
            const expressionSlotContainer = t.jsxExpressionContainer(expressionSlot);
            (nodePath.container as any).children = [expressionSlotContainer];
          }
        }
      }
    },
  };
}

function _checkIfHasJsxExpression(children: t.JSXElement[]) {
  return children.some(node => t.isJSXExpressionContainer(node));
}

// bs-providerId-moduleName-beanName
function _parseBehaviorName(propName): string | undefined {
  let moduleName;
  const parts = propName.split('-');
  const beanName = parts[parts.length - 1];
  if (parts.length === 2) {
    moduleName = `a-${parseFirstWord(beanName)}`;
  } else if (parts.length === 3) {
    moduleName = `a-${parts[1]}`;
  } else if (parts.length === 4) {
    moduleName = `${parts[1]}-${parts[2]}`;
  }
  if (moduleName) return `${moduleName}:${beanName}`;
}

function insertImport(path: NodePath<t.Program>) {
  const nodeImport = t.importDeclaration(
    [t.importSpecifier(t.identifier('ZBehavior__'), t.stringLiteral('ZBehavior'))],
    t.stringLiteral('zova-module-a-behavior'),
  );
  path.get('body')[0].insertBefore(nodeImport);
}

function buildProps(path: NodePath<t.JSXElement>, state: PluginPass) {
  const tag = getTag(path, state);
  return {
    tag,
  };
}
