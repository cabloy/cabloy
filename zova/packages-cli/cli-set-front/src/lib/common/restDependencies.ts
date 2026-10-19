import { isBuiltin } from 'node:module';
import path from 'node:path';
import ts from 'typescript';

export function extractRestDependencies(content: string): string[] {
  const source = ts.createSourceFile('index.d.mts', content, ts.ScriptTarget.Latest);
  const dependencies = new Set<string>();

  function addDependency(specifier: ts.Node | undefined) {
    if (!specifier || !ts.isStringLiteral(specifier)) return;
    const id = specifier.text;
    if (
      id.startsWith('.') ||
      id.startsWith('#') ||
      id.startsWith('\0') ||
      path.isAbsolute(id) ||
      path.win32.isAbsolute(id) ||
      /^[a-z][a-z\d+.-]*:/i.test(id) ||
      isBuiltin(id)
    ) {
      return;
    }
    dependencies.add(
      id
        .split('/')
        .slice(0, id.startsWith('@') ? 2 : 1)
        .join('/'),
    );
  }

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      addDependency(node.moduleSpecifier);
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      addDependency(node.argument.literal);
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      addDependency(node.moduleReference.expression);
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return Array.from(dependencies).sort();
}
