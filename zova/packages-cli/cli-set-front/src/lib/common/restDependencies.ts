import { isBuiltin } from 'node:module';
import path from 'node:path';
import ts from 'typescript';

export function extractRestDependencies(content: string): string[] {
  const source = ts.createSourceFile('index.d.mts', content, ts.ScriptTarget.Latest);
  // createSourceFile exposes syntax diagnostics at runtime, but not in its public return type.
  const { parseDiagnostics } = source as ts.SourceFile & {
    parseDiagnostics: readonly ts.Diagnostic[];
  };
  if (parseDiagnostics.length) {
    const diagnostic = parseDiagnostics[0];
    const { line, character } = source.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
    throw new Error(
      `Invalid REST declaration at ${source.fileName}:${line + 1}:${character + 1}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`,
    );
  }
  for (const kind of ['path', 'types'] as const) {
    const references = kind === 'path' ? source.referencedFiles : source.typeReferenceDirectives;
    if (references.length) {
      throw new Error(
        `Unsupported REST declaration reference directive: ${kind} ${JSON.stringify(references[0].fileName)}. ` +
          'The current REST bundling workflow does not support this directive.',
      );
    }
  }
  // lib references are compiler-owned, not package dependencies.
  const dependencies = new Set<string>();

  function addDependency(specifier: ts.Node | undefined) {
    if (!specifier) return;
    if (!ts.isStringLiteral(specifier)) {
      throw new Error('Unsupported REST declaration module specifier');
    }
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
    if (!id || id.includes(':')) {
      throw new Error(`Unsupported REST declaration package reference: ${id}`);
    }
    const parts = id.split('/');
    if (id.startsWith('@') && (!parts[0].slice(1) || !parts[1])) {
      throw new Error(`Invalid REST declaration package reference: ${id}`);
    }
    dependencies.add(parts.slice(0, id.startsWith('@') ? 2 : 1).join('/'));
  }

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      addDependency(node.moduleSpecifier);
    } else if (ts.isImportTypeNode(node)) {
      if (!ts.isLiteralTypeNode(node.argument)) {
        throw new Error('Unsupported REST declaration import type');
      }
      addDependency(node.argument.literal);
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      addDependency(node.moduleReference.expression);
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      throw new Error('Unsupported REST declaration dynamic import');
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return Array.from(dependencies).sort();
}
