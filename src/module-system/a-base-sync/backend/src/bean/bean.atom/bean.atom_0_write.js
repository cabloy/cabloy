const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    // write
    //   target: should be null for frontend call
    async write({ key: keyOuter, atomClass: atomClassOuter, options: optionsOuter, target, item, user }) {
      // atomClass
      const {
        key,
        atom: _atomBasic,
        atomClass,
        atomClassBase,
        options,
      } = await this._prepareKeyAndAtomAndAtomClass({
        key: keyOuter,
        atomClass: atomClassOuter,
        options: optionsOuter,
      });
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      // support formal flow
      // if (_atomBasic.atomStage !== _atomBasic.atomSimple) ctx.throw(403);
      if (!atomClassBase.itemOnly) {
        if (_atomBasic.atomSimple) {
          if (atomClassBase.history !== false) {
            //  formal -> history
            await this._copy({
              target: 'history',
              atomClass,
              srcKey: { atomId: key.atomId },
              srcItem: null,
              destKey: null,
              options,
              user,
            });
          }
        }
      }
      // write draft/formal(simple)
      let itemWrite;
      if (!atomClassBase.itemOnly) {
        itemWrite = Object.assign({}, item, {
          atomId: key.atomId,
          itemId: key.itemId,
          atomSimple: _atomBasic.atomSimple,
          atomStage: _atomBasic.atomSimple ? 1 : _atomBasic.atomStage,
        });
      } else {
        itemWrite = Object.assign({}, item, {
          atomId: key.atomId,
          itemId: key.itemId,
        });
      }
      // write
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, target, key, item: itemWrite, options, user },
        fn: 'write',
      });
      // update formal version for simple
      if (!atomClassBase.itemOnly) {
        if (_atomBasic.atomSimple) {
          await this.modelAtom.update({
            id: key.atomId,
            atomRevision: _atomBasic.atomRevision + 1,
          });
        }
      }
    }

    async _update({ atom /* , user,*/ }) {
      await this.modelAtom.update(atom);
    }
  }

  return Atom;
};
