const __snippet_declare = `const <%=argv.atomClassName%> = require('./atomClass/<%=argv.atomClassName%>.js');\n`;
const __snippet_body = `<%=argv.atomClassName%>: <%=argv.atomClassName%>(app),`;

module.exports = {
  file: 'backend/src/meta/atomClass/atomClasses.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    ast.before(code);
    code = await cli.template.renderContent({ content: __snippet_body });
    ast.replace(`const atomClasses = {$$$0}`, `const atomClasses = {${code} \n $$$0}`);
    // ok
    return ast;
  },
};
