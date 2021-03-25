export default {
  atoms: {
    purchaseOrder: {
      render: {
        list: {
          layouts: {
            list: {
              blocks: {
              },
            },
          },
        },
      },
    },
  },
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
                      dataIndex: 'price',
                      title: 'Price',
                      align: 'left',
                      params: {
                        currency: true,
                      },
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
