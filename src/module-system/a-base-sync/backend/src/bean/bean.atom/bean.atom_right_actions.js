module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    // actions of atom
    async actions({ key, atomClass: atomClassOuter, options, basic, user }) {
      options = options || {};
      const containerMode = options.containerMode;
      // atomClass
      const { atomClass, atomClassBase } = await this._prepareAtomClassAndAtomClassBase({
        key,
        atomClass: atomClassOuter,
      });
      // actions
      const actionsRes = await this.__actions_fetchActions({ atomClass, atomClassBase, basic, user });
      // actions res
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
        const _resCheck = await this.checkRightAction({
          atom: { id: key.atomId },
          atomClass,
          action: actionRes.code,
          options,
          user,
        });
        if (_resCheck) {
          if (_resCheck.__task) {
            actionRes.__task = _resCheck.__task;
          }
          results.push(actionRes);
        }
      }
      return results;
    }

    async __actions_fetchActions({ atomClass, atomClassBase, basic, user }) {
      // enableRight
      const enableRight = atomClassBase.enableRight;
      if (enableRight) {
        // from db
        return await this.__actions_fetchActions_fromDb({ atomClass, atomClassBase, basic, user });
      }
      // from meta
      return await this.__actions_fetchActions_fromMeta({ atomClass, atomClassBase, basic, user });
    }

    async __actions_fetchActions_fromDb({ atomClass, /* atomClassBase,*/ basic, user }) {
      const _basic = basic ? 'and a.code in (3,4)' : '';
      const sql = `
        select a.*,b.module,b.atomClassName from aAtomAction a
          left join aAtomClass b on a.atomClassId=b.id
            where a.iid=? and a.deleted=0 and a.bulk=0 and a.atomClassId=? ${_basic}
              order by a.code asc
      `;
      return await ctx.model.query(sql, [ctx.instance.id, atomClass.id]);
    }

    async __actions_fetchActions_fromMeta({ atomClass, atomClassBase, basic, user }) {
      // basic
      if (basic) {
        const actionsRes = [];
        for (const actionName of ['write', 'delete']) {
          const actionRes = await this.__checkRightActionBulk_fetchActions_fromMeta({
            atomClass,
            atomClassBase,
            action: actionName,
            user,
            bulk: false,
          });
          if (actionRes) {
            actionsRes.push(actionRes);
          }
        }
        return actionsRes;
      }
      // all
      return await this.__checkRightActionBulk_fetchActions_fromMeta({
        atomClass,
        atomClassBase,
        user,
        bulk: false,
      });
    }
  }

  return Atom;
};
