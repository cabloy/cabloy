const list = {
  info: {
    orders: [
      { name: 'sticky', title: 'Sticky', by: 'desc', tableAlias: 'p' },
      { name: 'sorting', title: 'Sorting', by: 'asc', tableAlias: 'p' },
    ],
  },
  layouts: {
    list: {},
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
              dataIndex: 'atomCategoryName',
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
              align: 'left',
            },
            {
              dataIndex: 'updatedAt',
              title: 'Modification Time',
              align: 'left',
            },
          ],
        },
      },
    },
  },
};
export default list;
