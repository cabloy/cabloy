module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassRole = {
    module: moduleInfo.relativeName,
    atomClassName: 'role',
  };
  const __atomClassUser = {
    module: moduleInfo.relativeName,
    atomClassName: 'user',
  };

  class Role {
    async getUserRolesDirect({ userId }) {
      const list = await ctx.model.query(
        `
        select a.* from aRole a
          left join aUserRole b on a.id=b.roleId
            where a.iid=? and b.userId=?
        `,
        [ctx.instance.id, userId]
      );
      return list;
    }

    async getUserRolesParent({ userId }) {
      const list = await ctx.model.query(
        `
        select a.* from aRole a
          left join aViewUserRoleRef b on a.id=b.roleIdParent
            where a.iid=? and b.userId=?
        `,
        [ctx.instance.id, userId]
      );
      return list;
    }

    async getUserRolesExpand({ userId }) {
      const list = await ctx.model.query(
        `
        select a.* from aRole a
          left join aViewUserRoleExpand b on a.id=b.roleIdBase
            where a.iid=? and b.userId=?
        `,
        [ctx.instance.id, userId]
      );
      return list;
    }

    async userInRoleDirect({ userId, roleId }) {
      const list = await ctx.model.query(
        `
        select count(*) as count from aUserRole a
          where a.iid=? and a.userId=? and a.roleId=?
        `,
        [ctx.instance.id, userId, roleId]
      );
      return list[0].count > 0;
    }

    async userInRoleParent({ userId, roleId }) {
      const list = await ctx.model.query(
        `
        select count(*) as count from aViewUserRoleRef a
          where a.iid=? and a.userId=? and a.roleIdParent=?
        `,
        [ctx.instance.id, userId, roleId]
      );
      return list[0].count > 0;
    }

    async userInRoleExpand({ userId, roleId }) {
      const list = await ctx.model.query(
        `
        select count(*) as count from aViewUserRoleExpand a
          where a.iid=? and a.userId=? and a.roleIdBase=?
        `,
        [ctx.instance.id, userId, roleId]
      );
      return list[0].count > 0;
    }

    async usersOfRoleDirect({ roleId, disabled, page, removePrivacy }) {
      // disabled
      let _disabled = '';
      if (disabled !== undefined) {
        _disabled = `and disabled=${parseInt(disabled)}`;
      }
      // page
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      // fields
      const fields = await ctx.bean.user.getFieldsSelect({ removePrivacy, alias: 'a' });
      // query
      const list = await ctx.model.query(
        `
        select ${fields} from aUser a
          inner join aUserRole b on a.id=b.userId
            where a.iid=? and a.deleted=0 ${_disabled} and b.roleId=?
            order by a.userName
            ${_limit}
        `,
        [ctx.instance.id, roleId]
      );
      return list;
    }

    async usersOfRoleParent({ roleId, disabled, page, removePrivacy, query }) {
      // disabled
      let _disabled = '';
      if (disabled !== undefined) {
        _disabled = `and disabled=${parseInt(disabled)}`;
      }
      // page
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      // fields
      const fields = await ctx.bean.user.getFieldsSelect({ removePrivacy, alias: 'a' });
      // query
      let where;
      if (query) {
        const clause = {};
        clause.__or__ = [
          { 'a.userName': { op: 'like', val: query } },
          { 'a.realName': { op: 'like', val: query } },
          { 'a.mobile': { op: 'like', val: query } },
        ];
        where = ctx.model._where(clause);
      }
      where = where ? `${where} AND` : ' WHERE';
      // select
      const list = await ctx.model.query(
        `
        select ${fields} from aUser a
          inner join aViewUserRoleRef b on a.id=b.userId
            ${where} a.iid=? and a.deleted=0 ${_disabled} and b.roleIdParent=?
            order by a.userName
            ${_limit}
        `,
        [ctx.instance.id, roleId]
      );
      return list;
    }

    async usersOfRoleExpand({ roleId, disabled, page, removePrivacy }) {
      // disabled
      let _disabled = '';
      if (disabled !== undefined) {
        _disabled = `and disabled=${parseInt(disabled)}`;
      }
      // page
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      // fields
      const fields = await ctx.bean.user.getFieldsSelect({ removePrivacy, alias: 'a' });
      // query
      const list = await ctx.model.query(
        `
        select ${fields} from aUser a
          inner join aViewUserRoleExpand b on a.id=b.userId
            where a.iid=? and a.deleted=0 ${_disabled} and b.roleIdBase=?
            order by a.userName
            ${_limit}
        `,
        [ctx.instance.id, roleId]
      );
      return list;
    }

    async _forceRoleAtomId({ roleAtomId, roleId }) {
      if (!roleAtomId) {
        const item = await this.get({ id: roleId });
        roleAtomId = item.atomId;
      }
      return roleAtomId;
    }

    async _forceRoleId({ roleAtomId, roleId }) {
      if (!roleId) {
        const item = await this.get({ atomId: roleAtomId });
        roleId = item.id;
      }
      return roleId;
    }

    async _forceRole({ roleAtomId, roleId }) {
      if (roleAtomId) {
        return await this.get({ atomId: roleAtomId });
      }
      return await this.get({ id: roleId });
    }

    async _forceRoleAndCheckRightRead({ roleAtomId, roleId, user }) {
      const role = await this._forceRole({ roleAtomId, roleId });
      if (!user || user.id === 0) return role;
      // check
      const res = await ctx.bean.atom.checkRightRead({
        atom: { id: role.atomId },
        user,
      });
      if (!res) ctx.throw(403);
      return role;
    }

    async _checkRightActionOfRole({ roleAtomId, roleId, action, user }) {
      if (!user || user.id === 0) return true;
      // roleId
      roleAtomId = await this._forceRoleAtomId({ roleAtomId, roleId });
      // check
      const res = await ctx.bean.atom.checkRightAction({
        atom: { id: roleAtomId },
        action,
        user,
      });
      return !!res;
    }
  }

  return Role;
};
