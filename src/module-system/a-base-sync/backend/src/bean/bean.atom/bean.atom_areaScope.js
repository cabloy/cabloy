module.exports = ctx => {
  class Atom {
    async setAreaScopeValue({ atomId, atomClass, atomAreaValue }) {
      const atomClassBase = ctx.bean.base.atomClass(atomClass);
      if(!atomClassBase.areaScope) return;

      // adjust
      if(!atomAreaKey || !atomAreaValue
      await this.modelAtom.update({
        id: atomId,
        atomAreaKey,
        atomAreaValue,
      });
    }
  }
  return Atom;
};
