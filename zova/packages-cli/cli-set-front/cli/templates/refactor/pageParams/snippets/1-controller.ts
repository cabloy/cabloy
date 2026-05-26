import { metadataCustomSnippet } from '@cabloy/cli';

export default metadataCustomSnippet({
  file: ({ argv }) => {
    return argv.controllerFileName;
  },
  language: 'plain',
  async transform({ ast, argv }) {
    // check if exists
    if (ast.includes(`${argv.controllerClassName}SchemaParams`)) throw new Error('Params exists');
    // z
    if (!ast.includes("import { z } from 'zod';")) {
      ast = `import { z } from 'zod';\n${ast}`;
    }
    // export
    ast = ast.replace('@Controller', `export const ${argv.controllerClassName}SchemaParams = z.object({});\n\n@Controller`);
    // ok
    return ast;
  },
});
