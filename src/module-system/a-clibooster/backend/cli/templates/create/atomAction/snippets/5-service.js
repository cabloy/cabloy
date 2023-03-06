const __snippet_body = `
async <%=argv.actionName%>({ key, user }) {}
`;

module.exports = {
  file: 'backend/src/service/<%=argv.atomClassName%>.js',
  init: `
  module.exports = app => {
    class <%=argv.atomClassNameCapitalize%> extends app.Service {
    }
  
    return <%=argv.atomClassNameCapitalize%>;
  };
  `,
  async transform({ cli, ast, argv, ctx }) {
    // add action
    const code = await cli.template.renderContent({ content: __snippet_body });
    ast.replace(
      `class ${argv.atomClassNameCapitalize} extends app.Service {$$$0}`,
      `class ${argv.atomClassNameCapitalize} extends app.Service {$$$0 \n ${code} }`
    );
    // ok
    return ast;
  },
};
