const __snippet_declare = "const <%=argv.appKey%> = require('./app/<%=argv.appKey%>.js');\n";
const __snippet_body = '<%=argv.appKey%>,';

module.exports = {
  file: 'backend/src/meta/static/apps.js',
  init: `const apps = [];
module.exports = apps;
`,
  async transform({ cli, ast, ctx }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    ast.before(code);
    code = await cli.template.renderContent({ content: __snippet_body });
    if (!ast.has('const apps = [$_$]')) {
      ast.replace('const apps = []', `const apps = [${code}]`);
    } else {
      ast.replace('const apps = [$_$]', `const apps = [$_$, \n ${code}]`);
    }
    // ok
    return ast;
  },
};
