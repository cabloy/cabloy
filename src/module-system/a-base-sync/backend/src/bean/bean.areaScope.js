module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AreaScope {
    adjustKeyAndValue({ atomAreaKey, atomAreaValue }) {
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
      } else if (!atomAreaKey) {
        atomAreaKey = null;
      } else if (Array.isArray(atomAreaKey)) {
        atomAreaKey = atomAreaKey.join('|');
      }
      // ok
      return { atomAreaKey, atomAreaValue };
    }

    getAreaScopeMeta({ atomClass, escape = true }) {
      if (!atomClass) return null;
      let atomClassBase = ctx.bean.base.atomClass(atomClass);
      while (true) {
        const meta = atomClassBase.areaScope;
        if (!meta) return null;
        if (!meta.sameAs || !escape) return meta;
        const _atomClassBase = ctx.bean.base.atomClass(meta.sameAs);
        if (_atomClassBase === atomClassBase) return meta;
        atomClassBase = _atomClassBase;
      }
    }
  }
  return AreaScope;
};
