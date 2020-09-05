module.exports = app => {

  class Test extends app.Service {

    async getMemberId({ user }) {
      const modelMember = this.ctx.model.module('a-dingtalk').member;
      const member = await modelMember.get({ userId: user.id });
      return {
        memberId: member.memberId,
      };
    }

    async sendAppMessage({ message, user }) {
      const msg = {
        msgtype: 'text',
        text: {
          content: message.text,
        },
      };
      const content = {
        userIds: [ user.id ],
        data: { msg },
      };
      await this.ctx.bean.io.pushDirect({
        content,
        channel: { module: 'a-dingtalk', name: 'app' },
      });
    }

  }

  return Test;
};
