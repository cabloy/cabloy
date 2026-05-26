import { metadataCustomSnippet } from '@cabloy/cli';

const __regPropsReplace = /(interface [^<]*Props) ([(extends)|{])/;
const __regModelsReplace = /(interface [^<]*Models) \{/;

declare module '@cabloy/cli' {
  export interface ICommandArgv {
    controllerFileName: string;
  }
}

export default metadataCustomSnippet({
  file: ({ argv }) => {
    return argv.controllerFileName;
  },
  language: 'plain',
  async transform({ ast }) {
    // Props
    ast = ast.replace(__regPropsReplace, (_, $1, $2) => {
      return `${$1}<_T = unknown> ${$2}`;
    });
    // Models
    ast = ast.replace(__regModelsReplace, (_, $1) => {
      return `${$1}<_T = unknown> {`;
    });
    // ok
    return ast;
  },
});
