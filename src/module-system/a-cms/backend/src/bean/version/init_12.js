module.exports = app => {
  // const moduleInfo = module.info;
  class Version {
    async _init_12(options) {
      // add role rights
      const roleRights = [
        { roleName: 'root', action: 'layout', scopeNames: 'root' }, //
        { roleName: 'root', action: 'preview', scopeNames: 'root' }, //
      ];
      await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'article', roleRights });
    }
  }
  return Version;
};
