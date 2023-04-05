module.exports = ctx => {
  class Procedure {
    async checkRoleRightRead({
      iid,
      roleIdWho,
      atomClass,
      // atomClassBase,
      atomId,
      forAtomUser,
    }) {
      // for safe
      iid = parseInt(iid);
      roleIdWho = parseInt(roleIdWho);
      atomId = parseInt(atomId);
      // _where
      const _where = {
        'a.deleted': 0,
        'a.iid': iid,
        'a.id': atomId,
        'a.atomStage': [1, 2],
        'a.atomClassId': atomClass.id,
      };
      // _rightWhere
      const _rightWhere = await this._checkRoleRightRead_rightWhere({ iid, roleIdWho, forAtomUser });
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

    async _checkRoleRightRead_rightWhere({ iid, roleIdWho, forAtomUser }) {
      // _rightWhere
      let _rightWhere;
      if (forAtomUser) {
        _rightWhere = ctx.model.raw(`
          exists(
            select c.userIdWhom from aViewRoleRightAtomClassUser c where c.iid=${iid} and a.itemId=c.userIdWhom and c.atomClassId=a.atomClassId and c.action=2 and c.roleIdWho=${roleIdWho}
          )
        `);
      } else {
        _rightWhere = ctx.model.raw(`
          exists(
            select c.roleIdWhom from aViewRoleRightAtomClassRole c 
              where c.iid=${iid} and c.atomClassId=a.atomClassId and c.action=2 and c.roleIdWhom=a.roleIdOwner and c.roleIdWho=${roleIdWho}
          )
        `);
      }
      return _rightWhere;
    }
  }
  return Procedure;
};
