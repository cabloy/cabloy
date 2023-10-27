module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const userOnlineHistory = {
    info: {
      bean: 'userOnlineHistory',
      title: 'LoginLog',
      tableName: 'aUserOnlineHistory',
      itemOnly: true,
      fields: {
        mappings: {
          userIds: 'userId',
        },
        dicts: {
          isLogin: {
            dictKey: 'a-useronline:dictLoginType',
          },
        },
      },
      layout: {
        config: {
          atomList: 'layoutAtomListUserOnlineHistory',
        },
      },
    },
    actions: {},
    validator: 'userOnlineHistory',
    search: {
      validator: 'userOnlineHistorySearch',
    },
  };
  return userOnlineHistory;
};
