module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'tree',
          medium: 'treeTable',
          large: 'treeTable',
        },
      },
      data: {
        adapter: {
          providers: {
            tree: {
              fields: {
                sorting: 'sorting',
              },
              dataSourceAdapter: {
                component: {
                  module: 'a-baseadmin',
                  name: 'roleListLayoutTreeDataSourceAdapter',
                },
              },
            },
          },
        },
      },
    },
    layouts: {
      tree: {},
      treeTable: {
        blocks: {
          items: {
            columns: [
              {
                dataIndex: 'atomName',
                title: 'Role Name',
                align: 'left',
                width: 300,
                component: {
                  module: 'a-baserender',
                  name: 'renderTableCellAtomName',
                },
              },
              {
                dataIndex: 'roleTypeCode',
                title: 'Role Type',
                align: 'left',
                params: {
                  computed: {
                    expression: 'record._roleTypeCodeTitleLocale',
                  },
                },
              },
              {
                dataIndex: 'sorting',
                title: 'Sorting',
                align: 'left',
              },
              {
                dataIndex: 'atomCreatedAt',
                title: 'Created Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
              {
                dataIndex: 'atomUpdatedAt',
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
    atomName: 'Role',
    atomStaticKey: 'layoutAtomListRole',
    atomRevision: 5,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
