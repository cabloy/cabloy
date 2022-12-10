const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  class Atom {
    async setAreaScopeValue({ atomId, atomClass, atomAreaValue }) {
      // // enabled
      // if (!ctx.bean.areaScope.areaScopeEnabled()) return;
      // meta
      const areaScopeMeta = ctx.bean.areaScope.getAreaScopeMeta({ atomClass, escape: false });
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

    async translateAreaScopeValue({ atomClass, atomAreaKey, atomAreaValue }) {
      // adjust
      const adjustRes = ctx.bean.areaScope.adjustKeyAndValue({ atomAreaKey, atomAreaValue });
      atomAreaKey = adjustRes.atomAreaKey;
      atomAreaValue = adjustRes.atomAreaValue;
      if (!atomAreaKey || !atomAreaValue) return null;
      // check if areaScopeMeta
      const areaScopeMeta = ctx.bean.areaScope.getAreaScopeMeta({ atomClass, escape: false });
      if (!areaScopeMeta) {
        ctx.logger.info(`areaScope of atomClass not found: ${atomClass.module}:${atomClass.atomClassName}`);
        return { error: ctx.text('Invalid') };
      }
      // atomClass
      atomClass = await ctx.bean.atomClass.get(atomClass);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      // check if atomAreaKey equal
      const atomAreaKeySchema = Object.keys(areaScopeMeta.schemas).join('|');
      if (atomAreaKey !== atomAreaKeySchema) {
        return { error: ctx.text('Invalid') };
      }
      // adjust again
      atomAreaKey = atomAreaKey.split('|');
      atomAreaValue = atomAreaValue.split('|');
      // translate { title, error }
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      const res = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, areaScopeMeta, atomAreaKey, atomAreaValue },
        fn: 'translateAreaScopeValue',
      });
      if (res) {
        res.title = ctx.bean.areaScope.adjustValue({ atomAreaValue: res.title, trimEnd: true });
        res.titleLocale = ctx.bean.areaScope.adjustValue({ atomAreaValue: res.titleLocale, trimEnd: true });
      }
      return res;
    }
  }
  return Atom;
};
