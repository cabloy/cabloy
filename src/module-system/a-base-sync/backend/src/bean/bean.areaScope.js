module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AreaScope {
    getAreaScopeMeta({ atomClass, escape = true }) {
      if (!atomClass) return null;
      let atomClassBase = ctx.bean.base.atomClass(atomClass);
      while (true) {
        const meta = atomClassBase.areaScope;
        if (!meta) return null;
        if (!meta.sameAs || !escape) return meta;
        atomClassBase = ctx.bean.base.atomClass(meta.sameAs);
      }
    }
  }
  return AreaScope;
};
