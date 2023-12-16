// const moduleInfo = module.info;
module.exports = app => {
  const content = {
    layouts: {
      table: {
        blocks: {
          items: {
            columns: [
              {
                dataIndex: 'name',
                title: 'Name',
                align: 'left',
                renderType: 'atomName',
              },
              {
                dataIndex: 'userId',
                title: 'User',
                align: 'left',
                renderType: 'userName',
              },
              {
                dataIndex: 'createdAt',
                title: 'Created Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
              {
                dataIndex: 'updatedAt',
                title: 'Modification Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
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
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
