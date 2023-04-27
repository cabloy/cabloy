module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const roleRight = {
    info: {
      bean: 'roleRight',
      title: 'Atom Right',
      tableName: 'aRoleRight',
      tableNameModes: {
        default: `
          (select 
              __a.id,__a.createdAt,__a.updatedAt,__a.deleted,__a.iid,__a.roleId,__a.atomClassId as atomClassIdTarget,__a.action,__a.scope,__a.roleAtomId,
              __b.module as moduleTarget,__b.atomClassName as atomClassNameTarget,
              __c.name as actionName,__c.bulk as actionBulk,__c.actionMode,
              __d.atomName as flowDefName 
            from aRoleRight __a
            inner join aAtomClass __b on __a.atomClassId=__b.id
            inner join aAtomAction __c on __a.atomClassId=__c.atomClassId and __a.action=__c.code
            left join aAtom __d on __c.flowKey=__d.atomStaticKey and __d.atomStage=1)`,
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
