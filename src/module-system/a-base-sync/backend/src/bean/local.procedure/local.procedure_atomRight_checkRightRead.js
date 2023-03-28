module.exports = ctx => {
  class Procedure {
    // check for formal/history
    async checkRightRead({ iid, userIdWho, atomClass, atomId, forAtomUser }) {
      return await this.checkRightAction({ iid, userIdWho, atomClass, atomId, action: 2, forAtomUser });
    }

    // // check for formal/history
    // async checkRightRead({ iid, userIdWho, atomClassId, atomId, forAtomUser }) {
    //   // for safe
    //   iid = parseInt(iid);
    //   userIdWho = parseInt(userIdWho);
    //   atomId = parseInt(atomId);
    //   // _rightWhere
    //   let _rightWhere = await this._checkRightRead_rightWhere({ iid, userIdWho, atomClassId, forAtomUser });
    //   if (_rightWhere === false) return false;
    //   if (_rightWhere) {
    //     _rightWhere = ` and ( ${_rightWhere} )`;
    //   }
    //   // sql
    //   const _sql = `select a.* from aAtom a
    //        left join aAtomClass b on a.atomClassId=b.id
    //          where
    //          (
    //              a.deleted=0 and a.iid=${iid} and a.id=${atomId}
    //              and a.atomStage>0
    //              ${_rightWhere}
    //          )
    //     `;
    //   return _sql;
    // }

    // async _checkRightRead_rightWhere({ iid, userIdWho, atomClassId, forAtomUser }) {
    //   const _mine = `
    //     (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=2 and c.scope=0 and c.userIdWho=${userIdWho}))
    //     `;
    //   let _others;
    //   if (forAtomUser) {
    //     _others = `
    //       exists(
    //         select c.userIdWhom from aViewUserRightAtomClassUser c where c.iid=${iid} and a.itemId=c.userIdWhom and c.atomClassId=a.atomClassId and c.action=2 and c.userIdWho=${userIdWho}
    //       )
    //     `;
    //   } else {
    //     const roleScopes = await this._prepare_roleScopesOfUser({ atomClassId, action: 2, userIdWho });
    //     if (roleScopes === true) return ''; // pass through
    //     if (roleScopes === false) {
    //       _others = ''; // should check mine
    //     } else {
    //       _others = `
    //         a.roleIdOwner in (${roleScopes.join(',')})
    //       `;
    //     }
    //   }
    //   //
    //   let _rightWhere;
    //   if (!_others) {
    //     _rightWhere = _mine;
    //   } else {
    //     _rightWhere = `
    //         (
    //           ${_mine}
    //           or
    //           ${_others}
    //         )
    //       `;
    //   }
    //   // ok
    //   return _rightWhere;
    // }
  }
  return Procedure;
};
