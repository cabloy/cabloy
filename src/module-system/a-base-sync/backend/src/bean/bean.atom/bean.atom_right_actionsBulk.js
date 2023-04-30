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
      const res = [];
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
        const _res = await this.__checkRightActionBulk_check({
          atomClass,
          atomClassBase,
          actionRes,
          stage,
          options,
          user,
        });
        if (_res) {
          res.push(_res);
        }
      }
      return res;
    }

    // atomClass: { id, module, atomClassName }
    async checkRightActionBulk({ atomClass, action, stage, user }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // normal check
      const res = await this._checkRightActionBulk_normal({ atomClass, action, stage, user });
      if (!res) return res;
      // auth open check
      const resAuthOpenCheck = await ctx.bean.authOpen.checkRightAtomAction({ atomClass, action });
      if (!resAuthOpenCheck) return null;
      // ok
      return res;
    }

    async _checkRightActionBulk_normal({ atomClass, action, stage, user }) {
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      const actionRes = await this.__checkRightActionBulk_fetchAction({ atomClass, atomClassBase, action, user });
      return await this.__checkRightActionBulk_check({ atomClass, atomClassBase, actionRes, stage, user });
    }

    async __checkRightActionBulk_fetchActions({ atomClass, atomClassBase, user }) {
      const sql = this.sqlProcedure.checkRightActionBulk({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClass,
        atomClassBase,
      });
      const actionsRes = await ctx.model.query(sql);
      return actionsRes;
    }

    async __checkRightActionBulk_fetchAction({ atomClass, atomClassBase, action, user }) {
      // parse action code
      action = ctx.bean.atomAction.parseActionCode({
        action,
        atomClass,
      });
      // check right
      const sql = this.sqlProcedure.checkRightActionBulk({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClass,
        atomClassBase,
        action,
      });
      const actionRes = await ctx.model.queryOne(sql);
      return actionRes;
    }

    async __checkRightActionBulk_check({ atomClass, atomClassBase, actionRes, stage, options, user }) {
      if (!actionRes) return actionRes;
      // check detail
      const detailRightInherit = await this._checkDetailRightInherit({
        atomClass,
        atomClassBase,
        action: actionRes.name,
        user,
        checkFlow: false,
        disableAuthOpenCheck: false,
        options,
      });
      if (!detailRightInherit) return null;
      // check if itemOnly
      if (atomClassBase.itemOnly) return actionRes;
      // not care about stage
      if (!stage) return actionRes;
      // action base
      const actionBase = ctx.bean.base.action({
        module: actionRes.module,
        atomClassName: actionRes.atomClassName,
        code: actionRes.code,
      });
      if (!actionBase) {
        if (actionRes.code < 10000) {
          await ctx.bean.atomAction.delete({ atomClassId: actionRes.atomClassId, code: actionRes.code });
        }
        return null;
      }
      if (actionBase.stage) {
        const stages = actionBase.stage.split(',');
        if (!stages.some(item => item === stage)) return null;
      }
      return actionRes;
    }
  }

  return Atom;
};
