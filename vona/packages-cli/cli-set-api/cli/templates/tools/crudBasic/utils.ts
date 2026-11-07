import { evaluateSimple } from '@cabloy/utils';

export async function locale_transform({
  ast,
  argv,
  resources,
}: {
  ast: string;
  argv: any;
  resources: any;
}) {
  const values = evaluateSimple(ast.replace('export default', '').replace(';', ''));
  const pendingDescriptions = new Set(
    [...ast.matchAll(/^\s*\/\/ TODO\(mcp-description\): (\w+) -.*$/gm)].map(match => match[1]),
  );
  for (const key of Object.keys(resources)) {
    if (
      key.startsWith(argv.resourceNameCapitalize) &&
      key.endsWith('Description') &&
      !Object.hasOwn(values, key)
    ) {
      pendingDescriptions.add(key);
    }
  }
  resources = Object.assign(
    {},
    resources,
    { [argv.resourceNameCapitalize]: argv.resourceNameCapitalize },
    values,
  );
  const keys = Object.keys(resources).sort();
  let content = '';
  for (const key of keys) {
    if (pendingDescriptions.has(key)) {
      content += `  // TODO(mcp-description): ${key} - refine using the actual Action, DTO and Service behavior.\n`;
    }
    content += `  ${key}: '${resources[key].replaceAll("'", "\\'")}',\n`;
  }
  ast = `export default {\n${content}};\n`;
  // ok
  return ast;
}
