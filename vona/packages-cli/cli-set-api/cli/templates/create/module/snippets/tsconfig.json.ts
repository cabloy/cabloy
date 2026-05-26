import { metadataCustomSnippet } from '@cabloy/cli';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    name: string;
  }
}

export default metadataCustomSnippet({
  file: 'tsconfig.json',
  language: 'json',
  async transform({ /* cli, */ ast, argv }) {
    ast.references.push({
      path: `modules/${argv.name}/tsconfig.build.json`,
    });
    // ok
    return ast;
  },
});
