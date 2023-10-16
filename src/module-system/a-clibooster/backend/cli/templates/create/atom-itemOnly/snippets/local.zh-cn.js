const __snippet = `'Create <%=argv.atomClassNameCapitalize%>': '新建<%=argv.atomClassNameCapitalize%>',
  '<%=argv.atomClassNameCapitalize%> List': '<%=argv.atomClassNameCapitalize%>列表',`;

module.exports = {
  file: 'backend/src/config/locale/zh-cn.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    const code = await cli.template.renderContent({ content: __snippet });
    ast.replace(`module.exports = {$$$0}`, `module.exports = {$$$0, ${code}}`);
    // ok
    return ast;
  },
};
