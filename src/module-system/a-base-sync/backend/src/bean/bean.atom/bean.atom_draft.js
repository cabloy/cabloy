const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async closeDraft({ key }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      // draft
      const atomIdDraft = key.atomId;
      const atomDraft = await this.modelAtom.get({ id: atomIdDraft });
      const user = { id: atomDraft.userIdUpdated };
      // ** update draft from formal
      if (atomDraft.atomIdFormal) {
        await this._copy({
          target: 'draft',
          srcKey: { atomId: atomDraft.atomIdFormal },
          srcItem: null,
          destKey: key,
          user,
        });
        // update atomClosed
        await this.modelAtom.update({
          id: atomIdDraft,
          atomClosed: 1,
        });
      } else {
        // not delete draft if atomFlowId>0
        if (atomDraft.atomFlowId > 0) {
          // update atomClosed
          await this.modelAtom.update({
            id: atomIdDraft,
            atomClosed: 1,
            atomRevision: atomDraft.atomRevision - 1,
          });
        } else {
          // delete
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key, user },
            fn: 'delete',
          });
        }
      }
      // notify
      this._notifyDraftsDrafting(user, atomClass);
      this._notifyDraftsFlowing(user, atomClass);
    }

    async openDraft({ key: keyOuter, atomClass: atomClassOuter, user }) {
      let { key, atom, atomClass, atomClassBase } = await this._prepareKeyAndAtomAndAtomClass({
        key: keyOuter,
        atomClass: atomClassOuter,
      });
      // check itemOnly
      if (atomClassBase.itemOnly) {
        atom.atomId = atom.id;
        atom.itemId = atom.id;
        atom.module = atomClass.module;
        atom.atomClassName = atomClass.atomClassName;
        return {
          formal: { key, atom },
          changed: false,
        };
      }
      // check simple switch
      atom = await this._checkSimpleSwitch({ atomClass, atomClassBase, atom, user });
      // open draft
      let res;
      if (atom.atomSimple) {
        // simple
        res = await this._openDraft_asSimple({ atomClass, atomClassBase, atom, user });
      } else {
        // not simple
        res = await this._openDraft_asSimpleZero({ atomClass, atomClassBase, atom, user });
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

    async _openDraft_asSimple({ atom, user }) {
      let keyFormal;
      let changed = true;
      // formal
      if (atom.atomStage === 1) {
        keyFormal = { atomId: atom.id, itemId: atom.itemId };
        changed = false;
      }
      // history
      if (atom.atomStage === 2) {
        const atomIdFormal = atom.atomIdFormal;
        keyFormal = { atomId: atomIdFormal };
        // ** copy formal from history
        keyFormal = await this._copy({
          target: 'formal',
          srcKey: { atomId: atom.id },
          srcItem: null,
          destKey: keyFormal,
          user,
        });
        // update formal
        await this.modelAtom.update({
          id: atomIdFormal,
          userIdUpdated: user.id,
        });
      }
      // ok
      return { formal: { key: keyFormal }, changed };
    }

    async _openDraft_asSimpleZero({ /* atomClass, atomClassBase,*/ atom, user }) {
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
      let changed = true;
      let atomDraft;
      if (atom.atomIdDraft > 0) {
        keyDraft = { atomId: atom.atomIdDraft };
        // check if opened
        atomDraft = await this.modelAtom.get({ id: keyDraft.atomId });
        if (atomDraft.atomClosed === 0) {
          changed = false;
        }
      } else {
        // ** create draft from formal
        keyDraft = await this._createDraftFromFormal({ atomIdFormal: atom.atomIdFormal, user });
      }
      // copy
      if (changed) {
        // hold atomRevision
        if (!atomDraft) {
          atomDraft = await this.modelAtom.get({ id: keyDraft.atomId });
        }
        const atomRevision = atomDraft.atomRevision;
        // ** copy draft from history
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
      }
      // ok
      return { draft: { key: keyDraft }, changed };
    }

    async _openDraft_asSimpleZero_formal({ atom, user }) {
      let keyDraft;
      let changed = true;
      if (atom.atomIdDraft > 0) {
        keyDraft = { atomId: atom.atomIdDraft };
        // check if opened
        const _item = await this.modelAtom.get({ id: keyDraft.atomId });
        if (_item.atomClosed === 0) {
          changed = false;
        } else {
          // ** copy draft from formal
          await this._copy({
            target: 'draft',
            srcKey: { atomId: atom.id },
            srcItem: null,
            destKey: keyDraft,
            user,
          });
        }
      } else {
        // ** create draft from formal
        keyDraft = await this._createDraftFromFormal({ atomIdFormal: atom.id, user });
      }
      // open
      if (changed) {
        await this._openDraft_update({
          atomId: keyDraft.atomId,
          atomRevision: atom.atomRevision + 1,
          user,
        });
      }
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

    async _createDraftFromFormal({ atomIdFormal, user }) {
      // ** create draft from formal
      const keyDraft = await this._copy({
        target: 'draft',
        srcKey: { atomId: atomIdFormal },
        srcItem: null,
        destKey: null,
        user,
      });
      // update history
      await ctx.model.query(
        `
          update aAtom set atomIdDraft=?
            where iid=? and deleted=0 and atomStage=2 and atomIdFormal=?
        `,
        [keyDraft.atomId, ctx.instance.id, atomIdFormal]
      );
      // update formal
      await this.modelAtom.update({
        id: atomIdFormal,
        atomIdDraft: keyDraft.atomId,
      });
      // ok
      return keyDraft;
    }
  }
  return Atom;
};
