module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IOChannel extends ctx.app.meta.IOChannelBase(ctx) {
    async onPush({ content /* options, message, messageSync, messageClass*/ }) {
      // toAllUser
      const toAllUser = content.toAllUser || false;
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
        providerName: 'dingtalk',
        providerScene: 'selfBuilt',
      });
      if (!beanProvider.providerSceneValid) return false;
      // config
      const config = beanProvider.configProviderScene;
      // agentid
      message.agent_id = config.agentId;
      if (toAllUser) {
        message.to_all_user = true;
      } else {
        // userIds
        if (userIds && userIds.length > 0) {
          const modelMember = ctx.model.module(moduleInfo.relativeName).member;
          const list = await modelMember.select({
            where: { userId: userIds },
            columns: ['memberId'],
          });
          message.userid_list = list.map(item => item.memberId).join(',');
        }
        // roleIds
        if (roleIds && roleIds.length > 0) {
          const modelDepartment = ctx.model.module(moduleInfo.relativeName).department;
          const list = await modelDepartment.select({
            where: { roleId: roleIds },
            columns: ['departmentId'],
          });
          message.dept_id_list = list.map(item => item.departmentId).join(',');
        }
      }
      // send
      await ctx.bean.dingtalk.app.selfBuilt.message.sendMessage(message);
      // done
      return true;
    }
  }
  return IOChannel;
};
