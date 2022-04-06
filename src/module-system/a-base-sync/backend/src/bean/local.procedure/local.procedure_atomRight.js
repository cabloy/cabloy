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
            select c.roleIdWhom from aViewRoleRightAtomClassUser c where c.iid=${iid} and a.itemId=c.userIdWhom and c.atomClassId=a.atomClassId and c.action=2 and c.roleIdWho=${roleIdWho}
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

    checkRightAction({ iid, userIdWho, atomId, action, forAtomUser }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      action = parseInt(action);
      // _rightWhere
      let _rightWhere;
      const _mine = `
        (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=${action} and c.scope=0 and c.userIdWho=${userIdWho}))
      `;
      let _others;
      if (forAtomUser) {
        _others = `
          exists(
            select c.userIdWhom from aViewUserRightAtomClassUser c where c.iid=${iid} and a.itemId=c.userIdWhom and c.atomClassId=a.atomClassId and c.action=${action} and c.userIdWho=${userIdWho}
          )
        `;
      } else {
        _others = `
          exists(
            select c.roleIdWhom from aViewUserRightAtomClassRole c 
              where c.iid=${iid} and c.atomClassId=a.atomClassId and c.action=${action} and c.roleIdWhom=a.roleIdOwner and c.userIdWho=${userIdWho}
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
            where
            (
              a.deleted=0 and a.iid=${iid} and a.id=${atomId}
              and a.atomStage>0
              ${_rightWhere} 
            )
        `;
      return _sql;
    }

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

    checkRightCreateRole({ iid, userIdWho, atomClassId, roleIdOwner }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomClassId = parseInt(atomClassId);
      roleIdOwner = parseInt(roleIdOwner);

      const _rightWhere = `
        and exists(
          select b.atomClassId from aViewUserRightAtomClass b where b.iid=${iid} and a.id=b.atomClassId and b.action=1 and b.userIdWho=${userIdWho} and b.roleId=${roleIdOwner}
        )
      `;
      // sql
      const _sql = `select a.* from aAtomClass a
            where a.iid=${iid} and a.id=${atomClassId} ${_rightWhere}
        `;
      return _sql;
    }
  }
  return Procedure;
};
