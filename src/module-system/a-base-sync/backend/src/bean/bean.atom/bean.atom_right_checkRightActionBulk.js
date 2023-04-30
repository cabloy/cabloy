module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
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
      const actionRes = await this.__checkRightActionBulk_fetchActions({ atomClass, atomClassBase, action, user });
      return await this.__checkRightActionBulk_check({ atomClass, atomClassBase, actionRes, stage, user });
    }

    async __checkRightActionBulk_fetchActions({ atomClass, atomClassBase, action, user }) {
      // enableRight
      const enableRight = atomClassBase.enableRight;
      if (enableRight) {
        // from db
        return await this.__checkRightActionBulk_fetchActions_fromDb({ atomClass, atomClassBase, action, user });
      }
      // from meta
      return await this.__checkRightActionBulk_fetchActions_fromMeta({
        atomClass,
        atomClassBase,
        action,
        user,
        bulk: true,
      });
    }

    async __checkRightActionBulk_fetchActions_fromMeta({ atomClass, /* atomClassBase,*/ action, user, bulk }) {
      // meta
      const _module = ctx.app.meta.modules[atomClass.module];
      const metaAtomClass = _module.main.meta.base.atoms[atomClass.atomClassName];
      const metaActions = metaAtomClass.actions;
      // actions
      let actionsRes = [];
      if (action) {
        const actionBase = ctx.bean.base.action({
          module: atomClass.module,
          atomClassName: atomClass.atomClassName,
          code: action,
        });
        if (actionBase && Boolean(actionBase.bulk) === Boolean(bulk) && metaActions[actionBase.name]) {
          actionsRes.push(actionBase);
        }
      } else {
        for (const actionName in metaActions) {
          const actionBase = ctx.bean.base.action({
            module: atomClass.module,
            atomClassName: atomClass.atomClassName,
            name: actionName,
          });
          if (actionBase && Boolean(actionBase.bulk) === Boolean(bulk)) {
            actionsRes.push(actionBase);
          }
        }
      }
      // map
      actionsRes = actionsRes.map(item => {
        return {
          id: item.code,
          iid: ctx.instance.id,
          atomClassId: atomClass.id,
          code: item.code,
          name: item.name,
          bulk: item.bulk,
          actionMode: 0,
          module: atomClass.module,
          atomClassName: atomClass.atomClassName,
        };
      });
      // ok
      if (action) return actionsRes[0];
      return actionsRes;
    }

    async __checkRightActionBulk_fetchActions_fromDb({ atomClass, atomClassBase, action, user }) {
      const params = {
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClass,
        atomClassBase,
      };
      if (action) {
        // parse action code
        action = ctx.bean.atomAction.parseActionCode({
          action,
          atomClass,
        });
        params.action = action;
      }
      // sql
      const sql = this.sqlProcedure.checkRightActionBulk(params);
      if (action) {
        return await ctx.model.queryOne(sql);
      }
      return await ctx.model.query(sql);
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
