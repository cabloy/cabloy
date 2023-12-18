module.exports = {
  info: {
    bean: '<%=argv.atomClassName%>',
    title: '<%=argv.atomClassNameCapitalize%>',
    model: '<%=argv.atomClassName%>',
    tableName: '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>',
    itemOnly: true,
    language: false,
    category: false,
    tag: false,
    comment: false,
    attachment: false,
    history: false,
    enableRight: {
      mine: true,
      role: true,
    },
    fields: {
      mappings: {
        userIds: 'userId',
        userIdCreated: 'userId',
        atomName: 'name',
        atomMedia: '_userIdAvatar',
        atomMediaLabel: '_userIdName',
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
