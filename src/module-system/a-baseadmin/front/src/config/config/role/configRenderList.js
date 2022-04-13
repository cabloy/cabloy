const list = {
  info: {
    layout: {
      viewSize: {
        small: [{ name: 'tree' }],
        medium: [{ name: 'treeTable' }],
        large: [{ name: 'treeTable' }],
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
              component: {
                module: 'a-baselayout',
                name: 'listLayoutTableCellAtomName',
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
export default list;
