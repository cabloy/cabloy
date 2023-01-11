module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async openDraft({ key, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      // atom
      let atom = await this.modelAtom.get({ id: key.atomId });
      if (!atom) ctx.throw.module(moduleInfo.relativeName, 1002);
      // check simple switch
      atom = await this._checkSimpleSwitch({ atomClass, _atomClass, atom, user });
      // open draft
      let res;
      if (atom.atomSimple) {
        // simple
        res = await this._openDraft_asSimple({ atomClass, _atomClass, atom, user });
      } else {
        // not simple
        res = await this._openDraft_asSimpleZero({ atomClass, _atomClass, atom, user });
      }
      // ok
      // get atom
      const resData = res.draft || res.formal;
      const keyDraft = resData.key;
      atom = await this.modelAtom.get({ id: keyDraft.atomId });
      atom.atomId = atom.id;
      atom.module = atomClass.module;
      atom.atomClassName = atomClass.atomClassName;
      if (res.draft) {
        res.draft.atom = atom;
      } else {
        res.formal.atom = atom;
      }
      return res;
    }

    async _openDraft_asSimpleZero({ /* atomClass, _atomClass,*/ atom, user }) {
      // draft
      if (atom.atomStage === 0) {
        return await this._openDraft_asSimpleZero_draft({ atom, user });
      }
      // formal
      if (atom.atomStage === 1) {
        return await this._openDraft_asSimpleZero_formal({ atom, user });
      }
      // history
      if (atom.atomStage === 2) {
        return await this._openDraft_asSimpleZero_history({ atom, user });
      }
      // never go here
    }

    async _openDraft_asSimpleZero_history({ atom, user }) {
      let keyDraft;
      const changed = true;
      if (atom.atomIdDraft > 0) {
        keyDraft = { atomId: atom.atomIdDraft };
      } else {
        // ** create draft from formal
        keyDraft = await this._createDraftFromFormal({ atomIdFormal: atom.atomIdFormal, user });
      }
      // hold atomRevision
      const atomDraft = await this.modelAtom.get({ id: keyDraft.atomId });
      const atomRevision = atomDraft.atomRevision;
      // ** create draft from history
      keyDraft = await this._copy({
        target: 'draft',
        srcKey: { atomId: atom.id },
        srcItem: null,
        destKey: keyDraft,
        user,
      });
      // open
      await this._openDraft_update({
        atomId: keyDraft.atomId,
        atomRevision: atomRevision + 1,
        user,
      });
      // ok
      return { draft: { key: keyDraft }, changed };
    }

    async _openDraft_asSimpleZero_formal({ atom, user }) {
      let keyDraft;
      const changed = true;
      if (atom.atomIdDraft > 0) {
        keyDraft = { atomId: atom.atomIdDraft };
      } else {
        // ** create draft from formal
        keyDraft = await this._createDraftFromFormal({ atomIdFormal: atom.id, user });
      }
      // open
      await this._openDraft_update({
        atomId: keyDraft.atomId,
        atomRevision: atom.atomRevision + 1,
        user,
      });
      // ok
      return { draft: { key: keyDraft }, changed };
    }

    async _openDraft_asSimpleZero_draft({ atom, user }) {
      let changed = true;
      // key
      const keyDraft = { atomId: atom.id, itemId: atom.itemId };
      if (atom.atomClosed === 1) {
        // ** copy draft from formal
        if (atom.atomIdFormal > 0) {
          await this._copy({
            target: 'draft',
            srcKey: { atomId: atom.atomIdFormal },
            srcItem: null,
            destKey: keyDraft,
            user,
          });
        }
        // open
        await this._openDraft_update({
          atomId: atom.id,
          atomRevision: atom.atomRevision + 1,
          user,
        });
      } else {
        changed = false;
      }
      // ok
      return { draft: { key: keyDraft }, changed };
    }

    async _openDraft_update({ atomId, atomRevision, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId });
      await this.modelAtom.update({
        id: atomId,
        atomFlowId: 0,
        atomClosed: 0,
        atomRevision,
        userIdUpdated: user.id,
      });
      // notify
      this._notifyDraftsDrafting(null, atomClass);
    }
  }
  return Atom;
};
