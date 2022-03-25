module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IOChannel extends ctx.app.meta.IOChannelBase(ctx) {
    async onPush({ content /* options, message, messageSync, messageClass*/ }) {
      // userIds / roleIds
      const userIds = content.userIds;
      const roleIds = content.roleIds;
      // message
      const message = {
        ...content.data,
      };
      // bean provider
      const beanProvider = ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName: 'wxwork',
        providerScene: 'selfBuilt',
      });
      if (!beanProvider.providerSceneValid) return false;
      // config
      const config = beanProvider.configProviderScene;
      // agentid
      message.agentid = config.agentId;
      // userIds
      if (userIds && userIds.length > 0) {
        const modelMember = ctx.model.module(moduleInfo.relativeName).member;
        const list = await modelMember.select({
          where: { userId: userIds },
          columns: ['memberId'],
        });
        message.touser = list.map(item => item.memberId).join('|');
      }
      // roleIds
      if (roleIds && roleIds.length > 0) {
        const modelDepartment = ctx.model.module(moduleInfo.relativeName).department;
        const list = await modelDepartment.select({
          where: { roleId: roleIds },
          columns: ['departmentId'],
        });
        message.toparty = list.map(item => item.departmentId).join('|');
      }
      // check target
      if (!message.touser && !message.toparty) {
        return false;
      }
      // send
      await ctx.bean.wxwork.app.selfBuilt.sendMessage(message);
      // done
      return true;
    }
  }
  return IOChannel;
};
