module.exports = app => {

  class Test extends app.Service {

    async getMemberId({ user }) {
      const modelMember = this.ctx.model.module('a-wxwork').member;
      const member = await modelMember.get({ userId: user.id });
      return {
        memberId: member.memberId,
      };
    }

  }

  return Test;
};
