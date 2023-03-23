module.exports = ctx => {
  class Procedure {
    async checkRightAction({ iid, userIdWho, atomClassId, atomId, action, forAtomUser }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      action = parseInt(action);
      // _rightWhere
      let _rightWhere = await this._checkRightAction_rightWhere({ iid, userIdWho, atomClassId, action, forAtomUser });
      if (_rightWhere === false) return false;
      if (_rightWhere) {
        _rightWhere = ` and ( ${_rightWhere} )`;
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

    async _checkRightAction_rightWhere({ iid, userIdWho, atomClassId, action, forAtomUser }) {
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
        const roleScopes = await this._prepare_roleScopesOfUser({ atomClassId, action, userIdWho });
        if (roleScopes === true) return ''; // pass through
        if (roleScopes === false) {
          _others = ''; // should check mine
        } else {
          _others = `
            a.roleIdOwner in (${roleScopes.join(',')})
          `;
        }
      }
      //
      let _rightWhere;
      if (!_others) {
        _rightWhere = _mine;
      } else {
        _rightWhere = `
            (
              ${_mine}
              or
              ${_others}
            )
          `;
      }
      // ok
      return _rightWhere;
    }
  }
  return Procedure;
};
