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
          },
        },
      },
    },
  },
  layouts: {
    tree: {
      treeviewAdapter: {
        component: {
          module: 'a-baseadmin',
          name: 'roleListLayoutTreeviewAdapter',
        },
      },
      blocks: {
        items: {
          component: {
            module: 'a-baseadmin',
            name: 'roleListLayoutBlockTreeItems',
          },
        },
      },
    },
    treeTable: {
      title: 'LayoutTreeTable',
      component: {
        module: 'a-baseadmin',
        name: 'roleListLayoutTree',
      },
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
        title: {
          component: {
            module: 'a-baseadmin',
            name: 'roleListLayoutBlockTreeTitle',
          },
        },
      },
    },
  },
};
export default list;
