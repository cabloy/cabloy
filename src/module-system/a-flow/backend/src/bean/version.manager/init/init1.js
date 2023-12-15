module.exports = class VersionInit {
  async run(options) {
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
    //   { roleName: 'system', action: 'deleteBulk' },
    //   { roleName: 'system', action: 'exportBulk' },
    // ];
    // await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'flowDef', roleRights });
  }
};
