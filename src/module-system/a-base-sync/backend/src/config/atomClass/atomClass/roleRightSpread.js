const tableNameDefault = function ({ action }) {
  if (action === 'read' || action === 'select') {
    return `
      (select 
          __a.id,__a.createdAt,__a.updatedAt,__a.deleted,__a.iid,__a.roleId,__a.atomClassId as atomClassIdTarget,__a.action,__a.scope,__a.roleAtomId,
          __b.module as moduleTarget,__b.atomClassName as atomClassNameTarget,
          __c.name as actionName,__c.bulk as actionBulk,__c.actionMode,
          __d.atomName as flowDefName 
        from aRoleRight __a
        left join aAtomClass __b on __a.atomClassId=__b.id
        left join aAtomAction __c on __a.atomClassId=__c.atomClassId and __a.action=__c.code
        left join aAtom __d on __c.flowKey=__d.atomStaticKey and __d.atomStage=1
      )
    `;
  }
  // other action: select
  return `
    (select 
        __a.id,__a.createdAt,__a.updatedAt,__a.deleted,__a.iid,__a.roleId,__a.atomClassId as atomClassIdTarget,__a.action,__a.scope,__a.roleAtomId,
        __b.module as moduleTarget,__b.atomClassName as atomClassNameTarget,
        __c.name as actionName,__c.bulk as actionBulk,__c.actionMode,
        __d.atomName as flowDefName 
      from aRoleRight __a
      inner join aAtomClass __b on __a.atomClassId=__b.id
      inner join aAtomAction __c on __a.atomClassId=__c.atomClassId and __a.action=__c.code
      left join aAtom __d on __c.flowKey=__d.atomStaticKey and __d.atomStage=1
    )
  `;
};
module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const roleRightSpread = {
    info: {
      bean: 'roleRightSpread',
      title: 'RoleAtomRightSpread',
      // model: 'roleRightSpread',
      // tableName: 'aRoleRight',
      tableNameModes: {
        default: tableNameDefault,
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
    actions: {
      read: {
        rightInherit: 'atomAuthorizations',
      },
    },
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
  return roleRightSpread;
};
