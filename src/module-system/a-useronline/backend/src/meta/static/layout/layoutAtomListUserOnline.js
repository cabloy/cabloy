// const moduleInfo = module.info;

const content = {
  info: {
    ordersBase: [
      //
      { name: 'onlineStatus', title: 'Status', by: 'desc', tableAlias: 'f', default: true },
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
              dataIndex: 'onlineStatus',
              title: 'Status',
              align: 'left',
              renderType: 'dict',
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
  atomName: 'Users Status',
  atomStaticKey: 'layoutAtomListUserOnline',
  atomRevision: 4,
  description: '',
  layoutTypeCode: 3,
  content: JSON.stringify(content),
  resourceRoles: 'root',
};
module.exports = layout;
