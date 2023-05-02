module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async _prepareAtomClassAndAtomClassBase({ key, atomClass, throwWhenEmpty = true }) {
      const atomId = key.atomId;
      // atomClass
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId });
        if (!atomClass) {
          if (throwWhenEmpty) {
            throw new Error(`atomClass not found for atom: ${atomId}`);
          } else {
            return null;
          }
        }
      } else {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      }
      // atomClassBase
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // ok
      return { atomClass, atomClassBase };
    }

    async _prepareKeyAndAtomAndAtomClass({ key: keyOuter, atomClass: atomClassOuter, options, throwWhenEmpty = true }) {
      const atomId = keyOuter.atomId;
      const res = await this._prepareAtomClassAndAtomClassBase({
        key: keyOuter,
        atomClass: atomClassOuter,
        throwWhenEmpty,
      });
      if (!res) return res;
      const { atomClass, atomClassBase } = res;
      let atom, key;
      if (atomClassBase.itemOnly) {
        console.log('--- model: ', atomClassBase.model);
        atom = { id: atomId, iid: ctx.instance.id };
        key = { atomId, itemId: atomId };
      } else {
        atom = await this.modelAtom.get({ id: atomId });
        if (!atom) {
          if (throwWhenEmpty) {
            ctx.throw.module(moduleInfo.relativeName, 1002);
          } else {
            return null;
          }
        }
        if (atom.atomClassId !== atomClass.id) ctx.throw(403);
        key = { atomId, itemId: atom.itemId };
      }
      atom = {
        ...atom,
        atomId: key.atomId,
        itemId: key.itemId,
        atomClassId: atomClass.id,
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
      };
      // ok
      return { key, atom, atomClass, atomClassBase };
    }
  }
  return Atom;
};
