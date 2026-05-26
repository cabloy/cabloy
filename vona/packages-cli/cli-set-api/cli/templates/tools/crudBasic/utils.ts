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
  resources = Object.assign(
    {},
    resources,
    { [argv.resourceNameCapitalize]: argv.resourceNameCapitalize },
    values,
  );
  const keys = Object.keys(resources).sort();
  let content = '';
  for (const key of keys) {
    content += `  ${key}: '${resources[key].replaceAll("'", "\\'")}',\n`;
  }
  ast = `export default {\n${content}};\n`;
  // ok
  return ast;
}
