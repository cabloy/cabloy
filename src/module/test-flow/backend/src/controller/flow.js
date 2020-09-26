module.exports = app => {

  class FlowController extends app.Controller {

    async start() {
      // start
      await this.ctx.bean.flow.startByKey({
        flowDefKey: this.ctx.request.body.flowDefKey,
        flowVars: this.ctx.request.body.flowVars,
        flowUserId: this.ctx.state.user.op.id,
      });
      this.ctx.success();
    }

  }

  return FlowController;
};

