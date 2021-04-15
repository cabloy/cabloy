module.exports = app => {

  class FlowDefController extends app.Controller {

    async normalizeAssignees() {
      const { flowDefId, nodeDefId, assignees } = this.ctx.request.body;
      const user = this.ctx.state.user.op;
      const res = this.ctx.service.flowDef.normalizeAssignees({
        flowDefId, nodeDefId, assignees, user,
      });
      this.ctx.success(res);
    }

  }
  return FlowDefController;
};
