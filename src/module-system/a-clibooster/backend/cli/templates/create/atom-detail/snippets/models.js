const __snippet_declare = 'const <%=argv.atomClassName%> = require(\'./model/<%=argv.atomClassName%>.js\');\n';
const __snippet_body = '<%=argv.atomClassName%>,';

module.exports = {
  file: 'backend/src/models.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    ast.before(code);
    code = await cli.template.renderContent({ content: __snippet_body });
    ast.replace('const models = {$$$0}', `const models = {${code} \n $$$0}`);
    // ok
    return ast;
  },
};
