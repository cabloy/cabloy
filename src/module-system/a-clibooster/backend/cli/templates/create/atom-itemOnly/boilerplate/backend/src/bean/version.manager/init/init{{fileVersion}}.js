module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionInit {
    async run(options) {
      // add role rights
      const roleRights = [
        { roleName: 'authenticated', action: 'create' },
        { roleName: 'authenticated', action: 'read', scopeNames: 0 },
        { roleName: 'authenticated', action: 'write', scopeNames: 0 },
        { roleName: 'authenticated', action: 'delete', scopeNames: 0 },
        { roleName: 'authenticated', action: 'clone', scopeNames: 0 },
        { roleName: 'authenticated', action: 'deleteBulk' },
        { roleName: 'authenticated', action: 'exportBulk' },
        { roleName: 'system', action: 'read' },
        { roleName: 'system', action: 'write' },
        { roleName: 'system', action: 'delete' },
        { roleName: 'system', action: 'clone' },
      ];
      await ctx.bean.role.addRoleRightBatch({ atomClassName: '<%=argv.atomClassName%>', roleRights });
    }
  }

  return VersionInit;
};
