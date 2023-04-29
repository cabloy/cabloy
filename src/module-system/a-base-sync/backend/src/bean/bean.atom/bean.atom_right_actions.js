module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    // actions of atom
    async actions({ key, atomClass: atomClassOuter, options, basic, user }) {
      options = options || {};
      const containerMode = options.containerMode;
      // atomClass
      const { atomClass } = await this._prepareAtomClassAndAtomClassBase({
        key,
        atomClass: atomClassOuter,
      });
      // actions
      const _basic = basic ? 'and a.code in (3,4)' : '';
      const sql = `
        select a.*,b.module,b.atomClassName from aAtomAction a
          left join aAtomClass b on a.atomClassId=b.id
            where a.iid=? and a.deleted=0 and a.bulk=0 and a.atomClassId=? ${_basic}
              order by a.code asc
      `;
      const actions = await ctx.model.query(sql, [ctx.instance.id, atomClass.id]);
      // actions res
      const actionsRes = [];
      for (const action of actions) {
        // just for listing check, not for right check
        const actionBase = ctx.bean.base.action({
          module: action.module,
          atomClassName: action.atomClassName,
          code: action.code,
        });
        if (actionBase.containerMode && containerMode && actionBase.containerMode !== containerMode) {
          continue;
        }
        // right check
        const res = await this.checkRightAction({ atom: { id: key.atomId }, atomClass, action: action.code, user });
        if (res) {
          if (res.__task) {
            action.__task = res.__task;
          }
          actionsRes.push(action);
        }
      }
      return actionsRes;
    }
  }

  return Atom;
};
