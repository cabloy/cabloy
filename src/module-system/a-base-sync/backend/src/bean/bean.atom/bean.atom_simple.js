const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async _switchToSimple({ atomClass, _atomClass, atom, user }) {
      let atomIdDraft;
      let atomIdFormal;
      if (atom.atomStage === 0) {
        // is draft
        atomIdDraft = atom.id;
        atomIdFormal = atom.atomIdFormal;
        if (!atomIdFormal) {
          // formal/history not exists, so copy it
          // create formal
          const srcItem = await ctx.bean.atom.read({ key: { atomId: atomIdDraft }, user });
          srcItem.atomSimple = 1; // important
          const keyFormal = await this._copy({
            target: 'formal',
            srcKey: { atomId: atomIdDraft },
            srcItem,
            destKey: null,
            options: null,
            user,
          });
          atomIdFormal = keyFormal.atomId;
        }
      } else {
        // is formal/history
        atomIdDraft = atom.atomIdDraft;
        atomIdFormal = atom.atomStage === 1 ? atom.id : atom.atomIdFormal;
      }
      // update history
      await ctx.model.query(
        `
          update aAtom set atomSimple=1, atomIdDraft=0 
            where iid=? and deleted=0 and atomStage=2 and atomIdFormal=?
        `,
        [ctx.instance.id, atomIdFormal]
      );
      // update formal
      await this.modelAtom.update({
        id: atomIdFormal,
        atomSimple: 1,
        atomIdDraft: 0,
      });
      // delete draft
      if (atomIdDraft) {
        const atomDraft = atom.atomStage === 0 ? atom : await this.modelAtom.get({ id: atomIdDraft });
        const keyDraft = { atomId: atomDraft.id, itemId: atomDraft.itemId };
        const _moduleInfo = mparse.parseInfo(atomClass.module);
        const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key: keyDraft, user },
          fn: 'delete',
        });
        // notify to change draft stats
        this._notifyDraftsDrafting(null, atomClass);
      }
      // ok
      if (atom.atomStage === 0) {
        // fetch formal
        return await this.modelAtom.get({ id: atomIdFormal });
      }
      atom.atomSimple = 1;
      return atom;
    }

    async _switchToSimpleZero({ /* atomClass, _atomClass,*/ atom, user }) {
      const atomIdFormal = atom.atomStage === 1 ? atom.id : atom.atomIdFormal;
      // update history's atomSimple
      await ctx.model.query(
        `
          update aAtom set atomSimple=0
            where iid=? and deleted=0 and atomStage=2 and atomIdFormal=?
        `,
        [ctx.instance.id, atomIdFormal]
      );
      // update formal's atomSimple
      await this.modelAtom.update({
        id: atomIdFormal,
        atomSimple: 0,
      });
      // ** create draft from formal
      const keyDraft = await this._createDraftFromFormal({ atomIdFormal, user });
      // update draft's atomClosed
      await this.modelAtom.update({
        id: keyDraft.atomId,
        atomClosed: 1,
      });
      // ok
      atom.atomSimple = 0;
      return atom;
    }

    async _checkSimpleSwitch({ atomClass, _atomClass, atom, user }) {
      // the same mode
      if (Boolean(atom.atomSimple) === Boolean(_atomClass.simple)) return atom;
      // -> simple
      if (_atomClass.simple) {
        return await this._switchToSimple({ atomClass, _atomClass, atom, user });
      }
      // -> not simple
      return await this._switchToSimpleZero({ atomClass, _atomClass, atom, user });
    }
  }
  return Atom;
};
