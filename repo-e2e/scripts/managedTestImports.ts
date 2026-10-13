import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const fixturePath = fileURLToPath(new URL('./managedTest.ts', import.meta.url));
const specRoot = fileURLToPath(new URL('../specs', import.meta.url));

export function managedTestImportViolations(source: string, filename: string): string[] {
  const file = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const errors: string[] = [];
  let usesManagedTest = false;
  const isPlaywright = (value: string) =>
    /^(?:@playwright\/test|playwright(?:-core)?)(?:\/|$)/.test(value);
  const isFixture = (value: string) =>
    value.startsWith('.') &&
    resolve(dirname(filename), value.replace(/\.js$/, '.ts')) === fixturePath;
  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const module = node.moduleSpecifier.text;
      const clause = node.importClause;
      const bindings = clause?.namedBindings;
      const typeOnly =
        clause?.isTypeOnly ||
        (!clause?.name &&
          bindings &&
          ts.isNamedImports(bindings) &&
          bindings.elements.every(item => item.isTypeOnly));
      if (isPlaywright(module) && !typeOnly)
        errors.push('runtime Playwright import bypasses managedTest');
      if (
        isFixture(module) &&
        !clause?.isTypeOnly &&
        bindings &&
        ts.isNamedImports(bindings) &&
        bindings.elements.some(
          item => !item.isTypeOnly && (item.propertyName ?? item.name).text === 'test',
        )
      ) {
        usesManagedTest = true;
      }
    }
    if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      isPlaywright(node.moduleSpecifier.text)
    ) {
      const typeOnly =
        node.isTypeOnly ||
        (node.exportClause &&
          ts.isNamedExports(node.exportClause) &&
          node.exportClause.elements.every(item => item.isTypeOnly));
      if (!typeOnly) errors.push('runtime Playwright export bypasses managedTest');
    }
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === 'require'))
    ) {
      const module = node.arguments[0];
      if (module && ts.isStringLiteral(module) && isPlaywright(module.text))
        errors.push('dynamic Playwright load bypasses managedTest');
    }
    if (
      ts.isImportEqualsDeclaration(node) &&
      !node.isTypeOnly &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      const module = node.moduleReference.expression;
      if (module && ts.isStringLiteral(module) && isPlaywright(module.text))
        errors.push('runtime Playwright import assignment bypasses managedTest');
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  if (!usesManagedTest) errors.push('application spec must import test from managedTest');
  return errors;
}

async function applicationSpecs(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const path = resolve(root, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Managed E2E spec tree cannot contain symlinks');
      if (entry.isDirectory()) return applicationSpecs(path);
      return entry.isFile() && entry.name.endsWith('.spec.ts') ? [path] : [];
    }),
  );
  return files.flat().sort();
}

/** Check every application spec before Playwright can launch a worker/browser. */
export async function assertManagedTestImports(root = specRoot): Promise<void> {
  const specs = await applicationSpecs(root);
  if (specs.length === 0)
    throw new Error('Managed E2E application spec discovery returned no specs');
  for (const spec of specs) {
    const errors = managedTestImportViolations(await readFile(spec, 'utf8'), spec);
    if (errors.length)
      throw new Error(`Managed E2E fixture import violation in ${spec}: ${errors.join('; ')}`);
  }
}
