module.exports = function (ctx) {
  class VersionInit {
    async run() {
      await this._addRoleRightsResource();
      await this._addRoleRightsRole();
      await this._addRoleRightsUser();
    }

    async _addRoleRightsResource() {
      // add role rights
      const roleRights = [
        { roleName: 'system', action: 'create' },
        { roleName: 'system', action: 'read', scopeNames: 0 },
        { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'write', scopeNames: 0 },
        { roleName: 'system', action: 'write', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'delete', scopeNames: 0 },
        { roleName: 'system', action: 'delete', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'clone', scopeNames: 0 },
        { roleName: 'system', action: 'clone', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'enable', scopeNames: 0 },
        { roleName: 'system', action: 'enable', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'disable', scopeNames: 0 },
        { roleName: 'system', action: 'disable', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'authorize', scopeNames: 0 },
        { roleName: 'system', action: 'authorize', scopeNames: 'authenticated' },
        { roleName: 'system', action: 'deleteBulk' },
        { roleName: 'system', action: 'exportBulk' },
      ];
      await ctx.bean.role.addRoleRightBatch({ atomClassName: 'resource', roleRights });
    }

    async _addRoleRightsRole() {
      // add role rights
      const roleRights = [
        // { roleName: 'system', action: 'create' },
        // { roleName: 'system', action: 'read', scopeNames: 0 },
        // { roleName: 'system', action: 'write', scopeNames: 0 },
        // { roleName: 'system', action: 'delete', scopeNames: 0 },
        // { roleName: 'system', action: 'clone', scopeNames: 0 },
        // { roleName: 'system', action: 'enable', scopeNames: 0 },
        // { roleName: 'system', action: 'enable', scopeNames: 'root' },
        // { roleName: 'system', action: 'disable', scopeNames: 0 },
        // { roleName: 'system', action: 'disable', scopeNames: 'root' },
        // { roleName: 'system', action: 'authorize', scopeNames: 0 },
        // { roleName: 'system', action: 'authorize', scopeNames: 'root' },
        { roleName: 'system', action: 'read', scopeNames: 'root' },
        { roleName: 'system', action: 'write', scopeNames: 'root' },
        { roleName: 'system', action: 'delete', scopeNames: 'root' },
        { roleName: 'system', action: 'clone', scopeNames: 'root' },
        { roleName: 'system', action: 'move', scopeNames: 'root' },
        { roleName: 'system', action: 'addChild', scopeNames: 'root' },
        { roleName: 'system', action: 'roleUsers', scopeNames: 'root' },
        { roleName: 'system', action: 'includes', scopeNames: 'root' },
        { roleName: 'system', action: 'resourceAuthorization', scopeNames: 'root' },
        { roleName: 'system', action: 'atomAuthorization', scopeNames: 'root' },
        { roleName: 'system', action: 'deleteBulk' },
        { roleName: 'system', action: 'exportBulk' },
        // { roleName: 'system', action: 'buildBulk' },
      ];
      await ctx.bean.role.addRoleRightBatch({ atomClassName: 'role', roleRights });
    }

    async _addRoleRightsUser() {
      // add role rights
      const roleRights = [
        { roleName: 'system', action: 'read', scopeNames: 'root' },
        { roleName: 'system', action: 'write', scopeNames: 'root' },
        // { roleName: 'system', action: 'delete', scopeNames: 'root' },
        // { roleName: 'system', action: 'clone', scopeNames: 'root' },
        { roleName: 'system', action: 'enable', scopeNames: 'root' },
        { roleName: 'system', action: 'disable', scopeNames: 'root' },
        { roleName: 'system', action: 'userRoles', scopeNames: 'root' },
        { roleName: 'system', action: 'resourceAuthorization', scopeNames: 'root' },
        { roleName: 'system', action: 'atomAuthorization', scopeNames: 'root' },
        // { roleName: 'system', action: 'deleteBulk' },
        { roleName: 'system', action: 'exportBulk' },
      ];
      await ctx.bean.role.addRoleRightBatch({ atomClassName: 'user', roleRights });
    }
  }

  return VersionInit;
};
