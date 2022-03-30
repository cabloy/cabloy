const list = {
  info: {
    layout: {
      viewSize: {
        small: [{ name: 'tree' }],
        medium: [{ name: 'table' }],
        large: [{ name: 'table' }],
      },
    },
  },
  data: {
    adapter: {
      providers: {
        tree: {
          component: {
            module: 'a-baseadmin',
            name: 'listLayoutDataProviderTree',
          },
        },
      },
    },
  },
  layouts: {
    tree: {
      title: 'LayoutTree',
      component: {
        module: 'a-baseadmin',
        name: 'listLayoutTree',
      },
    },
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
              dataIndex: 'resourceType',
              title: 'Resource Type',
              align: 'left',
              params: {
                computed: {
                  expression: 'record.resourceTypeLocale',
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
export default list;
