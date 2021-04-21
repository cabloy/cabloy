module.exports = app => {

  class FlowDefController extends app.Controller {

    async normalizeAssignees() {
      const { host, assignees } = this.ctx.request.body;
      const user = this.ctx.state.user.op;
      const res = await this.ctx.service.flowDef.normalizeAssignees({
        host, assignees, user,
      });
      this.ctx.success(res);
    }

    async roleChildren() {
      const { host, params } = this.ctx.request.body;
      const user = this.ctx.state.user.op;
      const page = params.page;
      const items = await this.ctx.service.flowDef.roleChildren({
        host, params, user,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async userSelect() {
      const { host, params } = this.ctx.request.body;
      const user = this.ctx.state.user.op;
      const page = params.page;
      const items = await this.ctx.service.flowDef.userSelect({
        host, params, user,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async flowChartProcess() {
      const { host } = this.ctx.request.body;
      const user = this.ctx.state.user.op;
      const res = await this.ctx.service.flowDef.flowChartProcess({
        host, user,
      });
      this.ctx.success(res);
    }

  }
  return FlowDefController;
};
