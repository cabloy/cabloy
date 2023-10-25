const __snippet_actions = `actions: {},`;
const __snippet_action = `
<%=argv.actionName%>: {
  code: <%=argv.actionCode%>,
  title: '<%=argv.actionNameCapitalize%>',
  actionModule: moduleInfo.relativeName,
  actionComponent: 'action',
  icon: { f7: '::radio-button-unchecked' },
  enableOnOpened: null,
  directShowOnList: true,
  directShowOnItem: true,
  stage: 'formal',
},
`;
module.exports = {
  file: 'backend/src/meta.js',
  async transform({ cli, ast, argv, ctx }) {
    // confirm actions
    const actions = ast.find(`{ base: { atoms: { ${argv.atomClassName}: { actions: {} } } } }`);
    if (actions.length === 0) {
      const code = await cli.template.renderContent({ content: __snippet_actions });
      ast.replace(
        `{ base: { atoms: { ${argv.atomClassName}: {info:{$$$4}, $$$0 }, $$$1 }, $$$2 }, $$$3 }`,
        `{ base: { atoms: { ${argv.atomClassName}: {info:{$$$4}, ${code} \n $$$0 }, $$$1 }, $$$2 }, $$$3 }`
      );
    }
    // add action
    const code = await cli.template.renderContent({ content: __snippet_action });
    ast.replace(
      `{ base: { atoms: { ${argv.atomClassName}: {info:{$$$4}, actions:{$$$5}, $$$0 }, $$$1 }, $$$2 }, $$$3 }`,
      `{ base: { atoms: { ${argv.atomClassName}: {info:{$$$4}, actions:{${code} $$$5}, $$$0 }, $$$1 }, $$$2 }, $$$3 }`
    );
    // ok
    return ast;
  },
};
