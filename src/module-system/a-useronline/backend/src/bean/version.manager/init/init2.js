module.exports = class VersionInit {
  async run(options) {
    // add role rights
    const roleRights = [
      // custom
      { roleName: 'system', action: 'loginLog', scopeNames: 'authenticated' },
    ];
    await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'userOnline', roleRights });
  }
};
