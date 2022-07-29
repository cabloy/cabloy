module.exports = function (ctx) {
  class VersionInit {
    async run() {
      // do nothing, see also: init14.js
      // // add role rights
      // const roleRights = [
      //   { roleName: 'system', action: 'create' },
      //   { roleName: 'system', action: 'read', scopeNames: 0 },
      //   { roleName: 'system', action: 'read', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'write', scopeNames: 0 },
      //   { roleName: 'system', action: 'write', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'delete', scopeNames: 0 },
      //   { roleName: 'system', action: 'delete', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'clone', scopeNames: 0 },
      //   { roleName: 'system', action: 'clone', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'enable', scopeNames: 0 },
      //   { roleName: 'system', action: 'enable', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'disable', scopeNames: 0 },
      //   { roleName: 'system', action: 'disable', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'authorize', scopeNames: 0 },
      //   { roleName: 'system', action: 'authorize', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'deleteBulk' },
      //   { roleName: 'system', action: 'exportBulk' },
      // ];
      // await ctx.bean.role.addRoleRightBatch({ atomClassName: 'resource', roleRights });
    }
  }

  return VersionInit;
};
