// const moduleInfo = module.info;

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
              renderType: 'atomName',
              params: {
                mapper: {
                  avatar: true,
                },
              },
            },
            {
              dataIndex: 'isLogin',
              title: 'LoginType',
              align: 'left',
              renderType: 'dict',
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
  atomRevision: 5,
  description: '',
  layoutTypeCode: 3,
  content: JSON.stringify(content),
  resourceRoles: 'root',
};
module.exports = layout;
