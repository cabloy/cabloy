const __snippet_body = `
async <%=argv.actionName%>() {
  const res = await this.ctx.service.<%=argv.atomClassName%>.<%=argv.actionName%>({
    key: this.ctx.request.body.key,
    user: this.ctx.state.user.op,
  });
  this.ctx.success(res);
}
`;

module.exports = {
  file: 'backend/src/controller/<%=argv.atomClassName%>.js',
  init: `
  module.exports = app => {
    class <%=argv.atomClassNameCapitalize%>Controller extends app.Controller {
    }
  
    return <%=argv.atomClassNameCapitalize%>Controller;
  };
  `,
  async transform({ cli, ast, argv, ctx }) {
    // add action
    const code = await cli.template.renderContent({ content: __snippet_body });
    ast.replace(
      `class ${argv.atomClassNameCapitalize}Controller extends app.Controller {$$$0}`,
      `class ${argv.atomClassNameCapitalize}Controller extends app.Controller {$$$0 \n ${code} }`
    );
    // ok
    return ast;
  },
};
