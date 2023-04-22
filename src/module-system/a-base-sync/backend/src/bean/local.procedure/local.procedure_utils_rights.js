module.exports = ctx => {
  class Procedure {
    async _prepareRightMine({ iid, atomClass, atomClassBase, action, userIdWho }) {
      const _mineAtom = ctx.model.raw(`
        (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=${action} and c.scope=0 and c.userIdWho=${userIdWho}))
      `);
      // only mine data
      if (!atomClassBase) {
        return _mineAtom;
      }
      // enableRight
      const enableRight = atomClassBase.enableRight;
      if (!enableRight) {
        // only mine
        if (!atomClassBase.itemOnly) {
          return ctx.model.raw(`
            (a.userIdCreated=${userIdWho})
          `);
        }
        const userIdFieldName = atomClassBase.enableRightMineUserIdCreated || 'userIdCreated';
        return ctx.model.raw(`
          (f.${userIdFieldName}=${userIdWho})
        `);
      }
      // mine
      const enableRightMine = enableRight.mine;
      if (!enableRightMine) return false;
      // atom
      if (!atomClassBase.itemOnly) {
        return _mineAtom;
      }
      // itemOnly
      const userIdFieldName = enableRightMine.userIdCreated || 'userIdCreated';
      return ctx.model.raw(`
        (f.${userIdFieldName}=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and c.atomClassId=${atomClass.id} and c.action=${action} and c.scope=0 and c.userIdWho=${userIdWho}))
      `);
    }

    async _prepareRightOthers({ iid, atomClass, /* atomClassBase,*/ action, userIdWho, forAtomUser, role }) {
      // others
      let _others;
      if (forAtomUser) {
        if (role) {
          // get users of role
          _others = ctx.model.raw(`
              exists(
                select c.userIdWhom from aViewUserRightAtomClassUser c
                  inner join aViewUserRoleRef c2 on c.userIdWhom=c2.userId and c2.roleIdParent=${role}
                  where c.iid=${iid} and a.itemId=c.userIdWhom and c.atomClassId=a.atomClassId and c.action=${action} and c.userIdWho=${userIdWho}
              )
            `);
        } else {
          _others = ctx.model.raw(`
              exists(
                select c.userIdWhom from aViewUserRightAtomClassUser c where c.iid=${iid} and a.itemId=c.userIdWhom and c.atomClassId=a.atomClassId and c.action=${action} and c.userIdWho=${userIdWho}
              )
            `);
        }
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
      return _others;
    }

    async _prepareRight({ iid, atomClass, atomClassBase, action, userIdWho, forAtomUser, role }) {
      // enableRight
      const enableRight = atomClassBase.enableRight;
      if (!enableRight) return true; // pass rights check
      // mine
      const _mine = await this._prepareRightMine({ iid, atomClass, atomClassBase, action, userIdWho });
      // others
      const _others = await this._prepareRightOthers({
        iid,
        atomClass,
        atomClassBase,
        action,
        userIdWho,
        forAtomUser,
        role,
      });
      // mine or others
      return { __or__: [_mine, _others] };
    }
  }

  return Procedure;
};
