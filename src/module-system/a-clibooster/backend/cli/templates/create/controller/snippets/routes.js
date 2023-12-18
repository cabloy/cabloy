const __snippet = `// <%=argv.controllerName%>
{ method: 'post', path: '<%=argv.controllerName%>/action', controller: '<%=argv.controllerName%>' },`;

module.exports = {
  file: 'backend/src/routes.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    const code = await cli.template.renderContent({ content: __snippet });
    if (!ast.has('const routes = [$_$]')) {
      ast.replace('const routes = []', `const routes = [${code}]`);
    } else {
      ast.replace('const routes = [$_$]', `const routes = [$_$, \n ${code}]`);
    }
    // ok
    return ast;
  },
};
