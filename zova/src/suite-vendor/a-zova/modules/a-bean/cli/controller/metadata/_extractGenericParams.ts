import fs from 'node:fs';
import ts from 'typescript';

export function extractGenericParamsAndImports(filePath: string, interfaceName: string) {
  const sourceText = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  // 1. Find the target interface
  let targetInterface: ts.InterfaceDeclaration | undefined;
  ts.forEachChild(sourceFile, node => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
      targetInterface = node;
    }
  });
  if (!targetInterface?.typeParameters) {
    return { genericParams: '', imports: [] as string[] };
  }

  // 2. Extract generic parameters text
  const genericParams = targetInterface.typeParameters.map(tp => tp.getText(sourceFile)).join(', ');

  // 3. Collect type reference identifiers within generic parameters
  const typeRefNames = new Set<string>();
  const visit = (node: ts.Node) => {
    if (ts.isTypeReferenceNode(node)) {
      // For qualified names like A.B, only take the leftmost identifier
      const id = ts.isQualifiedName(node.typeName) ? node.typeName.left : node.typeName;
      typeRefNames.add(id.getText(sourceFile));
    }
    ts.forEachChild(node, visit);
  };
  targetInterface.typeParameters.forEach(tp => visit(tp));

  // Exclude the generic parameter names themselves (TParentData, TComponentName, etc.)
  for (const tp of targetInterface.typeParameters) {
    typeRefNames.delete(tp.name.text);
  }

  // 4. Match type references to import statements
  const imports: string[] = [];
  ts.forEachChild(sourceFile, node => {
    if (!ts.isImportDeclaration(node)) return;
    const clause = node.importClause;
    if (!clause?.namedBindings || !ts.isNamedImports(clause.namedBindings)) return;

    const matched = clause.namedBindings.elements
      .map(el => el.name.text)
      .filter(name => typeRefNames.has(name));
    if (matched.length === 0) return;

    const specifier = (node.moduleSpecifier as ts.StringLiteral).text;
    const prefix = clause.isTypeOnly ? 'type ' : '';
    imports.push(`import ${prefix}{ ${matched.join(', ')} } from '${specifier}';`);
  });

  return { genericParams, imports };
}

// // --- Demo ---
// const result = extractGenericParamsAndImports(
//   import.meta.url.replace('file://', '').replace(/_extractGenericParams\.ts$/, 'controller.tsx'),
//   'ControllerFormFieldPresetProps',
// );
// console.log('Generic params:', result.genericParams);
// console.log('Imports:');
// result.imports.forEach(imp => console.log(' ', imp));
