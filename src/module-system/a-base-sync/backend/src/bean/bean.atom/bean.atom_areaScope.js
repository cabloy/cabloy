module.exports = ctx => {
  class Atom {
    async setAreaScopeValue({ atomId, atomClass, atomAreaValue }) {
      // // enabled
      // if (!ctx.bean.areaScope.areaScopeEnabled()) return;
      // meta
      const areaScopeMeta = ctx.bean.areaScope.getAreaScopeMeta({ atomClass, escape: true });
      if (!areaScopeMeta) {
        // not support area scope
        return;
      }
      // atomAreaKey
      let atomAreaKey = Object.keys(areaScopeMeta.schemas);
      const adjustRes = ctx.bean.areaScope.adjustKeyAndValue({ atomAreaKey, atomAreaValue });
      atomAreaKey = adjustRes.atomAreaKey;
      atomAreaValue = adjustRes.atomAreaValue;
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
