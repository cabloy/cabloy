module.exports = app => {

  class FlowController extends app.Controller {

    async data() {
      const res = await this.ctx.service.flow.data({
        flowId: this.ctx.request.body.flowId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return FlowController;
};
