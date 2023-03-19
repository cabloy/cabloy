module.exports = ctx => {
  class Procedure {
    // check for formal/history
    checkRightRead({ iid, userIdWho, atomId, forAtomUser }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);

      // _rightWhere
      let _rightWhere;
      const _mine = `
          (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=2 and c.scope=0 and c.userIdWho=${userIdWho}))
          `;
      let _others;
      if (forAtomUser) {
        _others = `
          exists(
            select c.userIdWhom from aViewUserRightAtomClassUser c where c.iid=${iid} and a.itemId=c.userIdWhom and c.atomClassId=a.atomClassId and c.action=2 and c.userIdWho=${userIdWho}
          )
        `;
      } else {
        _others = `
            exists(
              select c.roleIdWhom from aViewUserRightAtomClassRole c 
                where c.iid=${iid} and c.atomClassId=a.atomClassId and c.action=2 and c.roleIdWhom=a.roleIdOwner and c.userIdWho=${userIdWho}
            )
          `;
      }
      //
      _rightWhere = `
        (
          ${_mine}
          or
          ${_others}
        )
      `;
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
