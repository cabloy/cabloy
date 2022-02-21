export default {
  atoms: {
    dict: {
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
        },
      },
    },
  },
};
