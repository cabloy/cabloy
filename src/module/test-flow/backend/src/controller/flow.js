module.exports = app => {

  class FlowController extends app.Controller {

    async start() {
      // start
      await this.ctx.bean.flow.startInstanceByKey({
        flowDefinitionKey: this.ctx.request.body.flowDefinitionKey,
      });
      this.ctx.success();
    }

  }

  return FlowController;
};

