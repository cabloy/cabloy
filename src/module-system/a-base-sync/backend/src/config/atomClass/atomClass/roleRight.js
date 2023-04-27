module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const roleRight = {
    info: {
      bean: 'roleRight',
      title: 'Atom Right',
      tableName: 'aRoleRight',
      tableNameModes: {
        default: 'aRoleRight',
      },
      inner: true,
      itemOnly: true,
      detail: {
        atomIdMain: 'roleAtomId',
        atomClassMain: {
          module: moduleInfo.relativeName,
          atomClassName: 'role',
        },
      },
      enableRight: false,
      layout: {
        config: {
          atomList: 'a-baseadmin:layoutAtomListRoleRight',
        },
      },
    },
    actions: {},
    validator: {
      module: 'a-baseadmin',
      name: 'roleRight',
    },
    search: {
      validator: {
        module: 'a-baseadmin',
        name: 'roleRightSearch',
      },
    },
  };
  return roleRight;
};
