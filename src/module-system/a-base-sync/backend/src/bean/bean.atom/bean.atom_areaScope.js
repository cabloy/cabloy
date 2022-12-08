module.exports = ctx => {
  class Atom {
    async adjustKeyAndValue({ atomAreaKey, atomAreaValue }) {
      // atomAreaValue
      if (atomAreaValue === null || atomAreaValue === undefined || atomAreaValue === '') {
        atomAreaValue = null;
      } else if (Array.isArray(atomAreaValue)) {
        if (
          atomAreaValue.length === 0 ||
          atomAreaValue.some(item => item === null || item === undefined || item === '')
        ) {
          atomAreaValue = null;
        } else {
          atomAreaValue = atomAreaValue.join('|');
        }
      }
      // atomAreaKey
      if (!atomAreaValue) {
        atomAreaKey = null;
      } else if (Array.isArray(atomAreaKey)) {
        atomAreaKey = atomAreaKey.join('|');
      }
      // ok
      return { atomAreaKey, atomAreaValue };
    }
    async setAreaScopeValue({ atomId, atomClass, atomAreaValue }) {
      // meta
      const areaScopeMeta = ctx.bean.areaScope.getAreaScopeMeta({ atomClass, escape: true });
      if (!areaScopeMeta) {
        // not support area scope
        return;
      }
      // atomAreaKey
      let atomAreaKey = Object.keys(areaScopeMeta.schemas);
      const adjustRes = this.adjustKeyAndValue({ atomAreaKey, atomAreaValue });
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
