module.exports = ctx => {
  class Procedure {
    async checkRightAction({ iid, userIdWho, atomClass, atomId, action, forAtomUser }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      action = parseInt(action);
      // _where
      const _where = {
        'a.deleted': 0,
        'a.iid': iid,
        'a.id': atomId,
        'a.atomStage': [1, 2],
      };
      // _rightWhere
      const _rightWhere = await this._checkRightAction_rightWhere({ iid, userIdWho, atomClass, action, forAtomUser });
      _where.__and__right = _rightWhere;

      // where clause
      let _whereClause = ctx.model._formatWhere(_where);
      if (_whereClause === false) return false;
      _whereClause = _whereClause === true ? '' : ` WHERE (${_whereClause})`;

      // sql
      const _sql = `select a.* from aAtom a
        ${_whereClause}
      `;
      return _sql;
    }

    async _checkRightAction_rightWhere({ iid, userIdWho, atomClass, action, forAtomUser }) {
      const _mine = ctx.model.raw(`
        (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=${action} and c.scope=0 and c.userIdWho=${userIdWho}))
      `);
      let _others;
      if (forAtomUser) {
        _others = ctx.model.raw(`
          exists(
            select c.userIdWhom from aViewUserRightAtomClassUser c where c.iid=${iid} and a.itemId=c.userIdWhom and c.atomClassId=a.atomClassId and c.action=${action} and c.userIdWho=${userIdWho}
          )
        `);
      } else {
        const roleScopes = await this._prepare_roleScopesOfUser({ atomClass, action, userIdWho });
        if (roleScopes === true) return true; // pass through
        if (roleScopes === false) {
          _others = false; // should check mine
        } else {
          _others = ctx.model.raw(`
            a.roleIdOwner in (${roleScopes.join(',')})
          `);
        }
      }
      // mine or others
      return { __or__: [_mine, _others] };
    }
  }
  return Procedure;
};
