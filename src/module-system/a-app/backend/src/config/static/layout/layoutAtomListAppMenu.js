module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    layouts: {
      table: {
        blocks: {
          items: {
            columns: [
              {
                dataIndex: 'atomName',
                title: 'Atom Name',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellAtomName',
                },
              },
              {
                dataIndex: 'appKey',
                title: 'App Key',
                align: 'left',
                params: {
                  computed: {
                    expression: 'record.appNameLocale',
                  },
                },
              },
              {
                dataIndex: 'atomCategoryNameLocale',
                title: 'Category',
                align: 'left',
              },
              {
                dataIndex: 'userName',
                title: 'Creator',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellUserName',
                },
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
    atomName: 'AppMenu',
    atomStaticKey: 'layoutAtomListAppMenu',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
