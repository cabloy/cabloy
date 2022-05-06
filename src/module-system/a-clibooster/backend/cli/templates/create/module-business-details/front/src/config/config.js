export default {
  details: {
    default: {
      render: {
        list: {
          layouts: {
            table: {
              blocks: {
                items: {
                  columns: [
                    {
                      dataIndex: 'detailLineNo',
                      title: '#',
                      align: 'center',
                      width: '50px',
                      component: {
                        module: 'a-detail',
                        name: 'listLayoutTableCellDetailLineNo',
                      },
                    },
                    {
                      dataIndex: 'detailName',
                      title: 'Name',
                      align: 'left',
                      component: {
                        module: 'a-detail',
                        name: 'listLayoutTableCellDetailName',
                      },
                    },
                    {
                      dataIndex: 'description',
                      title: 'Description',
                      align: 'left',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
};
