module.exports = app => {

  class FlowDefController extends app.Controller {

    parseAssignees() {
      const res = this.ctx.service.flowDef.parseAssignees();
      this.ctx.success(res);
    }

  }
  return FlowDefController;
};
