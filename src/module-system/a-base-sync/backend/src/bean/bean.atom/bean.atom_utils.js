module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async _prepareAtomClassAndAtomClassBase({ atomId, atomClass }) {
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

    async _prepareAtomAndAtomClass({ atomId, atomClass: atomClassOuter }) {
      const { atomClass, atomClassBase } = await this._prepareAtomClassAndAtomClassBase({
        atomId,
        atomClass: atomClassOuter,
      });
      let atom;
      if (atomClassBase.itemOnly) {
        atom = { id: atomId };
      } else {
        atom = await this.modelAtom.get({ id: atomId });
        if (!atom) ctx.throw.module(moduleInfo.relativeName, 1002);
      }
      // ok
      return { atom, atomClass, atomClassBase };
    }
  }
  return Atom;
};
