import { metadataCustomSnippet } from '@cabloy/cli';

const __regProps = /interface Controller[^<]*Props<(.*?)>/;

export default metadataCustomSnippet({
  file: ({ argv }) => {
    return argv.controllerFileName;
  },
  language: 'plain',
  async transform({ ast, argv }) {
    if (ast.includes(`${argv.controllerClassName}Slots`)) {
      throw new Error('Slots exists');
    }
    const matchGeneric = ast.match(__regProps);
    const hasGeneric = !!matchGeneric;
    const genericT = hasGeneric ? '<T = unknown>' : '';
    // Slots
    ast = ast.replace('@Controller', `export interface ${argv.controllerClassName}Slots${genericT} {}\n\n@Controller`);
    // ok
    return ast;
  },
});
