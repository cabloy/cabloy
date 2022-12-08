module.exports = ctx => {
  class Procedure {
    checkRoleRightRead({ iid, roleIdWho, atomId, forAtomUser }) {
      // for safe
      iid = parseInt(iid);
      roleIdWho = parseInt(roleIdWho);
      atomId = parseInt(atomId);
      // _rightWhere
      let _rightWhere;
      if (forAtomUser) {
        _rightWhere = `
          exists(
            select c.userIdWhom from aViewRoleRightAtomClassUser c where c.iid=${iid} and a.itemId=c.userIdWhom and c.atomClassId=a.atomClassId and c.action=2 and c.roleIdWho=${roleIdWho}
          )
        `;
      } else {
        _rightWhere = `
            exists(
              select c.roleIdWhom from aViewRoleRightAtomClassRole c 
                where c.iid=${iid} and c.atomClassId=a.atomClassId and c.action=2 and c.roleIdWhom=a.roleIdOwner and c.roleIdWho=${roleIdWho}
            )
          `;
      }
      if (_rightWhere) {
        _rightWhere = ` and ( ${_rightWhere} )`;
      } else {
        _rightWhere = '';
      }
      // sql
      const _sql = `select a.* from aAtom a
           left join aAtomClass b on a.atomClassId=b.id
            where
            (
               a.deleted=0 and a.iid=${iid} and a.id=${atomId}
               and a.atomStage>0
               ${_rightWhere}
            )
        `;
      return _sql;
    }
  }
  return Procedure;
};
