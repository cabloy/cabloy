module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async checkRightCreate({ atomClass, user }) {
      return await this.checkRightActionBulk({ atomClass, action: 1, user });
    }

    // atomClass: { id, module, atomClassName }
    async checkRightCreateRole({ atomClass, roleIdOwner, user, options }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
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
      // auth open check
      const resAuthOpenCheck = await ctx.bean.authOpen.checkRightAtomAction({ atomClass, action: 'create' });
      if (!resAuthOpenCheck) return null;
      // ignore itemOnly and detail
      if (atomClassBase.itemOnly) {
        return true;
      }
      // normal check
      return await this._checkRightCreateRole_normal({ atomClass, roleIdOwner, user });
    }

    async _checkRightCreateRole_normal({ atomClass, roleIdOwner, user }) {
      if (!roleIdOwner) return null;
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
