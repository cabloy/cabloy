module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async _checkDetailRightInherit({
      atomClass,
      atomClassBase,
      action,
      user,
      stage,
      checkFlow,
      disableAuthOpenCheck,
      options,
    }) {
      // atomIdMain
      const atomIdMain = options?.atomIdMain;
      // atomClassBase
      if (!atomClassBase) {
        atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      }
      // detail
      if (!atomClassBase.detail) return true;
      // atomClassMain
      const atomClassMain = atomClassBase.detail.atomClassMain;
      // action
      const actionBase = ctx.bean.base.action({
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
        name: action,
      });
      const rightInherit = actionBase.rightInherit;
      if (!rightInherit) {
        // do nothing
        return true;
      }
      // atomIdMain should exists, so throw error better than return false
      if (!atomIdMain) ctx.throw(403);
      // check
      const detailRightInherit = { atomIdMain, atomClassMain, rightInherit };
      return await this._checkDetailRightInherit_perform({
        detailRightInherit,
        user,
        stage,
        checkFlow,
        disableAuthOpenCheck,
        options,
      });
    }

    async _checkDetailRightInherit_perform({
      detailRightInherit,
      user,
      stage,
      checkFlow,
      disableAuthOpenCheck,
      options,
    }) {
      const { atomIdMain, atomClassMain, rightInherit } = detailRightInherit;
      // options
      options = { ...options, atomIdMain: undefined };
      // check rightInherit
      if (rightInherit === 'read') {
        return await this.checkRightRead({
          atom: { id: atomIdMain },
          atomClass: atomClassMain,
          user,
          checkFlow,
          disableAuthOpenCheck,
          options,
        });
      }
      // others
      return await this.checkRightAction({
        atom: { id: atomIdMain },
        atomClass: atomClassMain,
        action: rightInherit,
        user,
        stage,
        checkFlow,
        disableAuthOpenCheck,
        options,
      });
    }
  }

  return Atom;
};
