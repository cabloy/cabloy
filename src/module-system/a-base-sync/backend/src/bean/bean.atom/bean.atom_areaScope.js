module.exports = ctx => {
  class Atom {
    async setAreaScopeValue({ atomId, atomClass, atomAreaValue }) {
      // atomAreaValue
      if (!atomAreaValue) return;
      if (Array.isArray(atomAreaValue)) {
        if (
          atomAreaValue.length === 0 ||
          atomAreaValue.some(item => item === null || item === undefined || item === '')
        ) {
          return;
        }
        atomAreaValue = atomAreaValue.join('|');
      }
      // meta
      const areaScopeMeta = ctx.bean.areaScope.getAreaScopeMeta({ atomClass, escape: true });
      if (!areaScopeMeta) return;
      // atomAreaKey
      const atomAreaKey = Object.keys(areaScopeMeta.schemas).join('|');
      // update
      await this.modelAtom.update({
        id: atomId,
        atomAreaKey,
        atomAreaValue,
      });
    }
  }
  return Atom;
};
