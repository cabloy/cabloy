module.exports = app => {
  const user = {
    info: {
      bean: 'user',
      title: 'User',
      tableName: 'aUser',
      tableNameModes: {},
      resource: false,
      simple: true,
      history: false,
      inner: true,
      comment: false,
      attachment: false,
      // fields: {
      //   custom: ['disabled', 'anonymous', 'activated', 'emailConfirmed', 'mobileVerified'],
      // },
      layout: {
        config: {
          atomList: 'a-baseadmin:layoutAtomListUser',
          atomItem: 'a-baseadmin:layoutAtomItemUser',
        },
      },
    },
    actions: {
      userRoles: {
        code: 101,
        title: 'Roles',
        actionModule: 'a-baseadmin',
        actionComponent: 'actionUser',
        icon: { f7: ':role:role' },
      },
      resourceAuthorizations: {
        code: 102,
        title: 'Resource Authorizations',
        actionModule: 'a-baseadmin',
        actionComponent: 'actionUser',
        icon: { f7: ':outline:archive-lock-outline' },
      },
      atomAuthorizations: {
        code: 103,
        title: 'UserAtomRight',
        actionModule: 'a-baseadmin',
        actionComponent: 'actionUser',
        icon: { f7: ':outline:database-lock-outline' },
      },
    },
    validator: 'userAdmin',
    search: {
      validator: 'userAdminSearch',
    },
  };
  return user;
};
