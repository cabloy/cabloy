const __snippet_declare = `const <%=argv.atomClassName%> = require('./schema/<%=argv.atomClassName%>.js');\n`;
const __snippet_body = `// <%=argv.atomClassName%>
Object.assign(schemas, <%=argv.atomClassName%>(app));`;

module.exports = {
  file: 'backend/src/meta/validation/schemas.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    ast.before(code);
    code = await cli.template.renderContent({ content: __snippet_body });
    ast.find('const schemas = {};').after(code);
    // ok
    return ast;
  },
};
