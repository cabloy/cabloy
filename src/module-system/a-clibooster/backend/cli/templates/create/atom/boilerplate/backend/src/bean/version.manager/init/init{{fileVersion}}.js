module.exports = class VersionInit {
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
      { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
      { roleName: 'system', action: 'write', scopeNames: 'authenticated' },
      { roleName: 'system', action: 'delete', scopeNames: 'authenticated' },
      { roleName: 'system', action: 'clone', scopeNames: 'authenticated' },
    ];
    await this.ctx.bean.role.addRoleRightBatch({ atomClassName: '<%=argv.atomClassName%>', roleRights });
  }
};
