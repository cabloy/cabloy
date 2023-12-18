const __snippet_index = '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>: \'createdAt,updatedAt,atomId\',';

module.exports = {
  file: 'backend/src/meta.js',
  async transform({ cli, ast, argv, ctx }) {
    // index
    const code = await cli.template.renderContent({ content: __snippet_index });
    ast.replace('indexes: {$$$0}', `indexes: { ${code} \n $$$0}`);
    // ok
    return ast;
  },
};
