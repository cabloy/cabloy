module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowInstance {
    async _parseAssignees({ nodeInstance, assignees }) {
      const { users, roles, vars } = assignees;
      // init
      let userIds = [];

      // 1. users
      const _users = await this._parseAssignees_users(users);
      if (_users) {
        userIds = userIds.concat(_users);
      }

      // 2. roles
      const _roles = await this._parseAssignees_roles(roles);
      if (_roles) {
        userIds = userIds.concat(_roles);
      }

      // 3. vars
      const _vars = await this._parseAssignees_vars({ nodeInstance, vars });
      if (_vars) {
        userIds = userIds.concat(_vars);
      }

      // unique
      userIds = Set.unique(userIds);

      // ok
      return userIds;
    }

    async _parseAssignees_users(str) {
      if (!str) return null;
      return await ctx.bean.flow._adjustAssignees_userIds(str);
    }

    async _parseAssignees_roles(str) {
      if (!str) return null;
      // roleIds
      const roleIds = await ctx.bean.flow._adjustAssignees_roleIds(str);
      // users
      let users = [];
      for (const roleId of roleIds) {
        const list = await ctx.bean.role.usersOfRoleParent({ roleId, disabled: 0, removePrivacy: true });
        users = users.concat(list.map(item => item.id));
      }
      // ok
      return users;
    }

    async _parseAssignees_vars({ nodeInstance, vars }) {
      if (!vars) return null;
      // vars
      const _vars = await ctx.bean.flow._adjustAssignees_vars(vars);
      // users
      let users = [];
      for (const _var of _vars) {
        const userId = await this._parseUserVar({ nodeInstance, _var });
        if (userId) {
          if (Array.isArray(userId)) {
            users = users.concat(userId);
          } else {
            users.push(userId);
          }
        }
      }
      // ok
      return users;
    }

    async _parseUserVar({ nodeInstance, _var }) {
      // flowUser
      if (_var === 'flowUser') {
        return this._parseUserVar_flowUser({ nodeInstance });
      }
      // auto
      if (_var === 'auto') {
        return await this._parseUserVar_auto({ nodeInstance });
      }
    }

    _parseUserVar_flowUser(/* { nodeInstance }*/) {
      return this.context._flow.flowUserId;
    }

    async _parseUserVar_auto({ nodeInstance }) {
      const flowKey = this.context._flowDef.atomStaticKey;
      const nodeDefId = nodeInstance.contextNode._nodeDef.id;
      const nodeDefName = nodeInstance.contextNode._nodeDef.name;
      const atom = this.context.atom;
      // get action
      const action = await ctx.bean.atomAction.getByModeFlow({
        atomClassId: atom.atomClassId,
        flowKey,
        nodeDefId,
        nodeDefName,
      });
      const sql = `
          select * from aViewUserRightAtomClassRole
            where iid=? and atomClassId=? and action=? and roleIdWhom=?
      `;
      const items = await ctx.model.query(sql, [
        //
        atom.iid,
        atom.atomClassId,
        action.code,
        atom.roleIdOwner,
      ]);
      // ok
      return items.map(item => item.userIdWho);
    }
  }

  return FlowInstance;
};
