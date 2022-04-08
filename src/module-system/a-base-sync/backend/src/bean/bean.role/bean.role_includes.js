module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassRole = {
    module: moduleInfo.relativeName,
    atomClassName: 'role',
  };

  class Role {
    // includes
    async includes({ roleAtomId, roleId, page, user }) {
      // user, not check user right scope
      user = { id: 0 };
      //
      roleId = await this._forceRoleId({ roleAtomId, roleId });
      page = ctx.bean.util.page(page, false);
      // where
      const where = { 'f.roleIdWho': roleId };
      // select
      const list = await ctx.bean.atom.select({
        atomClass: __atomClassRole,
        options: {
          orders: [['f.roleName', 'asc']],
          page,
          stage: 'formal',
          where,
          mode: 'includes',
        },
        user,
      });
      return list;
    }

    // add role include
    async addRoleInc({ roleAtomId, roleId, roleIdInc }) {
      roleId = await this._forceRoleId({ roleAtomId, roleId });
      const res = await this.modelRoleInc.insert({
        roleId,
        roleIdInc,
      });
      const id = res.insertId;

      // set dirty
      await this.setDirty(true);

      return id;
    }

    // remove role include
    async removeRoleInc({ roleAtomId, roleId, roleIdInc }) {
      roleId = await this._forceRoleId({ roleAtomId, roleId });
      await this.modelRoleInc.delete({ roleId, roleIdInc });

      // set dirty
      await this.setDirty(true);
    }
  }

  return Role;
};

// // includes
// async includes({ roleAtomId, roleId, page, user }) {
//   roleId = await this._forceRoleId({ roleAtomId, roleId });
//   page = ctx.bean.util.page(page, false);
//   const _limit = ctx.model._limit(page.size, page.index);
//   const list = await ctx.model.query(
//     `
//     select a.*,b.roleName from aRoleInc a
//       left join aRole b on a.roleIdInc=b.id
//         where a.iid=? and a.roleId=?
//         ${_limit}
//     `,
//     [ctx.instance.id, roleId]
//   );
//   return list;
// }
