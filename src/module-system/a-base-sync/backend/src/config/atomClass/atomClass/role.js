module.exports = app => {
  const role = {
    info: {
      bean: 'role',
      title: 'Role',
      tableName: 'aRole',
      tableNameModes: {
        default: 'aRoleView',
        includes: 'aRoleIncludesView',
        userRoles: 'aRoleUserRolesView',
      },
      resource: true,
      simple: true,
      history: false,
      inner: true,
      comment: false,
      attachment: false,
      dict: {
        fields: {
          roleTypeCode: {
            translate: false,
            // dictKey: 'a-base:dictRoleType',
          },
        },
      },
      layout: {
        config: {
          atomList: 'a-baseadmin:layoutAtomListRole',
          atomItem: 'a-baseadmin:layoutAtomItemRole',
        },
      },
    },
    actions: {
      write: {
        enableOnStatic: true,
      },
      delete: {
        actionModule: 'a-baseadmin',
        actionComponent: 'actionRole',
      },
      clone: {
        actionModule: 'a-baseadmin',
        actionComponent: 'actionRole',
      },
      move: {
        code: 101,
        title: 'Move',
        actionModule: 'a-baseadmin',
        actionComponent: 'actionRole',
        icon: { f7: ':outline:folder-transfer-outline' },
      },
      addChild: {
        code: 102,
        title: 'AddChild',
        actionModule: 'a-baseadmin',
        actionComponent: 'actionRole',
        icon: { f7: ':outline:add-circle-outline' },
        enableOnStatic: true,
      },
      roleUsers: {
        code: 103,
        title: 'Users',
        actionModule: 'a-baseadmin',
        actionComponent: 'actionRole',
        icon: { f7: ':outline:group-outline' },
        enableOnStatic: true,
      },
      includes: {
        code: 104,
        title: 'Includes',
        actionModule: 'a-baseadmin',
        actionComponent: 'actionRole',
        icon: { f7: ':role:role' },
        enableOnStatic: true,
      },
      resourceAuthorizations: {
        code: 105,
        title: 'RoleResourceRight',
        actionModule: 'a-baseadmin',
        actionComponent: 'actionRole',
        icon: { f7: ':outline:archive-lock-outline' },
        enableOnStatic: true,
      },
      atomAuthorizations: {
        code: 106,
        title: 'RoleAtomRight',
        actionModule: 'a-baseadmin',
        actionComponent: 'actionRole',
        icon: { f7: ':outline:database-lock-outline' },
        enableOnStatic: true,
      },
      // buildBulk: {
      //   code: 201,
      //   title: 'Build',
      //   actionModule: 'a-baseadmin',
      //   actionComponent: 'actionRole',
      //   icon: { f7: ':outline:build-circle-outline' },
      //   bulk: true,
      //   select: false,
      //   stage: 'formal',
      // },
    },
    validator: 'role',
    search: {
      validator: 'roleSearch',
    },
  };
  return role;
};
