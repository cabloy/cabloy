const __snippet = `{
  method: 'post',
  path: '<%=argv.atomClassName%>/<%=argv.actionName%>',
  controller: '<%=argv.atomClassName%>',
  meta: { right: { type: 'atom', atomClass: '<%=argv.module%>:<%=argv.atomClassName%>', action: '<%=argv.actionName%>' } },
},`;

module.exports = {
  file: 'backend/src/routes.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    const code = await cli.template.renderContent({ content: __snippet });
    if (!ast.has(`const routes = [$_$]`)) {
      ast.replace(`const routes = []`, `const routes = [${code}]`);
    } else {
      ast.replace(`const routes = [$_$]`, `const routes = [$_$, \n ${code}]`);
    }
    // ok
    return ast;
  },
};
