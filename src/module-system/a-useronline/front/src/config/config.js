export default {
  atoms: {
    userOnline: {
      render: {
        list: {
          layouts: {
            table: {
              blocks: {
                items: {
                  columns: [
                    {
                      dataIndex: 'atomName',
                      title: 'Username',
                      align: 'left',
                      component: {
                        module: 'a-baselayout',
                        name: 'listLayoutTableCellAtomName',
                        options: {
                          props: {
                            mapper: {
                              avatar: true,
                            },
                          },
                        },
                      },
                    },
                    {
                      dataIndex: 'description',
                      title: 'Description',
                      align: 'left',
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
};
