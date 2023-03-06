const __snippet_declare = `const <%=argv.controllerName%> = require('./controller/<%=argv.controllerName%>.js');`;
const __snippet_body = `<%=argv.controllerName%>,`;

module.exports = {
  file: 'backend/src/controllers.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    ast.before(code);
    code = await cli.template.renderContent({ content: __snippet_body });
    ast.replace(`const controllers = {$$$0}`, `const controllers = {${code} \n $$$0}`);
    // ok
    return ast;
  },
};
