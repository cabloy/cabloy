module.exports = ctx => {
  class Procedure {
    async checkRightAction({ iid, userIdWho, atomClass, atomClassBase, atomId, action, forAtomUser }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      action = parseInt(action);
      // _where
      let _where;
      let _selectFields;
      let _atomJoin;
      if (!atomClassBase.itemOnly) {
        _where = {
          'a.deleted': 0,
          'a.iid': iid,
          'a.id': atomId,
          'a.atomStage': [1, 2],
          'a.atomClassId': atomClass.id,
        };
        _selectFields = 'a.*';
        _atomJoin = 'from aAtom a';
      } else {
        _where = {
          'f.deleted': 0,
          'f.iid': iid,
          'f.id': atomId,
        };
        _selectFields = 'f.*';
        _atomJoin = `from ${atomClassBase.tableName} f`;
      }
      // _rightWhere
      const _rightWhere = await this._checkRightAction_rightWhere({
        iid,
        userIdWho,
        atomClass,
        atomClassBase,
        action,
        forAtomUser,
      });
      _where.__and__right = _rightWhere;

      // where clause
      let _whereClause = ctx.model._formatWhere(_where);
      if (_whereClause === false) return false;
      _whereClause = _whereClause === true ? '' : ` WHERE (${_whereClause})`;

      // sql
      const _sql = `select ${_selectFields} ${_atomJoin}
        ${_whereClause}
      `;
      return _sql;
    }

    async _checkRightAction_rightWhere({ iid, userIdWho, atomClass, atomClassBase, action, forAtomUser }) {
      // right
      return await this._prepareRight({
        iid,
        atomClass,
        atomClassBase,
        action,
        userIdWho,
        forAtomUser,
        role: undefined,
      });
    }
  }
  return Procedure;
};
