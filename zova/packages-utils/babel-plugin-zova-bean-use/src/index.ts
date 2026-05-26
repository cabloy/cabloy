import type { PluginPass } from '@babel/core';
import type { NodePath, Visitor } from '@babel/traverse';
import type { IModuleInfo } from '@cabloy/module-info';

import { /* template, */ types as t } from '@babel/core';
import { parseInfo } from '@cabloy/module-info';

interface ComponentInfo {
  specifier: t.ImportSpecifier;
  importName: string;
  localName: string;
}

interface ComponentFindInfo {
  import: ImportInfo;
  component: ComponentInfo;
}

interface ImportInfo {
  moduleFullName: string;
  moduleInfo: IModuleInfo;
  components: ComponentInfo[];
  path: NodePath<t.ImportDeclaration>;
}

interface ContextInfo {
  imports: ImportInfo[];
}

export default function () {
  const visitor: Visitor<PluginPass> = {
    Program(path: NodePath<t.Program>) {
      // context
      const context: ContextInfo = {
        imports: [],
      };
      // traverse
      path.traverse(createVisitor(context));
    },
  };
  return { visitor };
}

function createVisitor(context: ContextInfo) {
  return {
    ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
      const moduleFullName = path.node.source.value;
      if (!moduleFullName.startsWith('zova-module-')) return;
      const components: ComponentInfo[] = [];
      if (path.node.importKind === 'type') return;
      for (const specifier of path.node.specifiers) {
        if (
          !t.isImportSpecifier(specifier) ||
          specifier.importKind !== 'value' ||
          !t.isIdentifier(specifier.imported) ||
          isZComponent(specifier.imported.name) ||
          !isUpperCase(specifier.imported.name[0])
        ) {
          continue;
        }
        components.push({
          specifier,
          importName: specifier.imported.name,
          localName: specifier.local.name,
        });
      }
      if (components.length > 0) {
        const _import: ImportInfo = {
          moduleFullName,
          moduleInfo: parseInfo(moduleFullName)!,
          components,
          path,
        };
        context.imports.push(_import);
      }
    },
    ClassProperty(path: NodePath<t.ClassProperty>) {
      if (context.imports.length === 0) return;
      if (!path.node.decorators?.length) return;
      const decorator = path.node.decorators.find(item => {
        const calleeName = getDecoratorCalleeName(item);
        return calleeName && ['Use', 'UseScope'].includes(calleeName);
      });
      if (!decorator) return;
      const calleeName = getDecoratorCalleeName(decorator);
      if (calleeName === 'UseScope') checkUseScope(decorator, path, context);
      if (calleeName === 'Use') checkUse(decorator, path, context);
    },
  };
}

function checkUseScope(
  decorator: t.Decorator,
  path: NodePath<t.ClassProperty>,
  context: ContextInfo,
) {
  if (!t.isCallExpression(decorator.expression)) return;
  // className
  if (!t.isTSTypeAnnotation(path.node.typeAnnotation)) return;
  const tsType = path.node.typeAnnotation;
  const tsTypeName =
    t.isTSTypeReference(tsType.typeAnnotation) &&
    t.isIdentifier(tsType.typeAnnotation.typeName) &&
    tsType.typeAnnotation.typeName.name;
  if (!tsTypeName) return;
  // findComponent
  const componentFindInfo = findComponent(tsTypeName, context);
  if (!componentFindInfo) return;
  // argument: first
  const argument = decorator.expression.arguments[0];
  // argument: none
  if (!argument) {
    decorator.expression.arguments.push(
      t.stringLiteral(componentFindInfo.import.moduleInfo.relativeName),
    );
    componentFindInfo.component.specifier.importKind = 'type';
    return;
  }
  // argument: string
  if (t.isStringLiteral(argument)) {
    componentFindInfo.component.specifier.importKind = 'type';
    return;
  }
  // argument: options
  if (t.isObjectExpression(argument)) {
    const prop = argument.properties.find(
      item => t.isObjectProperty(item) && t.isIdentifier(item.key) && item.key.name === 'module',
    );
    if (!prop) {
      argument.properties.push(
        t.objectProperty(
          t.identifier('module'),
          t.stringLiteral(componentFindInfo.import.moduleInfo.relativeName),
        ),
      );
    }
    componentFindInfo.component.specifier.importKind = 'type';
  }
}

function checkUse(decorator: t.Decorator, path: NodePath<t.ClassProperty>, context: ContextInfo) {
  if (!t.isCallExpression(decorator.expression)) return;
  // className
  if (!t.isTSTypeAnnotation(path.node.typeAnnotation)) return;
  const tsType = path.node.typeAnnotation;
  const tsTypeName =
    t.isTSTypeReference(tsType.typeAnnotation) &&
    t.isIdentifier(tsType.typeAnnotation.typeName) &&
    tsType.typeAnnotation.typeName.name;
  if (!tsTypeName) return;
  // findComponent
  const componentFindInfo = findComponent(tsTypeName, context);
  if (!componentFindInfo) return;
  // argument: first
  const argument = decorator.expression.arguments[0];
  // argument: none
  if (!argument) {
    decorator.expression.arguments.push(t.stringLiteral(combineBeanFullName(componentFindInfo)));
    componentFindInfo.component.specifier.importKind = 'type';
    return;
  }
  // argument: string
  if (t.isStringLiteral(argument)) {
    componentFindInfo.component.specifier.importKind = 'type';
    return;
  }
  // argument: options
  if (t.isObjectExpression(argument)) {
    const prop = argument.properties.find(
      item => t.isObjectProperty(item) && t.isIdentifier(item.key) && item.key.name === 'name',
    );
    if (!prop) {
      argument.properties.push(
        t.objectProperty(
          t.identifier('beanFullName'),
          t.stringLiteral(combineBeanFullName(componentFindInfo)),
        ),
      );
    }
    componentFindInfo.component.specifier.importKind = 'type';
  }
}

function findComponent(nodeName: string, context: ContextInfo): ComponentFindInfo | undefined {
  for (const _import of context.imports) {
    const component = _import.components.find(item => item.localName === nodeName);
    if (component) {
      return {
        import: _import,
        component,
      };
    }
  }
}

function combineBeanFullName(componentFindInfo: ComponentFindInfo) {
  const importName = componentFindInfo.component.importName;
  const scene = parseFirstWord(componentFindInfo.component.importName, true)!;
  const name = toLowerCaseFirstChar(importName.substring(scene?.length));
  return `${componentFindInfo.import.moduleInfo.relativeName}.${scene}.${name}`;
}

function getDecoratorCalleeName(decorator: t.Decorator) {
  return (
    t.isCallExpression(decorator.expression) &&
    t.isIdentifier(decorator.expression.callee) &&
    decorator.expression.callee.name
  );
}

function isZComponent(name: string) {
  return name[0] === 'Z' && isUpperCase(name[1]);
}

function isUpperCase(character) {
  return /^[A-Z]$/.test(character);
}

function _parseFirstWord(str?: string): string | undefined {
  if (!str) return str;
  for (let i = 1; i < str.length; i++) {
    const ch = str.charAt(i);
    if (ch >= 'A' && ch <= 'Z') return str.substring(0, i);
  }
  return str;
}

function parseFirstWord(str?: string, toLowerCase?: boolean): string | undefined {
  const word = _parseFirstWord(str);
  if (!word) return word;
  return toLowerCase ? toLowerCaseFirstChar(word) : word;
}

function toLowerCaseFirstChar(str: string) {
  return str.charAt(0).toLowerCase() + str.substring(1);
}
