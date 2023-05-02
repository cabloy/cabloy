const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    // deleteBulk
    async deleteBulk({ atomClass, keys, user }) {
      const resKeys = [];
      for (const key of keys) {
        const res = await this._deleteBulk_item({ atomClass, key, user });
        if (res) {
          resKeys.push(key);
        }
      }
      return { keys: resKeys };
    }

    // delete
    async delete({ key: keyOuter, atomClass: atomClassOuter, options: optionsOuter, user }) {
      // atomClass
      const { key, atomClass, atomClassBase, options } = await this._prepareKeyAndAtomAndAtomClass({
        key: keyOuter,
        atomClass: atomClassOuter,
        options: optionsOuter,
      });
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      // atom
      let _atom;
      if (!atomClassBase.itemOnly) {
        _atom = await this.modelAtom.get({ id: key.atomId });
        key.itemId = _atom.itemId;
      } else {
        key.itemId = key.atomId;
      }
      // itemOnly
      if (atomClassBase.itemOnly) {
        // delete as formal
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key, options, user },
          fn: 'delete',
        });
        return;
      }
      // atom
      if (_atom.atomStage === 0) {
        // close draft
        await this.closeDraft({ key });
      } else if (_atom.atomStage === 1) {
        // delete history
        const listHistory = await this.modelAtom.select({
          where: {
            atomStage: 2,
            atomIdFormal: _atom.id,
          },
        });
        for (const item of listHistory) {
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key: { atomId: item.id, itemId: item.itemId }, options, user },
            fn: 'delete',
          });
        }
        // delete draft
        const itemDraft = await this.modelAtom.get({
          atomStage: 0,
          atomIdFormal: _atom.id,
        });
        if (itemDraft) {
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key: { atomId: itemDraft.id, itemId: itemDraft.itemId }, options, user },
            fn: 'delete',
          });
          // notify
          this._notifyDraftsDrafting(null, atomClass);
        }
        // delete formal
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key: { atomId: _atom.id, itemId: _atom.itemId }, options, user },
          fn: 'delete',
        });
      } else if (_atom.atomStage === 2) {
        // delete history self
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key: { atomId: _atom.id, itemId: _atom.itemId }, options, user },
          fn: 'delete',
        });
      }
    }
  }

  return Atom;
};
