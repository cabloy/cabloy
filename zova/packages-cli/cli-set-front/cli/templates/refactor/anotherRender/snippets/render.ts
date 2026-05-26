import { metadataCustomSnippet } from '@cabloy/cli';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    renderName: string;
    renderNameCapitalize: string;
    renderClassName: string;
  }
}

const __regUse = /import \{.*? Use[ ,].*?\} from 'zova';/;

export default metadataCustomSnippet({
  file: 'render.tsx',
  language: 'plain',
  async transform({ ast, argv }) {
    const res = ast.match(__regUse);
    if (!res) {
      ast = ast.replace(" } from 'zova';", ", Use } from 'zova';");
    }
    ast = ast
      .replace("from 'zova-module-a-bean';", `from 'zova-module-a-bean';\nimport { ${argv.renderClassName} } from './render.${argv.renderName}.jsx';`)
      .replace(
        'extends BeanRenderBase {',
        `extends BeanRenderBase {\n  @Use()\n  $$$$render${argv.renderNameCapitalize}: ${argv.renderClassName};\n`,
      );
    // ok
    return ast;
  },
});
