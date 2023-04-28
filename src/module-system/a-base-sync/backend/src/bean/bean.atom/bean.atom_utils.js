module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async _prepareAtomClassAndAtomClassBase({ key, atomClass }) {
      const atomId = key.atomId;
      // atomClass
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId });
        if (!atomClass) throw new Error(`atomClass not found for atom: ${atomId}`);
      } else {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      }
      // atomClassBase
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // ok
      return { atomClass, atomClassBase };
    }

    async _prepareKeyAndAtomAndAtomClass({ key: keyOuter, atomClass: atomClassOuter }) {
      const atomId = keyOuter.atomId;
      const { atomClass, atomClassBase } = await this._prepareAtomClassAndAtomClassBase({
        key: keyOuter,
        atomClass: atomClassOuter,
      });
      let atom, key;
      if (atomClassBase.itemOnly) {
        atom = { id: atomId, iid: ctx.instance.id };
        key = { atomId, itemId: atomId };
      } else {
        atom = await this.modelAtom.get({ id: atomId });
        if (!atom) {
          ctx.throw.module(moduleInfo.relativeName, 1002);
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
