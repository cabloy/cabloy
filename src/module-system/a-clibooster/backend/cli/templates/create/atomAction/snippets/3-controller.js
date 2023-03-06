const __snippet_body = `
async <%=argv.actionName%>() {
  const res = await this.ctx.service.<%=argv.atomClassNameCapitalize%>.<%=argv.actionName%>({
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
  
    return <%=argv.controllerNameCapitalize%>Controller;
  };
  `,
  async transform({ cli, ast, argv, ctx }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    ast.before(code);
    code = await cli.template.renderContent({ content: __snippet_body });
    if (!ast.has(`const apps = [$_$]`)) {
      ast.replace(`const apps = []`, `const apps = [${code}]`);
    } else {
      ast.replace(`const apps = [$_$]`, `const apps = [$_$, \n ${code}]`);
    }
    // ok
    return ast;
  },
};
