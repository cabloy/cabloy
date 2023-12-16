// const moduleInfo = module.info;
module.exports = {
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
