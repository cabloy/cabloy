const tableNameDefault = function () {
  return `
    (select
      concat_ws(':',__d.id,__a.id) as id,
      __d.id as roleExpandId,
      __d.createdAt,__d.updatedAt,__d.deleted,__d.iid,__d.roleId,__d.roleAtomId,__d.roleIdBase,
      __a.id as roleRightId,__a.atomClassId as atomClassIdTarget,__a.action,__a.scope,
      __b.module as moduleTarget,__b.atomClassName as atomClassNameTarget,
      __c.name as actionName,__c.bulk as actionBulk,__c.actionMode,
      __e.roleName as roleNameBase,
      __f.atomName as flowDefName 
        from aRoleRight __a
        inner join aAtomClass __b on __a.atomClassId=__b.id
        inner join aAtomAction __c on __a.atomClassId=__c.atomClassId and __a.action=__c.code
        inner join aRoleExpand __d on __a.roleId=__d.roleIdBase
        inner join aRole __e on __d.roleIdBase=__e.id
        left join aAtom __f on __c.flowKey=__f.atomStaticKey and __f.atomStage=1
    )
  `;
};
module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const roleRightSpread = {
    info: {
      bean: 'roleRightSpread',
      title: 'RoleAtomRightSpread',
      model: 'roleExpand',
      tableName: 'aRoleExpand',
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
