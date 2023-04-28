module.exports = ctx => {
  class Procedure {
    checkRightActionBulk({ iid, userIdWho, atomClass, atomClassBase, action }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      action = parseInt(action || 0);
      // fields
      const _selectFields = 'a.*,c.module,c.atomClassName';
      // join
      const _atomActionJoin = 'from aAtomAction a';
      const _atomClassjoin = 'left join aAtomClass c on a.atomClassId=c.id';
      // _where
      const _where = {
        'a.iid': iid,
        'a.bulk': 1,
        'a.atomClassId': atomClass.id,
      };
      // _actionWhere
      if (action) {
        _where['a.code'] = action;
      }
      // _rightWhere
      const _rightWhere = this._checkRightActionBulk_rightWhere({ iid, userIdWho, atomClassBase });
      _where.__and__right = _rightWhere;

      // where clause
      const _whereClause = ctx.model._formatWhere(_where);

      // sql
      const _sql = `select ${_selectFields} ${_atomActionJoin}
        ${_atomClassjoin}
        WHERE (${_whereClause})
      `;
      return _sql;
    }

    _checkRightActionBulk_rightWhere({ iid, userIdWho, atomClassBase }) {
      const enableRight = atomClassBase.enableRight;
      if (!enableRight) return true;
      return ctx.model.raw(`
        and exists(
          select b.atomClassId from aViewUserRightAtomClass b where b.iid=${iid} and a.atomClassId=b.atomClassId and a.code=b.action and b.userIdWho=${userIdWho}
        )
      `);
    }
  }
  return Procedure;
};
