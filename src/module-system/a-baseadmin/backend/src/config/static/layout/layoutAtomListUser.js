module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      ordersBase: [
        //
        { name: 'atomCreatedAt', title: 'Join Time', by: 'desc', tableAlias: '', default: true },
        { name: 'atomName', title: 'Username', tableAlias: 'a' },
      ],
    },
    layouts: {
      base: {
        extend: {
          component: {
            module: 'a-baseadmin',
            name: 'userListLayoutExtend',
          },
        },
      },
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
                },
                options: {
                  mapper: {
                    avatar: true,
                  },
                },
              },
              {
                dataIndex: 'realName',
                title: 'Realname',
                align: 'left',
              },
              {
                dataIndex: 'email',
                title: 'Email',
                align: 'left',
              },
              {
                dataIndex: 'mobile',
                title: 'Mobile',
                align: 'left',
              },
              {
                dataIndex: 'locale',
                title: 'Locale',
                align: 'left',
              },
              {
                dataIndex: 'atomCreatedAt',
                title: 'Join Time',
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
    atomName: 'User',
    atomStaticKey: 'layoutAtomListUser',
    atomRevision: 1,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
