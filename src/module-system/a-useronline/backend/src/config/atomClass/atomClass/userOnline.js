module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const userOnline = {
    info: {
      bean: 'userOnline',
      title: 'Users Status', // 'Online Users',
      tableName: 'aUserOnline',
      language: false,
      category: false,
      tag: false,
      simple: true,
      history: false,
      inner: true,
      comment: false,
      attachment: false,
      layout: {
        config: {
          atomList: 'layoutAtomListUserOnline',
        },
      },
    },
    actions: {
      kickOut: {
        code: 101,
        title: 'ActionKickOut',
        actionModule: 'a-base',
        actionComponent: 'action',
        icon: { f7: ':outline:logout-outline' },
        // enableOnOpened: true,
        stage: 'formal',
        params: {
          actionAfter: {
            sameAs: 'write',
          },
        },
      },
      loginLog: {
        code: 102,
        title: 'LoginLog',
        actionModule: moduleInfo.relativeName,
        actionComponent: 'action',
        icon: { f7: ':role:shield-key' },
        // enableOnOpened: true,
        stage: 'formal',
      },
    },
    validator: 'userOnline',
    search: {
      validator: 'userOnlineSearch',
    },
  };
  return userOnline;
};
