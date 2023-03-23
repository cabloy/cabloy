module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async getRoleScopesOfUser({ atomClass, action, userId }) {
      // atomClass
      atomClass = await ctx.bean.atomClass.get(atomClass);
      // action
      action = ctx.bean.atomAction.parseActionCode({
        action,
        atomClass,
      });
      // cache
      const cache = ctx.bean.summer.getCache({ module: moduleInfo.relativeName, name: 'roleScopesOfUser' });
      const key = { atomClassId: atomClass.id, action, userId };
      return await cache.get(key);
    }

    async __getRoleScopesOfUserRaw({ atomClassId, action, userId }) {
      // sql
      const sql = `
        select c.roleIdWhom from aViewUserRightAtomClassRole c
          where c.iid=? and c.atomClassId=? and c.action=? and c.userIdWho=?
      `;
      const items = await ctx.model.query(sql, [ctx.instance.id, atomClassId, action, userId]);
      const roleIds = items.map(item => item.roleIdWhom);
      // false
      if (roleIds.length === 0) return false;
      // true
      const roleAuthenticated = await ctx.bean.role.getSystemRole({ roleName: 'authenticated' });
      if (roleIds.includes(roleAuthenticated.id)) return true;
      // array
      return roleIds;
    }
  }
  return Atom;
};
