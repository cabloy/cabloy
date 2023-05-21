const tableNameDefault = function () {
  return `
    (select
      concat_ws(':',__a.roleExpandId,__a.roleRightId) as id,
      __a.iid,__a.roleExpandId,__a.roleRightId,0 as deleted,
      __a.userIdWho,__a.roleId,__a.roleIdBase, 
      __a.atomClassId as atomClassIdTarget,__a.action,__a.scope, 
      __b.module as moduleTarget,__b.atomClassName as atomClassNameTarget,
      __c.name as actionName,__c.bulk as actionBulk,__c.actionMode,
      __e.roleName as roleNameBase,__e.atomId as roleAtomIdBase,
      __g.atomId as userAtomId,
      __f.atomName as flowDefName 
      from aViewUserRightAtomClass __a
        inner join aAtomClass __b on __a.atomClassId=__b.id
        inner join aAtomAction __c on __a.atomClassId=__c.atomClassId and __a.action=__c.code
        inner join aRole __e on __a.roleIdBase=__e.id
        inner join aUser __g on __g.id=__a.userIdWho
        left join aAtom __f on __c.flowKey=__f.atomStaticKey and __f.atomStage=1
    )
  `;
};
module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const userAtomRight = {
    info: {
      bean: 'userAtomRight',
      title: 'UserAtomRight',
      model: null,
      tableName: null,
      tableNameModes: {
        default: tableNameDefault,
      },
      inner: true,
      itemOnly: true,
      detail: {
        atomIdMain: 'userAtomId',
        atomClassMain: {
          module: moduleInfo.relativeName,
          atomClassName: 'user',
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
  return userAtomRight;
};
