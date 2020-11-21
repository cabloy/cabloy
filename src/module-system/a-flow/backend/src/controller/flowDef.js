module.exports = app => {

  class FlowDefController extends app.Controller {

    async enable() {
      const res = await this.ctx.service.flowDef.enable({
        flowDefId: this.ctx.request.body.key.atomId,
      });
      this.ctx.success(res);
    }

    async disable() {
      const res = await this.ctx.service.flowDef.disable({
        flowDefId: this.ctx.request.body.key.atomId,
      });
      this.ctx.success(res);
    }

  }
  return FlowDefController;
};
