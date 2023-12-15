module.exports = class VersionInit {
  async run(options) {
    // add role rights
    let roleRights = [
      //
      { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
      // custom
      { roleName: 'system', action: 'kickOut', scopeNames: 'authenticated' },
    ];
    await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'userOnline', roleRights });
    //
    roleRights = [
      //
      { roleName: 'system', action: 'read' },
      { roleName: 'system', action: 'delete' },
      { roleName: 'system', action: 'deleteBulk' },
      // todo: only for test
      // { roleName: 'system', action: 'exportBulk' },
      // { roleName: 'system', action: 'create' },
      // { roleName: 'system', action: 'write' },
      // { roleName: 'system', action: 'clone' },
    ];
    await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'userOnlineHistory', roleRights });
  }
};
