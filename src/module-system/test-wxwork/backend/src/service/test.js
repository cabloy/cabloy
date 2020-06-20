module.exports = app => {

  class Test extends app.Service {

    async getMemberId({ user }) {
      const modelMember = this.ctx.model.module('a-wxwork').member;
      const member = await modelMember.get({ userId: user.id });
      return {
        memberId: member.memberId,
      };
    }

    async sendAppMessage({ message, user }) {
      const content = {
        userIds: [ user.id ],
        data: {
          msgtype: 'text',
          text: {
            content: message.text,
          },
        },
      };
      await this.ctx.meta.io.pushDirect({
        content,
        channel: { module: 'a-wxwork', name: 'app' },
      });
    }

  }

  return Test;
};
