module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class SummerCache {
    // key: in/notin
    async get(key) {
      const atomClasses = this.__getAtomClasses(key);
      // cache
      const cache = ctx.bean.summer.getCache({ module: moduleInfo.relativeName, name: 'atomClassInfo' });
      return await cache.mget(atomClasses);
    }

    __getAtomClasses(clause) {
      const result = [];
      const _atomClasses = ctx.bean.base.atomClasses();
      for (const module in _atomClasses) {
        const _atomClassesModule = _atomClasses[module];
        for (const atomClassName in _atomClassesModule) {
          const _atomClass = _atomClassesModule[atomClassName];
          if (clause === 'in' && _atomClass.inner) {
            result.push({ module, atomClassName });
          } else if (clause === 'notin' && !_atomClass.inner) {
            result.push({ module, atomClassName });
          }
        }
      }
      return result;
    }
  }

  return SummerCache;
};
