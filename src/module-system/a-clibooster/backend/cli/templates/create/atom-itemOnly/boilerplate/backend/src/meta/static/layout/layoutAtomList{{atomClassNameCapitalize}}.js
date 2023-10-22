module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
                dataIndex: 'description',
                title: 'Description',
                align: 'left',
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
