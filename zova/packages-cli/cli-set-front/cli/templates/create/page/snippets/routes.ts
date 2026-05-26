import { metadataCustomSnippet } from '@cabloy/cli';

const __snippet_declare = "import { ZPage<%=argv.nameMeta.fullCapitalize%> } from './.metadata/page/<%=argv.pageName%>.js';\n";
const __snippet_body = '{ path: \'<%=argv.moduleInfo.name!==argv.pageName?argv.pageName:""%>\', component: ZPage<%=argv.nameMeta.fullCapitalize%> },';

export default metadataCustomSnippet({
  file: 'src/routes.ts',
  init: `import { IModuleRoute } from 'zova-module-a-router';

export const routes: IModuleRoute[] = [];
`,
  async transform({ cli, ast }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    ast.before(code);
    code = await cli.template.renderContent({ content: __snippet_body });
    if (!ast.has('export const routes: IModuleRoute[] = [$_$]')) {
      ast.replace('export const routes: IModuleRoute[] = []', `export const routes: IModuleRoute[] = [${code}]`);
    } else {
      ast.replace('export const routes: IModuleRoute[] = [$_$]', `export const routes: IModuleRoute[] = [$_$, \n ${code}]`);
    }
    // ok
    return ast;
  },
});
