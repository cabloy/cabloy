module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    // actionsBulk of atomClass
    async actionsBulk({ atomClass, stage, options, user }) {
      options = options || {};
      const containerMode = options.containerMode;
      atomClass = await ctx.bean.atomClass.get(atomClass);
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      const actionsRes = await this.__checkRightActionBulk_fetchActions({ atomClass, atomClassBase, user });
      const results = [];
      for (const actionRes of actionsRes) {
        // just for listing check, not for right check
        const actionBase = ctx.bean.base.action({
          module: actionRes.module,
          atomClassName: actionRes.atomClassName,
          code: actionRes.code,
        });
        if (actionBase.containerMode && containerMode && actionBase.containerMode !== containerMode) {
          continue;
        }
        // right check
        const _resCheck = await this.__checkRightActionBulk_check({
          atomClass,
          atomClassBase,
          actionRes,
          stage,
          options,
          user,
        });
        if (_resCheck) {
          results.push(_resCheck);
        }
      }
      return results;
    }
  }

  return Atom;
};
