// const moduleInfo = module.info;
module.exports = app => {
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
                renderType: 'atomName',
              },
              {
                dataIndex: 'roleTypeCode',
                title: 'Role Type',
                align: 'left',
                renderType: 'dict',
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
    atomRevision: 9,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
