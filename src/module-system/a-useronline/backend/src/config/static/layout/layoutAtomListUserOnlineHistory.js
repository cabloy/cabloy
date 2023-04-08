module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      ordersBase: [
        //
        { name: 'onlineTime', title: 'OnlineTime', by: 'desc', tableAlias: 'f', default: true },
      ],
    },
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
  };
  const layout = {
    atomName: 'LoginLog',
    atomStaticKey: 'layoutAtomListUserOnlineHistory',
    atomRevision: 1,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
