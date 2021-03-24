export default {
  atoms: {
    {{atomClassName}}: {
      render: {
        list: {
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
                      dataIndex: 'description',
                      title: 'Description',
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
                      dataIndex: 'atomCreatedAt',
                      title: 'Created Time',
                      align: 'left',
                    },
                    {
                      dataIndex: 'atomUpdatedAt',
                      title: 'Modification Time',
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
