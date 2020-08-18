const DingtalkHelperFn = require('../../common/dingtalkHelper.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  async function onPush({ ctx, content }) {
    // toAllUser
    const toAllUser = content.toAllUser || false;
    // userIds / roleIds
    const userIds = content.userIds;
    const roleIds = content.roleIds;
    // message
    const message = {
      ... content.data,
    };
    // agentid
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
    message.agent_id = config.apps.selfBuilt.agentid;
    if (toAllUser) {
      message.to_all_user = true;
    } else {
      // userIds
      if (userIds && userIds.length > 0) {
        const modelMember = ctx.model.module(moduleInfo.relativeName).member;
        const list = await modelMember.select({
          where: { userId: userIds },
          columns: [ 'memberId' ],
        });
        message.userid_list = list.map(item => item.memberId).join(',');
      }
      // roleIds
      if (roleIds && roleIds.length > 0) {
        const modelDepartment = ctx.model.module(moduleInfo.relativeName).department;
        const list = await modelDepartment.select({
          where: { roleId: roleIds },
          columns: [ 'departmentId' ],
        });
        message.dept_id_list = list.map(item => item.departmentId).join(',');
      }
    }
    // send
    const dingtalkHelper = new (DingtalkHelperFn(ctx))();
    const api = dingtalkHelper.createDingtalkApi();
    await api.app.selfBuilt.message.sendMessage(message);
    // done
    return true;
  }

  const ChannelApp = {
    info: {
      title: 'App Message',
    },
    callbacks: {
      onPush,
    },
  };
  return ChannelApp;
};
