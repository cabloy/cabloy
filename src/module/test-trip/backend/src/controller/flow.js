module.exports = app => {

  class FlowController extends app.Controller {

    async start() {
      // start flow

      this.ctx.success();
    }

  }

  return FlowController;
};

