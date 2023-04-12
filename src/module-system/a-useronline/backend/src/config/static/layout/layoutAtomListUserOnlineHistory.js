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
                dataIndex: 'isLogin',
                title: 'LoginType',
                align: 'left',
                params: {
                  computed: {
                    expression: 'record._isLoginTitleLocale',
                  },
                },
              },
              {
                dataIndex: 'onlineIP',
                title: 'OnlineIP',
                align: 'left',
              },
              {
                dataIndex: 'onlineTime',
                title: 'OnlineTime',
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
    atomRevision: 2,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
