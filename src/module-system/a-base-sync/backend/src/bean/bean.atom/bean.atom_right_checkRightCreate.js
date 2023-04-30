module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async checkRightCreate({ atomClass, user, options }) {
      return await this.checkRightActionBulk({ atomClass, action: 1, user, options });
    }

    // atomClass: { id, module, atomClassName }
    async checkRightCreateRole({ atomClass, roleIdOwner, user, options }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // normal check
      const res = await this._checkRightCreateRole_normal({ atomClass, roleIdOwner, user, options });
      if (!res) return res;
      // auth open check
      const resAuthOpenCheck = await ctx.bean.authOpen.checkRightAtomAction({ atomClass, action: 'create' });
      if (!resAuthOpenCheck) return null;
      // ok
      return res;
    }

    async _checkRightCreateRole_normal({ atomClass, roleIdOwner, user, options }) {
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // check detail
      const detailRightInherit = await this._checkDetailRightInherit({
        atomClass,
        atomClassBase,
        action: 'create',
        user,
        checkFlow: false,
        disableAuthOpenCheck: false,
        options,
      });
      if (!detailRightInherit) return null;
      // ignore itemOnly and detail
      if (atomClassBase.itemOnly) {
        return true;
      }
      // roleIdOwner not empty
      if (!roleIdOwner) return null;
      // check
      const sql = this.sqlProcedure.checkRightCreateRole({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClass,
        roleIdOwner,
      });
      return await ctx.model.queryOne(sql);
    }
  }

  return Atom;
};
