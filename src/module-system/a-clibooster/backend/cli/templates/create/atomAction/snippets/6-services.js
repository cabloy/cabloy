const __snippet_declare = `const <%=argv.atomClassName%> = require('./service/<%=argv.atomClassName%>.js');`;
const __snippet_body = `<%=argv.atomClassName%>,`;

module.exports = {
  file: 'backend/src/services.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    const exists = ast.find(code);
    if (exists.length === 0) {
      ast.before(code);
      code = await cli.template.renderContent({ content: __snippet_body });
      ast.replace(`const services = {$$$0}`, `const services = {${code} \n $$$0}`);
    }
    // ok
    return ast;
  },
};
