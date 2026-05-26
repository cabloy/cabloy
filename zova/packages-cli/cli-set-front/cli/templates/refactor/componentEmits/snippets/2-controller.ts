import { metadataCustomSnippet } from '@cabloy/cli';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    controllerFileName: string;
    controllerClassName: string;
  }
}

const __regProps = /interface Controller[^<]*Props<(.*?)>/;

export default metadataCustomSnippet({
  file: ({ argv }) => {
    return argv.controllerFileName;
  },
  language: 'plain',
  async transform({ ast, argv }) {
    if (ast.includes(`${argv.controllerClassName}Emits`)) {
      throw new Error('Emits exists');
    }
    const matchGeneric = ast.match(__regProps);
    const hasGeneric = !!matchGeneric;
    const genericT = hasGeneric ? '<T = unknown>' : '';
    // Emits
    ast = ast.replace('@Controller', `export interface ${argv.controllerClassName}Emits${genericT} {}\n\n@Controller`);
    // ok
    return ast;
  },
});
