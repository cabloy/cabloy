module.exports = function (ctx) {
  class VersionInit {
    async run() {
      await this._changeTemplateRole();
      await this._addRoleRightsResource();
      await this._addRoleRightsRole();
      await this._addRoleRightsUser();
    }

    async _changeTemplateRole() {
      const role = await ctx.bean.role.parseRoleName({ roleName: 'template' });
      await ctx.bean.role.move({ roleId: role.id, roleIdParent: 0 });
      await ctx.bean.role.setDirty(true);
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
        // template
        { roleName: 'system', action: 'read', scopeNames: 'template' },
        { roleName: 'system', action: 'write', scopeNames: 'template' },
        { roleName: 'system', action: 'delete', scopeNames: 'template' },
        { roleName: 'system', action: 'clone', scopeNames: 'template' },
        { roleName: 'system', action: 'move', scopeNames: 'template' },
        { roleName: 'system', action: 'addChild', scopeNames: 'template' },
        // { roleName: 'system', action: 'roleUsers', scopeNames: 'template' },
        // { roleName: 'system', action: 'includes', scopeNames: 'template' },
        { roleName: 'system', action: 'resourceAuthorizations', scopeNames: 'template' },
        { roleName: 'system', action: 'atomAuthorizations', scopeNames: 'template' },
        // root
        { roleName: 'system', action: 'read', scopeNames: 'root' },
        { roleName: 'system', action: 'write', scopeNames: 'root' },
        { roleName: 'system', action: 'delete', scopeNames: 'root' },
        { roleName: 'system', action: 'clone', scopeNames: 'root' },
        { roleName: 'system', action: 'move', scopeNames: 'root' },
        { roleName: 'system', action: 'addChild', scopeNames: 'root' },
        { roleName: 'system', action: 'roleUsers', scopeNames: 'root' },
        { roleName: 'system', action: 'includes', scopeNames: 'root' },
        { roleName: 'system', action: 'resourceAuthorizations', scopeNames: 'root' },
        { roleName: 'system', action: 'atomAuthorizations', scopeNames: 'root' },
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
        { roleName: 'system', action: 'resourceAuthorizations', scopeNames: 'root' },
        { roleName: 'system', action: 'atomAuthorizations', scopeNames: 'root' },
        // { roleName: 'system', action: 'deleteBulk' },
        { roleName: 'system', action: 'exportBulk' },
      ];
      await ctx.bean.role.addRoleRightBatch({ atomClassName: 'user', roleRights });
    }
  }

  return VersionInit;
};
