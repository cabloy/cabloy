module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AreaScope {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    areaScopeEnabled() {
      return this.configModule.configFront.areaScope.enable;
    }

    _checkIfEmpty(value) {
      return value === null || value === undefined || value === '';
    }

    adjustValue({ atomAreaValue, trimEnd = false }) {
      // check if empty
      if (this._checkIfEmpty(atomAreaValue)) return null;
      if (!Array.isArray(atomAreaValue)) {
        atomAreaValue = atomAreaValue.split('|');
      }
      if (atomAreaValue.length === 0) return null;
      // clear tailing empty
      let hasTailingEmpty = false;
      for (let i = atomAreaValue.length - 1; i >= 0; i--) {
        if (this._checkIfEmpty(atomAreaValue[i])) {
          hasTailingEmpty = true;
          atomAreaValue.splice(i, 1);
        } else {
          break;
        }
      }
      if (atomAreaValue.length === 0) return null;
      // check middle empty
      if (atomAreaValue.some(item => this._checkIfEmpty(item))) {
        return null; // invalid
      }
      // append tailing
      if (hasTailingEmpty && !trimEnd) {
        atomAreaValue.push('');
      }
      return atomAreaValue.join('|');
    }

    adjustKeyAndValue({ atomAreaKey, atomAreaValue, trimEnd = false }) {
      // atomAreaValue
      atomAreaValue = this.adjustValue({ atomAreaValue, trimEnd });
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
