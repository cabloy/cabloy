module.exports = app => {
  const <%=argv.atomClassName%> = {
    info: {
      bean: '<%=argv.atomClassName%>',
      title: '<%=argv.atomClassNameCapitalize%>',
      model: '<%=argv.atomClassName%>',
      tableName: '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>',
      itemOnly: true,
      detail: {
        inline: true,
        atomClassMain: {
          module: '<%=argv.atomClassMain.module%>',
          atomClassName: '<%=argv.atomClassMain.atomClassName%>',
        },
      },
      enableRight: false,
      fields: {
        mappings: {
          atomIdMain: 'atomIdMain',
          lineNo: 'detailLineNo',
        },
      },
      layout: {
        config: {
          // atomList: 'layoutAtomList<%=argv.atomClassNameCapitalize%>',
        },
      },
    },
    actions: {
      create: {},
      read: {},
      write: {},
      delete: {},
      clone: {},
      moveUp: {},
      moveDown: {},
    },
    validator: '<%=argv.atomClassName%>',
  };
  return <%=argv.atomClassName%>;
};
