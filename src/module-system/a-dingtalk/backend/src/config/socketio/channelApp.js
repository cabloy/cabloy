const WxworkHelperFn = require('../../common/wxworkHelper.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  async function onPush({ ctx, content }) {
    // userIds / roleIds
    const userIds = content.userIds;
    const roleIds = content.roleIds;
    // message
    const message = {
      ... content.data,
    };
    // agentid
    const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
    message.agentid = config.apps.selfBuilt.agentid;
    // userIds
    if (userIds && userIds.length > 0) {
      const modelMember = ctx.model.module(moduleInfo.relativeName).member;
      const list = await modelMember.select({
        where: { userId: userIds },
        columns: [ 'memberId' ],
      });
      message.touser = list.map(item => item.memberId).join('|');
    }
    // roleIds
    if (roleIds && roleIds.length > 0) {
      const modelDepartment = ctx.model.module(moduleInfo.relativeName).department;
      const list = await modelDepartment.select({
        where: { roleId: roleIds },
        columns: [ 'departmentId' ],
      });
      message.toparty = list.map(item => item.departmentId).join('|');
    }
    // send
    const wxworkHelper = new (WxworkHelperFn(ctx))();
    const api = wxworkHelper.createWxworkApi();
    await api.app.selfBuilt.sendMessage(message);
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
