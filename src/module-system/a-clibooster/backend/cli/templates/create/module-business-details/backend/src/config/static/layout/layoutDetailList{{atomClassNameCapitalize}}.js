module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    layouts: {
      table: {
        blocks: {
          items: {
            columns: [
              {
                dataIndex: 'detailLineNo',
                title: '#',
                align: 'center',
                width: 50,
                renderType: 'lineNo',
              },
              {
                dataIndex: 'detailName',
                title: 'Name',
                align: 'left',
                component: {
                  module: 'a-detail',
                  name: 'listLayoutTableCellDetailName',
                },
              },
              {
                dataIndex: 'description',
                title: 'Description',
                align: 'left',
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: '<%=argv.atomClassNameCapitalize%>',
    atomStaticKey: 'layoutDetailList<%=argv.atomClassNameCapitalize%>',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 5,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
