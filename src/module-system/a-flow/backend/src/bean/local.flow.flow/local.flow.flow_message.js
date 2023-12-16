// const moduleInfo = module.info;
module.exports = class FlowInstance {
  async _publishMessageFlowEnd({ flowUserId, user }) {
    if (!this.context._flow.flowAtomId) {
      // only support business flow
      return;
    }
    if (flowUserId === user.id) {
      // only send message to others
      return;
    }
    // publish uniform message
    const userFlow = await this.ctx.bean.user.get({ id: flowUserId });
    const title = `${this.ctx.text.locale(userFlow.locale, 'FlowTitle')} - ${this.ctx.text.locale(
      userFlow.locale,
      this.context._flow.flowRemark || 'End'
    )}`;
    const actionPath = `/a/flowtask/flow?flowId=${this.context._flowId}`;
    const message = {
      userIdTo: flowUserId,
      content: {
        issuerId: userFlow.id,
        issuerName: userFlow.userName,
        issuerAvatar: userFlow.avatar,
        title,
        body: this.context._flow.flowName,
        actionPath,
        params: {
          flowId: this.context._flowId,
        },
      },
    };
    // jump out of the transaction
    this.ctx.tail(async () => {
      await this.ctx.bean.io.publish({
        message,
        messageClass: {
          module: 'a-flow',
          messageClassName: 'workflow',
        },
      });
    });
  }
};
