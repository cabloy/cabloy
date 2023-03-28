module.exports = ctx => {
  class Procedure {
    checkRightCreateRole({ iid, userIdWho, atomClass, roleIdOwner }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      roleIdOwner = parseInt(roleIdOwner);

      const _rightWhere = `
        and exists(
          select b.atomClassId from aViewUserRightAtomClass b where b.iid=${iid} and a.id=b.atomClassId and b.action=1 and b.userIdWho=${userIdWho} and b.roleId=${roleIdOwner}
        )
      `;
      // sql
      const _sql = `select a.* from aAtomClass a
            where a.iid=${iid} and a.id=${atomClass.id} ${_rightWhere}
        `;
      return _sql;
    }
  }
  return Procedure;
};
