const __snippet_body = `
  // Details
  __groupDetails: {
    ebType: 'group-flatten',
    ebTitle: 'Details',
    ebGroupWhole: true,
    ebParams: {
      titleHidden: true,
    },
  },
  details: {
    ebType: 'details',
    ebTitle: 'Details',
    ebParams: {
      atomClass: {
        module: moduleInfo.relativeName,
        atomClassName: '<%=argv.atomClassName%>',
      },
    },
  },
`;

module.exports = {
  file: 'backend/src/config/validation/schema/{{atomClassMain.atomClassName}}.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    const code = await cli.template.renderContent({ content: __snippet_body });
    ast.replace(
      `schemas.${argv.atomClassMain.atomClassName} = {$$$0, properties: {$$$1}}`,
      `schemas.${argv.atomClassMain.atomClassName} = {$$$0, properties: {$$$1 \n ${code}}}`
    );
    // ok
    return ast;
  },
};
