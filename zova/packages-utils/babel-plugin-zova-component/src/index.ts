import type { PluginPass } from '@babel/core';
import type { NodePath, Visitor } from '@babel/traverse';
import type { IModuleInfo } from '@cabloy/module-info';

import { /* template, */ types as t } from '@babel/core';
import { parseInfo } from '@cabloy/module-info';

interface ComponentInfo {
  importName: string;
  localName: string;
}

// interface ComponentFindInfo {
//   import: ImportInfo;
//   component: ComponentInfo;
// }

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
      if (context.imports.length === 0) return;
      // insertComponents
      insertComponents(path, context);
      // insertImport
      insertImport(path);
      // removeImports
      removeImports(context);
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
      for (const specifier of path.node.specifiers) {
        if (
          !t.isImportSpecifier(specifier) ||
          specifier.importKind !== 'value' ||
          !t.isIdentifier(specifier.imported) ||
          !isZComponent(specifier.imported.name)
        ) {
          continue;
        }
        components.push({
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
  };
}

function isZComponent(name: string) {
  return name[0] === 'Z' && isUpperCase(name[1]);
}

function isUpperCase(character) {
  return /^[A-Z]$/.test(character);
}

function removeImports(context: ContextInfo) {
  for (const _import of context.imports) {
    for (const component of _import.components) {
      const index = _import.path.node.specifiers.findIndex(
        item => item.local.name === component?.localName,
      );
      _import.path.node.specifiers.splice(index, 1);
    }
    if (_import.path.node.specifiers.length === 0) {
      _import.path.remove();
    }
  }
}

function insertImport(path: NodePath<t.Program>) {
  const nodeImport = t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier('__z_createZovaComponentAsync'),
        t.stringLiteral('createZovaComponentAsync'),
      ),
    ],
    t.stringLiteral('zova'),
  );
  path.get('body')[0].insertBefore(nodeImport);
}

function insertComponents(path: NodePath<t.Program>, context: ContextInfo) {
  for (const _import of context.imports) {
    for (const component of _import.components) {
      const nodeComponent = t.variableDeclaration('const', [
        t.variableDeclarator(
          t.identifier(component.localName),
          t.callExpression(t.identifier('__z_createZovaComponentAsync'), [
            t.stringLiteral(_import.moduleInfo.relativeName),
            t.stringLiteral(parseRealComponentName(component.importName)),
          ]),
        ),
      ]);
      path.get('body')[0].insertBefore(nodeComponent);
    }
  }
}

function parseRealComponentName(name: string) {
  return firstCharToLowerCase(name.substring(1));
}

function firstCharToLowerCase(name: string) {
  return name.charAt(0).toLowerCase() + name.substring(1);
}
