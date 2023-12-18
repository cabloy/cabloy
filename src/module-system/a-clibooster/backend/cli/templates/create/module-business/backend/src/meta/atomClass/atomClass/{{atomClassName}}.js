module.exports = {
  info: {
    bean: '<%=argv.atomClassName%>',
    title: '<%=argv.atomClassNameCapitalize%>',
    model: '<%=argv.atomClassName%>',
    tableName: '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>',
    language: false,
    category: false,
    tag: false,
    comment: false,
    attachment: false,
    flow: {
      stage: 'draft',
    },
    fields: {
      dicts: {
        atomState: {
          draft: {
            dictKey: null,
          },
        },
      },
    },
    layout: {
      config: {
        // atomList: 'layoutAtomList<%=argv.atomClassNameCapitalize%>',
      },
    },
  },
  actions: {},
  validator: '<%=argv.atomClassName%>',
  search: {
    validator: '<%=argv.atomClassName%>Search',
  },
};
