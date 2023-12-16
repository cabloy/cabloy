// const moduleInfo = module.info;
module.exports = app => {
  const content = {
    layouts: {
      list: {},
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
                dataIndex: 'name',
                title: 'Name',
                align: 'left',
                renderType: 'atomName',
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: '<%=argv.atomClassNameCapitalize%>',
    atomStaticKey: 'layoutAtomList<%=argv.atomClassNameCapitalize%>',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 5,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
