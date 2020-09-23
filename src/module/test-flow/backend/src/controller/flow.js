module.exports = app => {

  class FlowController extends app.Controller {

    async start() {
      // start
      await this.ctx.bean.flow.startByKey({
        flowDefKey: this.ctx.request.body.flowDefKey,
      });
      this.ctx.success();
    }

  }

  return FlowController;
};

