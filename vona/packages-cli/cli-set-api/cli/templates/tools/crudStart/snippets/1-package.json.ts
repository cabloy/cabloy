import { metadataCustomSnippet } from '@cabloy/cli';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    fileVersion: number;
  }
}

export default metadataCustomSnippet({
  file: 'package.json',
  language: 'json',
  async transform({ ast, argv }) {
    argv.fileVersion = ast.vonaModule.fileVersion = 1 + (ast.vonaModule.fileVersion ?? 0);
    return ast;
  },
});
