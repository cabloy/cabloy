const __snippet = `<%=argv.appNameCapitalize%>: '<%=argv.appNameCapitalize%>',`;

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
