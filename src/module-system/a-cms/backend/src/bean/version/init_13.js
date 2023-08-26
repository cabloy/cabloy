module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version {
    async _init_13(options) {
      // add role rights
      const roleRights = [
        { roleName: 'system', action: 'viewWorkflow', scopeNames: 'authenticated' }, //
      ];
      await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'article', roleRights });
    }
  }
  return Version;
};
