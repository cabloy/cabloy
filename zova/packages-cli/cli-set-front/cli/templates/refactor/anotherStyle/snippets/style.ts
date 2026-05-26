import { metadataCustomSnippet } from '@cabloy/cli';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    styleName: string;
    styleNameCapitalize: string;
    styleClassName: string;
  }
}

const __regUse = /import \{.*? Use[ ,].*?\} from 'zova';/;

export default metadataCustomSnippet({
  file: 'style.ts',
  language: 'plain',
  async transform({ ast, argv }) {
    const res = ast.match(__regUse);
    if (!res) {
      ast = ast.replace(" } from 'zova';", ", Use } from 'zova';");
    }
    ast = ast
      .replace("from 'zova-module-a-bean';", `from 'zova-module-a-bean';\nimport { ${argv.styleClassName} } from './style.${argv.styleName}.js';`)
      .replace('extends BeanStyleBase {', `extends BeanStyleBase {\n  @Use()\n  $$$$style${argv.styleNameCapitalize}: ${argv.styleClassName};\n`);
    // ok
    return ast;
  },
});
