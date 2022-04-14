const initData = require('./initData1.js');

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassRole = {
    module: 'a-base',
    atomClassName: 'role',
  };
  class VersionInit {
    async run(options) {
      // rights
      await this._init_rights();
      // open auth scopes
      await this._init_roleScopes();
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
      await ctx.bean.role.addRoleRightBatch({ atomClassName: 'authOpen', roleRights });
    }

    async _init_roleScopes() {
      for (const roleScope of initData.roleScopes) {
        // item
        const item = { ...roleScope };
        // roleIdParent
        const role = await ctx.bean.role.parseRoleName({ roleName: roleScope.roleIdParent });
        item.roleIdParent = role.id;
        // loadAtomStatic
        const atomKey = await ctx.bean.atomStatic.loadAtomStatic({
          moduleName: moduleInfo.relativeName,
          atomClass: __atomClassRole,
          item,
        });
        if (atomKey && roleScope._roleRights) {
          // role rights
          const roleRights = [{ roleName: roleScope._roleRights, action: 'read', scopeNames: [atomKey.itemId] }];
          await ctx.bean.role.addRoleRightBatch({
            module: 'a-base',
            atomClassName: 'role',
            roleRights,
          });
        }
      }
    }
  }
  return VersionInit;
};
