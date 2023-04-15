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
      }
      // atomClassBase
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // ok
      return { atomClass, atomClassBase };
    }

    async _prepareAtomAndAtomClass({ atomId, atomClass }) {
      let atom;
      if (!atomClass) {
        atom = await this.modelAtom.get({ id: atomId });
        if (!atom) ctx.throw.module(moduleInfo.relativeName, 1002);
        // atomClass
        atomClass = await ctx.bean.atomClass.get({ id: atom.atomClassId });
        if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      } else {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
        const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
        if (atomClassBase.itemOnly) {
          atom = { id: atomId };
        } else {
          atom = await this.modelAtom.get({ id: atomId });
          if (!atom) ctx.throw.module(moduleInfo.relativeName, 1002);
        }
      }
      // ok
      return { atom, atomClass };
    }
  }
  return Atom;
};
