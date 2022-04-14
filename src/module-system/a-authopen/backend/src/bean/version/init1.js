module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionInit {
    async run(options) {
      // rights
      await this._init_rights();
      // open auth scopes
      await this._init_scopes();
    }

    async _init_rights() {
      // add role rights
      const roleRights = [
        { roleName: 'authenticated', action: 'create' },
        { roleName: 'authenticated', action: 'read', scopeNames: 0 },
        { roleName: 'authenticated', action: 'write', scopeNames: 0 },
        { roleName: 'authenticated', action: 'delete', scopeNames: 0 },
        { roleName: 'authenticated', action: 'clone', scopeNames: 0 },
        { roleName: 'authenticated', action: 'deleteBulk' },
        { roleName: 'authenticated', action: 'exportBulk' },
        { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
      ];
      await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'authOpen', roleRights });
    }

    async _init_scopes() {
      // const roleIds = {};
      // roleIds.system = 0;
      // // system roles
      // for (const roleName of ctx.constant.systemRoles) {
      //   const role = extend(true, { module: moduleInfo.relativeName }, initData.roles[roleName]);
      //   role.roleIdParent = roleIds[role.roleIdParent];
      //   roleIds[roleName] = await ctx.bean.role.add(role);
      // }
      // return roleIds;
    }
  }
  return VersionInit;
};
