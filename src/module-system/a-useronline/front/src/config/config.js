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
                      dataIndex: 'onlineStatus',
                      title: 'Status',
                      align: 'left',
                      params: {
                        computed: {
                          expression: 'record._onlineStatusTitleLocale',
                        },
                      },
                    },
                    {
                      dataIndex: 'loginCount',
                      title: 'LoginCount',
                      align: 'left',
                    },
                    {
                      dataIndex: 'onlineCount',
                      title: 'OnlineCount',
                      align: 'left',
                    },
                    {
                      dataIndex: 'onlineIPLast',
                      title: 'OnlineIPLast',
                      align: 'left',
                    },
                    {
                      dataIndex: 'onlineTimeLast',
                      title: 'OnlineTimeLast',
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
