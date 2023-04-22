module.exports = ctx => {
  class Procedure {
    _prepareRightMine({ iid, atomClass, atomClassBase, action, userIdWho }) {
      const _mineAtom = ctx.model.raw(`
        (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=${action} and c.scope=0 and c.userIdWho=${userIdWho}))
      `);
      // only mine data
      if (!atomClassBase) {
        return _mineAtom;
      }
      // enableRight
      const enableRight = atomClassBase;
      if (!enableRight) return true;
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
  }

  return Procedure;
};
