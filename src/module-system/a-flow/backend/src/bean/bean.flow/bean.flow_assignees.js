const __VARTITLES = {
  flowUser: 'FlowInitiator',
  auto: 'FlowVarAutoPick',
};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Flow {
    async normalizeAssignees({ users, roles, vars }) {
      const assignees = {};
      assignees.users = await this._normalizeAssignees_users(users);
      assignees.roles = await this._normalizeAssignees_roles(roles);
      assignees.vars = await this._normalizeAssignees_vars(vars);
      return assignees;
    }

    async _normalizeAssignees_users(str) {
      if (!str) return [];
      // userIds
      const userIds = await this._adjustAssignees_userIds(str);
      if (userIds.length === 0) return [];
      // select
      return await ctx.bean.user.select({
        options: {
          where: {
            'f.disabled': 0,
            'f.id': userIds,
          },
          orders: [['f.userName', 'asc']],
          removePrivacy: true,
        },
      });
    }

    async _normalizeAssignees_roles(str) {
      if (!str) return [];
      // roleIds
      const roleIds = await this._adjustAssignees_roleIds(str);
      if (roleIds.length === 0) return [];
      // select
      return await ctx.bean.role.model.select({
        where: {
          id: roleIds,
        },
      });
    }

    async _normalizeAssignees_vars(str) {
      if (!str) return [];
      // vars
      const _vars = await this._adjustAssignees_vars(str);
      // title
      return _vars.map(item => {
        const title = __VARTITLES[item] || item;
        // others
        return {
          name: item,
          title,
          titleLocale: ctx.text(title),
        };
      });
    }

    async _adjustAssignees_userIds(str) {
      if (!str) return null;
      if (!Array.isArray(str)) {
        str = str.toString().split(',');
      }
      return str.map(item => {
        return typeof item === 'object' ? item.id : parseInt(item);
      });
    }

    async _adjustAssignees_roleIds(str) {
      if (!str) return null;
      if (!Array.isArray(str)) {
        str = str.toString().split(',');
      }
      const arr = [];
      for (const item of str) {
        if (typeof item === 'object') {
          // object
          arr.push(item.id);
        } else if (isNaN(item)) {
          // string
          const role = await ctx.bean.role.parseRoleName({ roleName: item });
          if (!role) ctx.throw.module(moduleInfo.relativeName, 1007, item);
          arr.push(role.id);
        } else {
          // number
          arr.push(item);
        }
      }
      // ok
      return arr;
    }

    async _adjustAssignees_vars(str) {
      if (!str) return null;
      if (!Array.isArray(str)) {
        str = str.toString().split(',');
      }
      return str.map(item => {
        return typeof item === 'object' ? item.name : item;
      });
    }
  }

  return Flow;
};
