export default {
  message: 'Hello World',
  markCount: 2,
  monkeyed: false,
  atoms: {
    party: {
      render: {
        list: {
          info: {
            orders: [
              { name: 'personCount', title: 'Person Count', by: 'asc' },
            ],
          },
          layouts: {
            list: {
              blocks: {
                // title: false,
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
                      dataIndex: 'partyTypeName',
                      title: 'Party Type',
                      align: 'left',
                      params: {
                        locale: true,
                      },
                    },
                    {
                      dataIndex: 'personCount',
                      title: 'Person Count',
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
        },
        item: {
          layouts: {
            mobile: {
              blocks: {
                main: {
                  component: {
                    module: 'a-cms',
                    name: 'itemLayoutBlockMobileMain',
                  },
                  // iframe: false,
                },
              },
            },
            pc: {
              blocks: {
                main: {
                  component: {
                    module: 'a-cms',
                    name: 'itemLayoutBlockMobileMain',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
