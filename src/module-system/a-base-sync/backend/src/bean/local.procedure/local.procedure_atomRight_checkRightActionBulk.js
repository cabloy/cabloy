module.exports = ctx => {
  class Procedure {
    checkRightActionBulk({ iid, userIdWho, atomClassId, action }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomClassId = parseInt(atomClassId);
      action = parseInt(action || 0);

      const _actionWhere = action ? `and a.code=${action}` : '';
      const _rightWhere = `
        and exists(
          select b.atomClassId from aViewUserRightAtomClass b where b.iid=${iid} and a.atomClassId=b.atomClassId and a.code=b.action and b.userIdWho=${userIdWho}
        )
      `;
      // sql
      const _sql = `select a.*,c.module,c.atomClassName,c.atomClassIdParent from aAtomAction a
            left join aAtomClass c on a.atomClassId=c.id
              where a.iid=${iid} and a.bulk=1 and a.atomClassId=${atomClassId} ${_actionWhere} ${_rightWhere}
        `;
      return _sql;
    }
  }
  return Procedure;
};
